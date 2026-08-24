import { formatINR } from "@/lib/money";
import { formatStayDate } from "@/lib/dates";
import type { Booking, Property, RoomType } from "@prisma/client";

type BookingWithRelations = Booking & {
  roomType: RoomType;
  property: Property;
};

export async function sendBookingEmails(booking: BookingWithRelations) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    return { sent: false as const, reason: "Resend is not configured." };
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const subject =
    booking.status === "CONFIRMED"
      ? `Stay confirmed — ${booking.confirmationCode}`
      : `Booking received — ${booking.confirmationCode}`;

  const body = [
    `Hello ${booking.guestName},`,
    "",
    `Zigsa Stays — ${booking.confirmationCode}`,
    `${booking.roomType.name} · ${booking.nights} night${booking.nights === 1 ? "" : "s"}`,
    `Check-in ${formatStayDate(booking.checkIn)} · Check-out ${formatStayDate(booking.checkOut)}`,
    `${booking.guests} guest${booking.guests === 1 ? "" : "s"} · ${formatINR(booking.totalAmount)}`,
    "",
    booking.property.address,
    booking.property.phone1,
    booking.property.phone2 ?? "",
    "",
    "Elevation: High. Stress: Zero.",
  ]
    .filter(Boolean)
    .join("\n");

  await resend.emails.send({
    from,
    to: booking.guestEmail,
    subject,
    text: body,
  });

  const staff = process.env.STAFF_NOTIFY_EMAIL;
  if (staff) {
    await resend.emails.send({
      from,
      to: staff,
      subject: `New booking ${booking.confirmationCode}`,
      text: body,
    });
  }

  return { sent: true as const };
}
