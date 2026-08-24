"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { formatINR } from "@/lib/money";
import { nightsBetween, parseDateOnly } from "@/lib/dates";
import { site, whatsappHref } from "@/lib/site";
import type { PublicRoom } from "@/lib/booking";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (document.getElementById("razorpay-checkout")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function BookForm({
  rooms,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
  initialRoomSlug,
}: {
  rooms: PublicRoom[];
  initialCheckIn: string;
  initialCheckOut: string;
  initialGuests: number;
  initialRoomSlug?: string;
}) {
  const router = useRouter();
  const firstRoom = rooms.find((room) => room.slug === initialRoomSlug) ?? rooms[0];
  const [roomTypeId, setRoomTypeId] = useState(firstRoom?.id ?? "");
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(String(initialGuests));
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [availability, setAvailability] = useState<{
    available: number;
    blocked: boolean;
    ratePerNight: number;
  } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const room = rooms.find((item) => item.id === roomTypeId);
  const checkInDate = parseDateOnly(checkIn);
  const checkOutDate = parseDateOnly(checkOut);
  const nights = checkInDate && checkOutDate ? nightsBetween(checkInDate, checkOutDate) : 0;
  const rate = availability?.ratePerNight ?? room?.baseRateNight ?? 0;
  const total = nights > 0 ? rate * nights : 0;

  useEffect(() => {
    if (!roomTypeId || !checkIn || !checkOut || nights < 1) {
      setAvailability(null);
      return;
    }
    const controller = new AbortController();
    fetch(`/api/availability?roomTypeId=${roomTypeId}&checkIn=${checkIn}&checkOut=${checkOut}`, {
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data) => {
        setAvailability({
          available: data.available ?? 0,
          blocked: Boolean(data.blocked),
          ratePerNight: data.ratePerNight ?? 0,
        });
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [roomTypeId, checkIn, checkOut, nights]);

  const availabilityNote = useMemo(() => {
    if (nights < 1) return "Choose a check-out after check-in.";
    if (!availability) return "Checking the hillside calendar…";
    if (availability.blocked) return "Those dates are blocked for this room.";
    if (availability.available < 1) return "This room type is already held or booked for those nights.";
    return `${availability.available} of this type still open for your dates.`;
  }, [availability, nights]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const created = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomTypeId,
          guestName,
          guestEmail,
          guestPhone,
          checkIn,
          checkOut,
          guests: Number(guests),
          notes,
        }),
      }).then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not hold the room.");
        return data as { bookingId: string; confirmationCode: string };
      });

      const order = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: created.bookingId }),
      }).then(async (response) => response.json());

      if (order.fallback || !order.orderId) {
        router.push(`/book/confirm?code=${created.confirmationCode}&status=pending`);
        return;
      }

      const scriptOk = await loadRazorpayScript();
      if (!scriptOk || !window.Razorpay) {
        router.push(`/book/confirm?code=${created.confirmationCode}&status=pending`);
        return;
      }

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: site.nameLong,
        description: order.description,
        order_id: order.orderId,
        prefill: {
          name: order.name,
          email: order.email,
          contact: order.phone,
        },
        notes: { confirmationCode: created.confirmationCode },
        theme: { color: "#1B3A2F" },
        handler: async (payload: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verified = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookingId: created.bookingId,
              ...payload,
            }),
          });
          if (verified.ok) {
            router.push(`/book/confirm?code=${created.confirmationCode}&status=paid`);
          } else {
            router.push(`/book/confirm?code=${created.confirmationCode}&status=failed`);
          }
        },
        modal: {
          ondismiss: () => {
            router.push(`/book/confirm?code=${created.confirmationCode}&status=pending`);
          },
        },
      });
      checkout.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (!room) {
    return <p>No rooms are listed yet. Seed the database and refresh.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-5 rounded-3xl border border-wood-300/70 bg-cream-50 p-6 shadow-sm">
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="font-display mb-2 text-2xl text-forest-900">Your dates</legend>
          <label className="block text-sm">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Check-in</span>
            <input className="field" type="date" required value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Check-out</span>
            <input className="field" type="date" required min={checkIn} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Room type</span>
            <select className="field" value={roomTypeId} onChange={(e) => setRoomTypeId(e.target.value)}>
              {rooms.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} · sleeps {item.maxGuests}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Guests</span>
            <input
              className="field"
              type="number"
              min={1}
              max={room.maxGuests}
              required
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </label>
        </fieldset>
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="font-display mb-2 text-2xl text-forest-900">Guest details</legend>
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Full name</span>
            <input className="field" required value={guestName} onChange={(e) => setGuestName(e.target.value)} autoComplete="name" />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Email</span>
            <input className="field" type="email" required value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} autoComplete="email" />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Phone</span>
            <input className="field" type="tel" required value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} autoComplete="tel" />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Notes (optional)</span>
            <textarea className="field min-h-24" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
        </fieldset>
      </div>
      <aside className="space-y-4 rounded-3xl bg-forest-900 p-6 text-cream-50 lg:sticky lg:top-24">
        <p className="eyebrow text-wood-300">Stay summary</p>
        <h2 className="font-display text-3xl">{room.name}</h2>
        <p className="text-sm text-cream-200/80">{availabilityNote}</p>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt>Nights</dt>
            <dd>{nights > 0 ? nights : "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Rate / night</dt>
            <dd>{formatINR(rate)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-white/10 pt-2 text-base font-semibold">
            <dt>Total</dt>
            <dd>{nights > 0 ? formatINR(total) : "—"}</dd>
          </div>
        </dl>
        {error ? <p className="rounded-xl bg-cream-50/10 px-3 py-2 text-sm text-wood-300">{error}</p> : null}
        <button type="submit" className="btn-primary w-full bg-wood-400 text-forest-950 hover:bg-wood-300" disabled={busy || nights < 1}>
          {busy ? "Holding your room…" : "Pay with UPI or card"}
        </button>
        <p className="text-xs leading-relaxed text-cream-200/70">
          Razorpay opens when test or live keys are set. Otherwise we hold the room for 15 minutes and you can confirm on{" "}
          <a className="underline" href={whatsappHref("Hello Zigsa Stays, I would like to book a stay.")}>
            WhatsApp
          </a>{" "}
          or pay at the property.
        </p>
      </aside>
    </form>
  );
}
