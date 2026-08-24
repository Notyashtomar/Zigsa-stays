import { NextResponse } from "next/server";
import { z } from "zod";
import { BookingError, createHoldBooking } from "@/lib/booking";
import { parseDateOnly } from "@/lib/dates";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  roomTypeId: z.string().min(1),
  guestName: z.string().min(2).max(80),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(8).max(20),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().int().min(1).max(12),
  notes: z.string().max(400).optional(),
});

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Confirmation code is required." }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { confirmationCode: code.toUpperCase() },
    include: { roomType: true, payment: true },
  });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  return NextResponse.json({
    confirmationCode: booking.confirmationCode,
    status: booking.status,
    guestName: booking.guestName,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    nights: booking.nights,
    guests: booking.guests,
    totalAmount: booking.totalAmount,
    roomName: booking.roomType.name,
    expiresAt: booking.expiresAt,
  });
}

export async function POST(request: Request) {
  try {
    const body = createSchema.parse(await request.json());
    const checkIn = parseDateOnly(body.checkIn);
    const checkOut = parseDateOnly(body.checkOut);
    if (!checkIn || !checkOut) {
      return NextResponse.json({ error: "Dates must be YYYY-MM-DD." }, { status: 400 });
    }

    const booking = await createHoldBooking({
      roomTypeId: body.roomTypeId,
      guestName: body.guestName.trim(),
      guestEmail: body.guestEmail.trim().toLowerCase(),
      guestPhone: body.guestPhone.trim(),
      checkIn,
      checkOut,
      guests: body.guests,
      notes: body.notes?.trim(),
    });

    return NextResponse.json({
      bookingId: booking.id,
      confirmationCode: booking.confirmationCode,
      nights: booking.nights,
      totalAmount: booking.totalAmount,
      expiresAt: booking.expiresAt,
      roomName: booking.roomType.name,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Please check the booking details." }, { status: 400 });
    }
    if (error instanceof BookingError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error(error);
    return NextResponse.json({ error: "Could not create the booking." }, { status: 500 });
  }
}
