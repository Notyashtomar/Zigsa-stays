import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { expireStaleBookings } from "@/lib/booking";
import { formatStayDate } from "@/lib/dates";
import { formatINR } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Booking status",
};

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; status?: string }>;
}) {
  const { code, status } = await searchParams;
  await expireStaleBookings();
  const booking = code
    ? await prisma.booking.findUnique({
        where: { confirmationCode: code.toUpperCase() },
        include: { roomType: true },
      })
    : null;

  const tone =
    booking?.status === "CONFIRMED" || status === "paid"
      ? "success"
      : booking?.status === "EXPIRED" || status === "failed"
        ? "failed"
        : "pending";

  const title =
    tone === "success"
      ? "You are on the hill."
      : tone === "failed"
        ? "Payment did not finish."
        : "We are holding the room.";

  const lede =
    tone === "success"
      ? "The stay is confirmed. Bring a warm layer — Simsa evenings drop faster than Mall Road."
      : tone === "failed"
        ? "The hold may still be open for a few minutes. Try again, or message us and pay at the property."
        : "Unpaid holds expire in about 15 minutes. WhatsApp the desk if you would rather settle on arrival.";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="eyebrow">{tone === "success" ? "Confirmed" : tone === "failed" ? "Not completed" : "Pending payment"}</p>
        <h1 className="font-display mt-3 text-4xl text-forest-900">{title}</h1>
        <p className="mt-4 text-ink-700">{lede}</p>

        {booking ? (
          <dl className="mt-10 space-y-3 rounded-3xl border border-wood-300/70 bg-cream-50 p-6 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-500">Confirmation</dt>
              <dd className="font-semibold">{booking.confirmationCode}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-500">Status</dt>
              <dd>{booking.status.replaceAll("_", " ")}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-500">Room</dt>
              <dd>{booking.roomType.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-500">Dates</dt>
              <dd>
                {formatStayDate(booking.checkIn)} → {formatStayDate(booking.checkOut)} · {booking.nights} night
                {booking.nights === 1 ? "" : "s"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-500">Guests</dt>
              <dd>{booking.guests}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-500">Total</dt>
              <dd className="font-semibold">{formatINR(booking.totalAmount)}</dd>
            </div>
          </dl>
        ) : (
          <p className="mt-8 rounded-2xl bg-wood-200/40 p-4 text-sm">
            We could not find that confirmation code. Check the link or write to the desk with your dates.
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {booking ? (
            <WhatsAppLink
              message={`Hello Zigsa Stays, booking ${booking.confirmationCode} for ${booking.roomType.name}, ${formatStayDate(booking.checkIn)} to ${formatStayDate(booking.checkOut)}.`}
            >
              WhatsApp this booking
            </WhatsAppLink>
          ) : (
            <WhatsAppLink>WhatsApp the desk</WhatsAppLink>
          )}
          <Link href="/book" className="btn-secondary">
            Book again
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
