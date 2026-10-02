import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { roomImage } from "@/lib/images";
import { formatINR } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { serializeRoom } from "@/lib/booking";

export const dynamic = "force-dynamic";

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
  const image = roomImage(room.slug);

  return (
    <>
      <Header overlay />
      <main>
        <div className="relative h-[56vh] min-h-[380px] overflow-hidden">
          <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/15 to-forest-950/35" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
              <p className="eyebrow text-wood-300">
                Sleeps {room.maxGuests} · {room.inventoryCount} on the books
              </p>
              <h1 className="font-display mt-2 text-4xl text-cream-50 sm:text-6xl">{room.name}</h1>
            </div>
          </div>
        </div>
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article>
            <p className="max-w-2xl text-lg leading-relaxed text-ink-700">{room.description}</p>
            <h2 className="font-display mt-10 text-2xl text-forest-900">In the room</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {room.amenities.map((item) => (
                <li key={item} className="rounded-xl bg-cream-50 px-4 py-3 text-sm text-ink-700 ring-1 ring-wood-300/40">
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <aside className="h-fit rounded-[1.75rem] bg-forest-900 p-7 text-cream-50 lg:sticky lg:top-24">
            <p className="text-sm text-wood-300">From</p>
            <p className="font-display text-4xl">{formatINR(room.baseRateNight)}</p>
            <p className="mt-1 text-sm text-cream-200/70">per night</p>
            <Link
              href={`/book?room=${room.slug}`}
              className="btn-primary mt-6 w-full bg-wood-400 text-forest-950 hover:bg-wood-300"
            >
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
