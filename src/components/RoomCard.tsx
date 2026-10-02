import Image from "next/image";
import Link from "next/link";
import { roomImage } from "@/lib/images";
import { formatINR } from "@/lib/money";
import type { PublicRoom } from "@/lib/booking";

export function RoomCard({ room }: { room: PublicRoom }) {
  const image = roomImage(room.slug);
  return (
    <article className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-cream-50 shadow-[0_16px_50px_rgba(18,38,29,0.10)] ring-1 ring-wood-300/50">
      <Link
        href={`/rooms/${room.slug}`}
        className="relative block aspect-[4/3] overflow-hidden"
        aria-label={`View ${room.name}`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          placeholder="blur"
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-forest-950/60 to-transparent" />
        <p className="absolute bottom-4 left-5 text-xs font-semibold uppercase tracking-[0.2em] text-cream-50/95">
          Sleeps {room.maxGuests}
        </p>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-display text-2xl text-forest-900">{room.name}</h3>
        <p className="text-sm leading-relaxed text-ink-700">{room.description}</p>
        <p className="mt-auto pt-2 text-sm text-ink-500">
          From <span className="font-semibold text-forest-800">{formatINR(room.baseRateNight)}</span> / night
        </p>
        <div className="flex gap-3 pt-1">
          <Link href={`/rooms/${room.slug}`} className="btn-secondary flex-1">
            View room
          </Link>
          <Link href={`/book?room=${room.slug}`} className="btn-primary flex-1">
            Book
          </Link>
        </div>
      </div>
    </article>
  );
}
