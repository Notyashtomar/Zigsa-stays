import Link from "next/link";
import { RoomIllustration } from "@/components/MountainScene";
import { formatINR } from "@/lib/money";
import type { PublicRoom } from "@/lib/booking";

function variantFor(slug: string) {
  if (slug.includes("valley")) return "valley" as const;
  if (slug.includes("family")) return "family" as const;
  if (slug.includes("deluxe")) return "deluxe" as const;
  return "default" as const;
}

export function RoomCard({ room }: { room: PublicRoom }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-wood-300/70 bg-cream-50 shadow-[0_12px_40px_rgba(18,38,29,0.08)]">
      <div className="relative h-48 overflow-hidden">
        <RoomIllustration variant={variantFor(room.slug)} />
      </div>
      <div className="space-y-3 p-6">
        <p className="eyebrow">Sleeps {room.maxGuests}</p>
        <h3 className="font-display text-2xl text-forest-900">{room.name}</h3>
        <p className="text-sm leading-relaxed text-ink-700">{room.description}</p>
        <p className="text-sm text-ink-500">
          From <span className="font-semibold text-forest-800">{formatINR(room.baseRateNight)}</span> / night
          <span className="block text-xs">Placeholder rate · {room.inventoryCount} of this type</span>
        </p>
        <div className="flex gap-3 pt-1">
          <Link href={`/rooms/${room.slug}`} className="btn-secondary">
            View room
          </Link>
          <Link href={`/book?room=${room.slug}`} className="btn-primary">
            Book
          </Link>
        </div>
      </div>
    </article>
  );
}
