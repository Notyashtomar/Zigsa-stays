import Link from "next/link";
import { expireStaleBookings } from "@/lib/booking";
import { formatStayDate } from "@/lib/dates";
import { formatINR } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin" };

export default async function AdminHomePage() {
  await expireStaleBookings();
  const [bookings, rooms, blocked] = await Promise.all([
    prisma.booking.findMany({
      include: { roomType: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.roomType.count(),
    prisma.blockedDate.count(),
  ]);
  const confirmed = bookings.filter((item) => item.status === "CONFIRMED").length;
  const pending = await prisma.booking.count({ where: { status: "PENDING_PAYMENT" } });

  return (
    <main className="space-y-8">
      <div>
        <p className="eyebrow">Desk</p>
        <h1 className="font-display mt-2 text-4xl text-forest-900">Zigsa Stays Manali</h1>
        <p className="mt-2 text-sm text-ink-600">One property. Rooms, rates, and the calendar live here.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-cream-50 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-ink-500">Room types</p>
          <p className="font-display mt-2 text-3xl">{rooms}</p>
        </div>
        <div className="rounded-2xl bg-cream-50 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-ink-500">Awaiting payment</p>
          <p className="font-display mt-2 text-3xl">{pending}</p>
        </div>
        <div className="rounded-2xl bg-cream-50 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-ink-500">Blocked ranges</p>
          <p className="font-display mt-2 text-3xl">{blocked}</p>
        </div>
      </div>
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-forest-900">Latest bookings</h2>
          <Link href="/admin/bookings" className="text-sm text-forest-700 underline">
            Full list
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-wood-300/60 bg-cream-50">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-wood-300/60 text-xs uppercase tracking-[0.12em] text-ink-500">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Guest</th>
                <th className="px-4 py-3">Room</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-t border-wood-200">
                  <td className="px-4 py-3 font-medium">{booking.confirmationCode}</td>
                  <td className="px-4 py-3">{booking.guestName}</td>
                  <td className="px-4 py-3">{booking.roomType.name}</td>
                  <td className="px-4 py-3">
                    {formatStayDate(booking.checkIn)} → {formatStayDate(booking.checkOut)}
                  </td>
                  <td className="px-4 py-3">{formatINR(booking.totalAmount)}</td>
                  <td className="px-4 py-3">{booking.status.replaceAll("_", " ")}</td>
                </tr>
              ))}
              {bookings.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-ink-500" colSpan={6}>
                    No bookings yet. {confirmed} confirmed in this slice.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
