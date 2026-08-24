import Link from "next/link";
import { formatINR, paiseToRupees } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Rooms" };

export default async function AdminRoomsPage() {
  const rooms = await prisma.roomType.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <main className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Inventory</p>
          <h1 className="font-display mt-2 text-4xl text-forest-900">Rooms & rates</h1>
        </div>
        <Link href="/admin/rooms/new" className="btn-primary">
          Add room type
        </Link>
      </div>
      <ul className="space-y-3">
        {rooms.map((room) => (
          <li key={room.id} className="flex flex-col justify-between gap-3 rounded-2xl bg-cream-50 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="font-display text-2xl text-forest-900">{room.name}</p>
              <p className="text-sm text-ink-600">
                {formatINR(room.baseRateNight)} / night · {room.inventoryCount} units · sleeps {room.maxGuests}
                {room.isActive ? "" : " · hidden"}
              </p>
              <p className="text-xs text-ink-500">₹{paiseToRupees(room.baseRateNight)} stored as paise for Razorpay</p>
            </div>
            <Link href={`/admin/rooms/${room.id}`} className="btn-secondary">
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
