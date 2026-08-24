"use client";

import { FormEvent, useEffect, useState } from "react";
import { formatStayDate } from "@/lib/dates";

type RoomOption = { id: string; name: string };
type BlockRow = {
  id: string;
  startDate: string;
  endDate: string;
  reason: string | null;
  roomType: { name: string } | null;
};

export default function AdminBlockedPage() {
  const [rooms, setRooms] = useState<RoomOption[]>([]);
  const [blocked, setBlocked] = useState<BlockRow[]>([]);
  const [roomTypeId, setRoomTypeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const [roomData, blockData] = await Promise.all([
      fetch("/api/admin/rooms").then((response) => response.json()),
      fetch("/api/admin/blocked").then((response) => response.json()),
    ]);
    setRooms(roomData.rooms ?? []);
    setBlocked(blockData.blocked ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await fetch("/api/admin/blocked", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomTypeId: roomTypeId || null,
        startDate,
        endDate,
        reason,
      }),
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(data.error || "Could not block those dates.");
      return;
    }
    setReason("");
    await load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/blocked/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <main className="space-y-8">
      <div>
        <p className="eyebrow">Housekeeping calendar</p>
        <h1 className="font-display mt-2 text-4xl text-forest-900">Blocked dates</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-600">
          Close the whole hillside or a single room type. End date is the morning the rooms reopen — same exclusive
          checkout rule as guest stays.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid gap-4 rounded-3xl border border-wood-300/60 bg-cream-50 p-6 sm:grid-cols-2"
      >
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Applies to</span>
          <select className="field" value={roomTypeId} onChange={(event) => setRoomTypeId(event.target.value)}>
            <option value="">Entire property</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">From</span>
          <input className="field" type="date" required value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Until (reopen morning)</span>
          <input className="field" type="date" required value={endDate} onChange={(event) => setEndDate(event.target.value)} />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Reason</span>
          <input
            className="field"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Owner stay, maintenance, snowfall…"
          />
        </label>
        {error ? <p className="text-sm text-wood-700 sm:col-span-2">{error}</p> : null}
        <button type="submit" className="btn-primary sm:col-span-2" disabled={busy}>
          {busy ? "Blocking…" : "Block these dates"}
        </button>
      </form>

      <ul className="space-y-3">
        {blocked.map((row) => (
          <li
            key={row.id}
            className="flex flex-col justify-between gap-3 rounded-2xl border border-wood-300/50 bg-cream-50 p-5 sm:flex-row sm:items-center"
          >
            <div>
              <p className="font-display text-xl text-forest-900">{row.roomType?.name ?? "Entire property"}</p>
              <p className="text-sm text-ink-600">
                {formatStayDate(new Date(row.startDate))} → {formatStayDate(new Date(row.endDate))}
              </p>
              {row.reason ? <p className="mt-1 text-sm text-ink-500">{row.reason}</p> : null}
            </div>
            <button type="button" className="btn-secondary" onClick={() => remove(row.id)}>
              Lift block
            </button>
          </li>
        ))}
        {blocked.length === 0 ? (
          <li className="rounded-2xl bg-wood-200/40 px-5 py-8 text-sm text-ink-600">
            No blocked ranges. The calendar is open for the seeded inventory.
          </li>
        ) : null}
      </ul>
    </main>
  );
}
