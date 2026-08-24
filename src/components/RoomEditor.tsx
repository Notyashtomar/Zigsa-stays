"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { paiseToRupees } from "@/lib/money";

type RoomEditorProps = {
  room?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    maxGuests: number;
    inventoryCount: number;
    baseRateNight: number;
    amenities: string;
    isActive: boolean;
    sortOrder: number;
  };
};

function parseAmenities(value: string) {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.join(", ") : "";
  } catch {
    return "";
  }
}

export function RoomEditor({ room }: RoomEditorProps) {
  const router = useRouter();
  const [name, setName] = useState(room?.name ?? "");
  const [slug, setSlug] = useState(room?.slug ?? "");
  const [description, setDescription] = useState(room?.description ?? "");
  const [maxGuests, setMaxGuests] = useState(String(room?.maxGuests ?? 2));
  const [inventoryCount, setInventoryCount] = useState(String(room?.inventoryCount ?? 1));
  const [baseRateRupees, setBaseRateRupees] = useState(String(room ? paiseToRupees(room.baseRateNight) : 6500));
  const [amenities, setAmenities] = useState(room ? parseAmenities(room.amenities) : "");
  const [isActive, setIsActive] = useState(room?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(String(room?.sortOrder ?? 0));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const payload = {
      name,
      slug,
      description,
      maxGuests: Number(maxGuests),
      inventoryCount: Number(inventoryCount),
      baseRateRupees: Number(baseRateRupees),
      amenities: amenities.split(",").map((item) => item.trim()).filter(Boolean),
      isActive,
      sortOrder: Number(sortOrder),
    };
    const response = await fetch(room ? `/api/admin/rooms/${room.id}` : "/api/admin/rooms", {
      method: room ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(data.error || "Could not save the room.");
      return;
    }
    router.push("/admin/rooms");
    router.refresh();
  }

  async function onDelete() {
    if (!room || !confirm("Remove this room type?")) return;
    await fetch(`/api/admin/rooms/${room.id}`, { method: "DELETE" });
    router.push("/admin/rooms");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4 rounded-3xl bg-cream-50 p-6">
      <label className="block text-sm">
        <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Name</span>
        <input className="field" required value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Slug</span>
        <input className="field" required value={slug} onChange={(e) => setSlug(e.target.value)} />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Description</span>
        <textarea className="field min-h-28" required value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Max guests</span>
          <input className="field" type="number" min={1} required value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Inventory</span>
          <input className="field" type="number" min={1} required value={inventoryCount} onChange={(e) => setInventoryCount(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Rate / night (₹)</span>
          <input className="field" type="number" min={500} required value={baseRateRupees} onChange={(e) => setBaseRateRupees(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Sort order</span>
          <input className="field" type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Amenities (comma separated)</span>
        <input className="field" value={amenities} onChange={(e) => setAmenities(e.target.value)} />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        Visible on the public site
      </label>
      {error ? <p className="text-sm text-wood-700">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Saving…" : "Save room"}
        </button>
        {room ? (
          <button type="button" className="btn-secondary" onClick={onDelete}>
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}
