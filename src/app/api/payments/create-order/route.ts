import { BookingStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { sendBookingEmails } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { getRazorpay, razorpayConfigured } from "@/lib/razorpay";

const schema = z.object({
  bookingId: z.string().min(1),
});

// Without Razorpay keys the booking becomes a durable pay-at-property
// reservation instead of a 15-minute hold that would silently expire.
async function reservePayAtProperty(bookingId: string) {
  const reserved = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: BookingStatus.CONFIRMED,
      expiresAt: null,
      payment: { update: { status: "pay_at_property" } },
    },
    include: { payment: true, roomType: true, property: true },
  });

  try {
    await sendBookingEmails(reserved);
  } catch (error) {
    console.error("Email send skipped or failed", error);
  }

  return reserved;
}

export async function POST(request: Request) {
  let bookingId: string;
  try {
    ({ bookingId } = schema.parse(await request.json()));
  } catch {
    return NextResponse.json({ error: "A booking id is required." }, { status: 400 });
  }
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { payment: true, roomType: true },
  });

  if (!booking || booking.status !== "PENDING_PAYMENT") {
    return NextResponse.json({ error: "Booking is not awaiting payment." }, { status: 400 });
  }
  if (booking.expiresAt && booking.expiresAt < new Date()) {
    return NextResponse.json({ error: "This hold has expired. Please book again." }, { status: 409 });
  }

  if (!razorpayConfigured()) {
    const reserved = await reservePayAtProperty(booking.id);
    return NextResponse.json({
      fallback: true,
      reserved: true,
      confirmationCode: reserved.confirmationCode,
      amount: reserved.totalAmount,
    });
  }

  const razorpay = getRazorpay();
  if (!razorpay) {
    const reserved = await reservePayAtProperty(booking.id);
    return NextResponse.json({
      fallback: true,
      reserved: true,
      confirmationCode: reserved.confirmationCode,
      amount: reserved.totalAmount,
    });
  }

  const order = await razorpay.orders.create({
    amount: booking.totalAmount,
    currency: "INR",
    receipt: booking.confirmationCode,
    notes: {
      bookingId: booking.id,
      room: booking.roomType.name,
    },
  });

  await prisma.payment.update({
    where: { bookingId: booking.id },
    data: {
      razorpayOrderId: order.id,
      status: "order_created",
    },
  });

  return NextResponse.json({
    fallback: false,
    orderId: order.id,
    amount: booking.totalAmount,
    currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID,
    confirmationCode: booking.confirmationCode,
    name: booking.guestName,
    email: booking.guestEmail,
    phone: booking.guestPhone,
    description: `${booking.roomType.name} · ${booking.nights} night${booking.nights === 1 ? "" : "s"}`,
  });
}
