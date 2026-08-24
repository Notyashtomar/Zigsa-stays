import Link from "next/link";
import { DateRangeCard } from "@/components/DateRangeCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";
import { MountainScene } from "@/components/MountainScene";
import { RoomCard } from "@/components/RoomCard";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { getPrimaryProperty, serializeRoom } from "@/lib/booking";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const property = await getPrimaryProperty();
  const rooms = property?.roomTypes.map(serializeRoom) ?? [];

  return (
    <>
      <Header overlay />
      <main>
        <section className="relative isolate min-h-[92vh] overflow-hidden text-cream-50">
          <div className="hero-sky absolute inset-0" />
          <MountainScene className="absolute inset-x-0 bottom-0 h-[70%] w-full object-cover opacity-90" />
          <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20">
            <div className="max-w-2xl">
              <Logo size={108} />
              <p className="eyebrow mt-6 text-wood-300">Hotel · café · restaurant · Simsa, Manali</p>
              <h1 className="font-display mt-3 text-4xl leading-[1.05] sm:text-6xl">{site.tagline}</h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-cream-100/90 sm:text-lg">
                A hillside stay west of the Beas — quiet Kanyal Road, village air, and a kitchen that keeps the day
                going. Mall Road is about two kilometres away. The crowds can stay there.
              </p>
            </div>
            <div className="mt-10 max-w-4xl">
              <DateRangeCard />
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow">Zigsa Stays Manali</p>
            <h2 className="font-display mt-3 text-4xl text-forest-900">A village hillside, not a town balcony.</h2>
            <p className="mt-5 text-base leading-relaxed text-ink-700">
              We sit in Simsa, near Hotel Avishi Greens, on the quieter western side of the valley. Rangri and Kanyal
              Road are the way in. A village waterfall is close; Hadimba, Old Manali, and Mall Road are day trips, not
              the view from the pillow.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-700">
              This is a hotel and B&B with a café and restaurant — rustic luxury, wood and forest green, not hostel neon.
              Come for the elevation. Leave the noise on the other bank of the river.
            </p>
          </div>
          <aside className="rounded-3xl border border-wood-300/70 bg-cream-50 p-6">
            <p className="eyebrow">On Google</p>
            <p className="font-display mt-3 text-5xl text-forest-800">
              {site.googleRating}
              <span className="text-2xl">★</span>
            </p>
            <p className="mt-2 text-sm text-ink-700">
              {site.googleReviewCount} Google reviews — a small set, so we will not pretend it is a chorus. Guests tend
              to mention the staff, the food, and the hillside views. We would rather earn the next note than invent one.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/location" className="btn-secondary">
                How to reach
              </Link>
              <WhatsAppLink>WhatsApp the desk</WhatsAppLink>
            </div>
          </aside>
        </section>

        <section className="bg-forest-950 py-20 text-cream-50">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow text-wood-300">Named rooms</p>
                <h2 className="font-display mt-3 text-4xl">Stay above the road.</h2>
              </div>
              <Link href="/rooms" className="btn-secondary border-cream-200/30 bg-transparent text-cream-50">
                All rooms
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-wood-200/50 p-8">
            <p className="eyebrow">Café</p>
            <h2 className="font-display mt-3 text-3xl text-forest-900">Slow coffee, valley light.</h2>
            <p className="mt-4 leading-relaxed text-ink-700">
              The café is for the hour after the drive and the hour before the walk. Tea, coffee, and a plate that does
              not rush you back to Mall Road.
            </p>
            <Link href="/dine" className="btn-primary mt-6">
              See the kitchen
            </Link>
          </div>
          <div className="rounded-3xl bg-sky-200/50 p-8">
            <p className="eyebrow">Restaurant</p>
            <h2 className="font-display mt-3 text-3xl text-forest-900">Dinner on the hill.</h2>
            <p className="mt-4 leading-relaxed text-ink-700">
              A proper restaurant for guests and anyone who finds the road. Himachali warmth, North Indian plates, and
              the kind of evening that ends with pine air instead of honking.
            </p>
            <Link href="/dine" className="btn-secondary mt-6">
              Café & restaurant
            </Link>
          </div>
        </section>

        <section className="border-y border-wood-300/60 bg-cream-50">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-center">
            <div>
              <p className="eyebrow">Instagram</p>
              <h2 className="font-display mt-3 text-3xl text-forest-900">The hillside, as it is.</h2>
              <p className="mt-3 max-w-xl text-ink-700">
                Follow {site.instagramHandle} for what the rooms look like this week — snow, apple blossom, or monsoon
                green. We would rather send you there than invent a photo set.
              </p>
            </div>
            <a href={site.instagramUrl} target="_blank" rel="noreferrer" className="btn-primary">
              Open Instagram
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
