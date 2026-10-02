"use client";

import { useEffect, useState } from "react";
import { formatStayDate } from "@/lib/dates";
import { formatINR } from "@/lib/money";

type BookingRow = {
  id: string;
  confirmationCode: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalAmount: number;
  status: string;
  roomType: { name: string };
  payment: { status: string } | null;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [busyId, setBusyId] = useState("");

  async function load() {
    const data = await fetch("/api/admin/bookings").then((response) => response.json());
    setBookings(data.bookings ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: "CONFIRMED" | "CANCELLED") {
    setBusyId(id);
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
    setBusyId("");
  }

  return (
    <main className="space-y-6">
      <div>
        <p className="eyebrow">Calendar as a list</p>
        <h1 className="font-display mt-2 text-4xl text-forest-900">Bookings</h1>
        <p className="mt-2 text-sm text-ink-600">
          Pay-at-property reservations arrive confirmed — collect on arrival, cancel to free inventory. Unpaid online
          holds expire after 15 minutes.
        </p>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-wood-300/60 bg-cream-50">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-wood-300/60 text-xs uppercase tracking-[0.12em] text-ink-500">
            <tr>
              <th className="px-4 py-3">Stay</th>
              <th className="px-4 py-3">Guest</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t border-wood-200 align-top">
                <td className="px-4 py-3">
                  <p className="font-medium">{booking.confirmationCode}</p>
                  <p className="text-xs text-ink-500">
                    {formatStayDate(new Date(booking.checkIn))} → {formatStayDate(new Date(booking.checkOut))} ·{" "}
                    {booking.nights}n
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p>{booking.guestName}</p>
                  <p className="text-xs text-ink-500">{booking.guestEmail}</p>
                  <p className="text-xs text-ink-500">{booking.guestPhone}</p>
                </td>
                <td className="px-4 py-3">
                  {booking.roomType.name}
                  <span className="block text-xs text-ink-500">{booking.guests} guests</span>
                </td>
                <td className="px-4 py-3">
                  {formatINR(booking.totalAmount)}
                  <span className="block text-xs text-ink-500">
                    {booking.payment?.status === "pay_at_property"
                      ? "pay at property"
                      : booking.payment?.status === "paid"
                        ? "paid online"
                        : "unpaid"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                      booking.status === "CONFIRMED"
                        ? "bg-forest-800 text-cream-50"
                        : booking.status === "CANCELLED" || booking.status === "EXPIRED"
                          ? "bg-wood-200 text-ink-700"
                          : "bg-wood-400/70 text-forest-950"
                    }`}
                  >
                    {booking.status.replaceAll("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-2">
                    {booking.status !== "CONFIRMED" && booking.status !== "CANCELLED" ? (
                      <button
                        type="button"
                        className="btn-primary px-3 py-1.5 text-xs"
                        disabled={busyId === booking.id}
                        onClick={() => updateStatus(booking.id, "CONFIRMED")}
                      >
                        Mark confirmed
                      </button>
                    ) : null}
                    {booking.status !== "CANCELLED" ? (
                      <button
                        type="button"
                        className="btn-secondary px-3 py-1.5 text-xs"
                        disabled={busyId === booking.id}
                        onClick={() => updateStatus(booking.id, "CANCELLED")}
                      >
                        Cancel
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
            {bookings.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-ink-500" colSpan={6}>
                  No bookings yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
