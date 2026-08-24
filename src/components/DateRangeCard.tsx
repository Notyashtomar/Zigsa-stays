"use client";

import { addDays } from "date-fns";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { toDateInput } from "@/lib/dates";

export function DateRangeCard({
  defaultCheckIn,
  defaultCheckOut,
  action = "/book",
  compact = false,
}: {
  defaultCheckIn?: string;
  defaultCheckOut?: string;
  action?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const defaults = useMemo(() => {
    const checkIn = defaultCheckIn ?? toDateInput(addDays(new Date(), 1));
    const checkOut = defaultCheckOut ?? toDateInput(addDays(new Date(), 3));
    return { checkIn, checkOut };
  }, [defaultCheckIn, defaultCheckOut]);

  const [checkIn, setCheckIn] = useState(defaults.checkIn);
  const [checkOut, setCheckOut] = useState(defaults.checkOut);
  const [guests, setGuests] = useState("2");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams({ checkIn, checkOut, guests });
    router.push(`${action}?${params.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`grid gap-3 rounded-3xl border border-wood-300/70 bg-cream-50/95 p-4 shadow-[0_20px_50px_rgba(18,38,29,0.18)] sm:grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_0.7fr_auto] ${compact ? "" : "sm:p-5"}`}
    >
      <label className="block text-sm">
        <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Check-in</span>
        <input
          className="field"
          type="date"
          name="checkIn"
          required
          value={checkIn}
          onChange={(event) => setCheckIn(event.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Check-out</span>
        <input
          className="field"
          type="date"
          name="checkOut"
          required
          value={checkOut}
          min={checkIn}
          onChange={(event) => setCheckOut(event.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Guests</span>
        <input
          className="field"
          type="number"
          name="guests"
          min={1}
          max={8}
          required
          value={guests}
          onChange={(event) => setGuests(event.target.value)}
        />
      </label>
      <div className="flex items-end">
        <button type="submit" className="btn-primary w-full lg:min-w-40">
          Check dates
        </button>
      </div>
    </form>
  );
}
