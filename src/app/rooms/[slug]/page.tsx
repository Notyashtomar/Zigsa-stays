import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RoomIllustration } from "@/components/MountainScene";
import { formatINR } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { serializeRoom } from "@/lib/booking";

export const dynamic = "force-dynamic";

function variantFor(slug: string) {
  if (slug.includes("valley")) return "valley" as const;
  if (slug.includes("family")) return "family" as const;
  if (slug.includes("deluxe")) return "deluxe" as const;
  return "default" as const;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = await prisma.roomType.findUnique({ where: { slug } });
  return { title: room?.name ?? "Room" };
}

export default async function RoomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const record = await prisma.roomType.findUnique({ where: { slug } });
  if (!record || !record.isActive) notFound();
  const room = serializeRoom(record);

  return (
    <>
      <Header />
      <main>
        <div className="h-64 overflow-hidden sm:h-80">
          <RoomIllustration variant={variantFor(room.slug)} />
        </div>
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article>
            <p className="eyebrow">Sleeps {room.maxGuests} · {room.inventoryCount} on the books</p>
            <h1 className="font-display mt-3 text-4xl text-forest-900 sm:text-5xl">{room.name}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-700">{room.description}</p>
            <h2 className="font-display mt-10 text-2xl text-forest-900">In the room</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {room.amenities.map((item) => (
                <li key={item} className="rounded-xl bg-cream-50 px-4 py-3 text-sm text-ink-700">
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <aside className="h-fit rounded-3xl bg-forest-900 p-6 text-cream-50">
            <p className="text-sm text-wood-300">From</p>
            <p className="font-display text-4xl">{formatINR(room.baseRateNight)}</p>
            <p className="mt-1 text-sm text-cream-200/70">per night · placeholder rate</p>
            <Link href={`/book?room=${room.slug}`} className="btn-primary mt-6 w-full bg-wood-400 text-forest-950 hover:bg-wood-300">
              Check dates
            </Link>
            <Link href="/rooms" className="mt-4 block text-center text-sm text-cream-200/70 hover:text-cream-50">
              All room types
            </Link>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
