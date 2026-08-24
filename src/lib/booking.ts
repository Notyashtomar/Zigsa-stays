import { BookingStatus, Prisma } from "@prisma/client";
import { HOLD_MINUTES, nightsBetween } from "@/lib/dates";
import { prisma } from "@/lib/prisma";

export async function expireStaleBookings() {
  const now = new Date();
  await prisma.booking.updateMany({
    where: {
      status: BookingStatus.PENDING_PAYMENT,
      expiresAt: { lt: now },
    },
    data: { status: BookingStatus.EXPIRED },
  });
}

export function makeConfirmationCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `ZS-${suffix}`;
}

export async function getPrimaryProperty() {
  const property = await prisma.property.findFirst({
    orderBy: { createdAt: "asc" },
    include: {
      roomTypes: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
  return property;
}

export async function isDateBlocked(options: {
  propertyId: string;
  roomTypeId: string;
  checkIn: Date;
  checkOut: Date;
}) {
  const block = await prisma.blockedDate.findFirst({
    where: {
      propertyId: options.propertyId,
      startDate: { lt: options.checkOut },
      endDate: { gt: options.checkIn },
      OR: [{ roomTypeId: options.roomTypeId }, { roomTypeId: null }],
    },
  });
  return Boolean(block);
}

export async function countOccupiedUnits(options: {
  roomTypeId: string;
  checkIn: Date;
  checkOut: Date;
}) {
  await expireStaleBookings();
  return prisma.booking.count({
    where: {
      roomTypeId: options.roomTypeId,
      status: { in: [BookingStatus.PENDING_PAYMENT, BookingStatus.CONFIRMED] },
      checkIn: { lt: options.checkOut },
      checkOut: { gt: options.checkIn },
    },
  });
}

export async function getRoomAvailability(options: {
  roomTypeId: string;
  checkIn: Date;
  checkOut: Date;
}) {
  const room = await prisma.roomType.findUnique({
    where: { id: options.roomTypeId },
  });
  if (!room || !room.isActive) {
    return { room: null, available: 0, inventory: 0, blocked: false };
  }

  const blocked = await isDateBlocked({
    propertyId: room.propertyId,
    roomTypeId: room.id,
    checkIn: options.checkIn,
    checkOut: options.checkOut,
  });
  if (blocked) {
    return { room, available: 0, inventory: room.inventoryCount, blocked: true };
  }

  const occupied = await countOccupiedUnits(options);
  return {
    room,
    available: Math.max(0, room.inventoryCount - occupied),
    inventory: room.inventoryCount,
    blocked: false,
  };
}

export class BookingError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
    this.name = "BookingError";
  }
}

export async function createHoldBooking(input: {
  roomTypeId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  notes?: string;
}) {
  const nights = nightsBetween(input.checkIn, input.checkOut);
  if (nights < 1) {
    throw new BookingError("Check-out must be after check-in.");
  }

  return prisma.$transaction(async (tx) => {
    await tx.booking.updateMany({
      where: {
        status: BookingStatus.PENDING_PAYMENT,
        expiresAt: { lt: new Date() },
      },
      data: { status: BookingStatus.EXPIRED },
    });

    const room = await tx.roomType.findUnique({
      where: { id: input.roomTypeId },
    });
    if (!room || !room.isActive) {
      throw new BookingError("That room type is not available.");
    }
    if (input.guests < 1 || input.guests > room.maxGuests) {
      throw new BookingError(`This room sleeps up to ${room.maxGuests} guests.`);
    }

    const blocked = await tx.blockedDate.findFirst({
      where: {
        propertyId: room.propertyId,
        startDate: { lt: input.checkOut },
        endDate: { gt: input.checkIn },
        OR: [{ roomTypeId: room.id }, { roomTypeId: null }],
      },
    });
    if (blocked) {
      throw new BookingError("Those dates are blocked for this room.");
    }

    const occupied = await tx.booking.count({
      where: {
        roomTypeId: room.id,
        status: { in: [BookingStatus.PENDING_PAYMENT, BookingStatus.CONFIRMED] },
        checkIn: { lt: input.checkOut },
        checkOut: { gt: input.checkIn },
      },
    });
    if (occupied >= room.inventoryCount) {
      throw new BookingError("No rooms of this type are left for those dates.");
    }

    const totalAmount = room.baseRateNight * nights;
    const expiresAt = new Date(Date.now() + HOLD_MINUTES * 60 * 1000);

    const booking = await tx.booking.create({
      data: {
        confirmationCode: makeConfirmationCode(),
        propertyId: room.propertyId,
        roomTypeId: room.id,
        guestName: input.guestName,
        guestEmail: input.guestEmail,
        guestPhone: input.guestPhone,
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        nights,
        guests: input.guests,
        ratePerNight: room.baseRateNight,
        totalAmount,
        status: BookingStatus.PENDING_PAYMENT,
        notes: input.notes,
        expiresAt,
      },
      include: { roomType: true, property: true },
    });

    await tx.payment.create({
      data: {
        bookingId: booking.id,
        amount: totalAmount,
        currency: "INR",
        status: "created",
      },
    });

    return booking;
  });
}

export async function markBookingPaid(options: {
  bookingId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}) {
  const booking = await prisma.booking.findFirst({
    where: {
      OR: [
        options.bookingId ? { id: options.bookingId } : undefined,
        options.razorpayOrderId
          ? { payment: { razorpayOrderId: options.razorpayOrderId } }
          : undefined,
      ].filter(Boolean) as Prisma.BookingWhereInput[],
    },
    include: { payment: true, roomType: true, property: true },
  });

  if (!booking) {
    throw new BookingError("Booking not found.", 404);
  }
  if (booking.status === BookingStatus.CANCELLED) {
    throw new BookingError("This booking was cancelled.", 409);
  }
  if (booking.status === BookingStatus.EXPIRED) {
    throw new BookingError("This unpaid hold has expired.", 409);
  }

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: {
      status: BookingStatus.CONFIRMED,
      expiresAt: null,
      payment: {
        update: {
          status: "paid",
          razorpayPaymentId: options.razorpayPaymentId,
          razorpaySignature: options.razorpaySignature,
        },
      },
    },
    include: { payment: true, roomType: true, property: true },
  });

  return updated;
}

export type PublicRoom = {
  id: string;
  name: string;
  slug: string;
  description: string;
  maxGuests: number;
  inventoryCount: number;
  baseRateNight: number;
  amenities: string[];
};

export function serializeRoom(room: {
  id: string;
  name: string;
  slug: string;
  description: string;
  maxGuests: number;
  inventoryCount: number;
  baseRateNight: number;
  amenities: string;
}): PublicRoom {
  let amenities: string[] = [];
  try {
    const parsed = JSON.parse(room.amenities) as unknown;
    if (Array.isArray(parsed)) {
      amenities = parsed.filter((item): item is string => typeof item === "string");
    }
  } catch {
    amenities = [];
  }
  return {
    id: room.id,
    name: room.name,
    slug: room.slug,
    description: room.description,
    maxGuests: room.maxGuests,
    inventoryCount: room.inventoryCount,
    baseRateNight: room.baseRateNight,
    amenities,
  };
}
