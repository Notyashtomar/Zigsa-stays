import { NextResponse } from "next/server";
import { z } from "zod";
import { markBookingPaid } from "@/lib/booking";
import { sendBookingEmails } from "@/lib/email";
import { verifyCheckoutSignature } from "@/lib/razorpay";

const schema = z.object({
  bookingId: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const valid = verifyCheckoutSignature({
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      signature: body.razorpay_signature,
    });
    if (!valid) {
      return NextResponse.json({ error: "Payment signature did not match." }, { status: 400 });
    }

    const booking = await markBookingPaid({
      bookingId: body.bookingId,
      razorpayOrderId: body.razorpay_order_id,
      razorpayPaymentId: body.razorpay_payment_id,
      razorpaySignature: body.razorpay_signature,
    });

    try {
      await sendBookingEmails(booking);
    } catch (error) {
      console.error("Email send skipped or failed", error);
    }

    return NextResponse.json({
      ok: true,
      confirmationCode: booking.confirmationCode,
      status: booking.status,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not verify payment." }, { status: 400 });
  }
}
