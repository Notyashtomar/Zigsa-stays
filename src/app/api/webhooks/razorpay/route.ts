import { NextResponse } from "next/server";
import { markBookingPaid } from "@/lib/booking";
import { sendBookingEmails } from "@/lib/email";
import { verifyWebhookSignature } from "@/lib/razorpay";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  const event = JSON.parse(rawBody) as {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
        };
      };
    };
  };

  if (event.event === "payment.captured" || event.event === "order.paid") {
    const orderId = event.payload?.payment?.entity?.order_id;
    const paymentId = event.payload?.payment?.entity?.id;
    if (orderId) {
      try {
        const booking = await markBookingPaid({
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
        });
        try {
          await sendBookingEmails(booking);
        } catch (error) {
          console.error("Webhook email failed", error);
        }
      } catch (error) {
        console.error("Webhook booking update", error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
