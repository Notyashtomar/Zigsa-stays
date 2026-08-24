import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRazorpay, razorpayConfigured } from "@/lib/razorpay";

const schema = z.object({
  bookingId: z.string().min(1),
});

export async function POST(request: Request) {
  const { bookingId } = schema.parse(await request.json());
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
    return NextResponse.json({
      fallback: true,
      confirmationCode: booking.confirmationCode,
      amount: booking.totalAmount,
    });
  }

  const razorpay = getRazorpay();
  if (!razorpay) {
    return NextResponse.json({ fallback: true, confirmationCode: booking.confirmationCode });
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
