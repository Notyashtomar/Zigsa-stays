import Image from "next/image";
import Link from "next/link";
import { DateRangeCard } from "@/components/DateRangeCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { getPrimaryProperty, serializeRoom } from "@/lib/booking";
import { images, roomImage } from "@/lib/images";
import { formatINR } from "@/lib/money";
import { mapsOpenSrc, site } from "@/lib/site";

export const dynamic = "force-dynamic";

function ActMark({ no, label, dark = false }: { no: string; label: string; dark?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <span className={`h-px w-10 ${dark ? "bg-wood-300/40" : "bg-wood-700/30"}`} />
      <p className={`eyebrow ${dark ? "text-wood-300" : ""}`}>
        No. {no} — {label}
      </p>
      <span className={`h-px w-10 ${dark ? "bg-wood-300/40" : "bg-wood-700/30"}`} />
    </div>
  );
}

export default async function HomePage() {
  const property = await getPrimaryProperty();
  const rooms = property?.roomTypes.map(serializeRoom) ?? [];
  const [featureRoom, ...restRooms] = rooms;

  return (
    <>
      <Header overlay />
      <main>
        {/* Opening frame */}
        <section className="vignette relative isolate flex min-h-[100svh] flex-col overflow-hidden text-cream-50">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <Image
              src={images.hero.src}
              alt={images.hero.alt}
              fill
              priority
              placeholder="blur"
              sizes="100vw"
              className="kenburns object-cover"
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-950/95 via-forest-950/25 to-forest-950/50" />

          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 pt-24 text-center sm:px-6">
            <div className="hero-enter">
              <Logo size={124} className="drop-shadow-[0_10px_40px_rgba(12,26,20,0.7)]" />
            </div>
            <p
              className="hero-enter eyebrow mt-8 text-sm text-wood-200 [text-shadow:0_1px_10px_rgba(12,26,20,0.8)]"
              style={{ animationDelay: "180ms" }}
            >
              Simsa Village · Manali · Himachal Pradesh
            </p>
            <h1
              className="hero-enter font-display mt-4 text-6xl leading-[0.98] text-cream-50 [text-shadow:0_2px_30px_rgba(12,26,20,0.6)] sm:text-8xl"
              style={{ animationDelay: "320ms" }}
            >
              Zigsa Stays
            </h1>
            <p
              className="hero-enter font-display mt-6 max-w-xl text-xl italic leading-relaxed text-cream-100 [text-shadow:0_1px_14px_rgba(12,26,20,0.75)] sm:text-2xl"
              style={{ animationDelay: "480ms" }}
            >
              {site.tagline}.
            </p>
            <p
              className="hero-enter mt-4 max-w-lg text-base leading-relaxed text-cream-100/95 [text-shadow:0_1px_12px_rgba(12,26,20,0.8)]"
              style={{ animationDelay: "620ms" }}
            >
              Hotel, café &amp; restaurant on the quiet western hillside — two kilometres above the noise of Mall Road.
            </p>
          </div>

          <div className="mx-auto mb-8 flex flex-col items-center gap-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-cream-100/70">Begin</p>
            <span className="scroll-cue block h-10 w-px bg-cream-100/60" />
          </div>
        </section>

        {/* Booking bar overlapping the fold */}
        <section className="relative z-10 mx-auto -mt-14 max-w-4xl px-4 sm:px-6">
          <Reveal>
            <DateRangeCard />
          </Reveal>
        </section>

        {/* Act I — the hillside */}
        <section className="mx-auto max-w-5xl px-4 py-28 text-center sm:px-6 sm:py-36">
          <Reveal>
            <ActMark no="01" label="The hillside" />
            <h2 className="font-display mt-8 text-4xl leading-[1.12] text-forest-900 sm:text-6xl">
              Wood, weather, slow food —<br className="hidden sm:block" /> and the kind of{" "}
              <em className="text-forest-700">quiet</em> Mall Road forgot.
            </h2>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-ink-700">
              We sit in Simsa, near Hotel Avishi Greens, on the western side of the valley. A village waterfall is a
              short walk; Hadimba, Old Manali, and Mall Road are day trips — not the view from your pillow.
            </p>
          </Reveal>
        </section>

        {/* Full-bleed terrace frame */}
        <section className="relative isolate overflow-hidden">
          <div className="relative h-[68vh] min-h-[440px] w-full">
            <Image
              src={images.terrace.src}
              alt={images.terrace.alt}
              fill
              placeholder="blur"
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-forest-950/20" />
            <figcaption className="absolute bottom-8 left-1/2 w-full max-w-6xl -translate-x-1/2 px-4 text-cream-50 sm:px-6">
              <Reveal>
                <p className="eyebrow text-sm text-wood-200 [text-shadow:0_1px_10px_rgba(12,26,20,0.8)]">The terrace</p>
                <p className="font-display mt-1 text-2xl [text-shadow:0_1px_14px_rgba(12,26,20,0.6)] sm:text-4xl">
                  Chai at elevation, cushions the colour of rust.
                </p>
              </Reveal>
            </figcaption>
          </div>
        </section>

        {/* Act II — accommodations */}
        <section className="mx-auto max-w-6xl px-4 py-28 sm:px-6">
          <Reveal className="text-center">
            <ActMark no="02" label="Accommodations" />
            <h2 className="font-display mt-8 text-4xl text-forest-900 sm:text-6xl">Stay above the road.</h2>
            <p className="mx-auto mt-5 max-w-xl text-ink-700">
              Three named rooms, one hillside — wood-panelled walls, honest rates, windows that earn their keep.
            </p>
          </Reveal>

          {featureRoom ? (
            <Reveal className="mt-14">
              <Link
                href={`/rooms/${featureRoom.slug}`}
                className="group relative block overflow-hidden rounded-[2rem]"
              >
                <div className="relative aspect-[16/10] sm:aspect-[21/9]">
                  <Image
                    src={roomImage(featureRoom.slug).src}
                    alt={roomImage(featureRoom.slug).alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1152px) 1152px, 100vw"
                    className="object-cover transition duration-[1.4s] ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/10 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-7 text-cream-50 sm:flex-row sm:items-end sm:justify-between sm:p-10">
                  <div>
                    <p className="eyebrow text-sm text-wood-200">Sleeps {featureRoom.maxGuests}</p>
                    <h3 className="font-display mt-1 text-3xl sm:text-5xl">{featureRoom.name}</h3>
                  </div>
                  <p className="text-sm text-cream-100/90 sm:text-right">
                    From <span className="font-display text-2xl text-wood-200">{formatINR(featureRoom.baseRateNight)}</span>{" "}
                    / night
                    <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-cream-100/70 transition group-hover:text-wood-200">
                      View the room →
                    </span>
                  </p>
                </div>
              </Link>
            </Reveal>
          ) : null}

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {restRooms.map((room, index) => (
              <Reveal key={room.id} delay={index * 140}>
                <Link href={`/rooms/${room.slug}`} className="group relative block overflow-hidden rounded-[2rem]">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={roomImage(room.slug).src}
                      alt={roomImage(room.slug).alt}
                      fill
                      placeholder="blur"
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition duration-[1.4s] ease-out group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/10 to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-7 text-cream-50">
                    <div>
                      <p className="eyebrow text-sm text-wood-200">Sleeps {room.maxGuests}</p>
                      <h3 className="font-display mt-1 text-2xl sm:text-3xl">{room.name}</h3>
                    </div>
                    <p className="shrink-0 text-right text-sm text-cream-100/90">
                      From <span className="font-display text-xl text-wood-200">{formatINR(room.baseRateNight)}</span>
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 text-center">
            <Link href="/rooms" className="btn-secondary">
              All rooms &amp; rates
            </Link>
          </Reveal>
        </section>

        {/* Act III — gastronomy */}
        <section className="relative bg-forest-950 py-28 text-cream-50">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal className="text-center">
              <ActMark no="03" label="Gastronomy" dark />
              <h2 className="font-display mx-auto mt-8 max-w-3xl text-4xl leading-[1.12] sm:text-6xl">
                Eat on the same hill <em className="text-wood-300">you sleep on.</em>
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {[
                {
                  image: images.cafe,
                  eyebrow: "Café",
                  title: "Morning light, second cup.",
                  copy: "The soft landing after Bhuntar or the bus stand — coffee, chai, and a plate that does not rush you back to town.",
                },
                {
                  image: images.restaurant,
                  eyebrow: "Restaurant",
                  title: "Dinner after the day trips.",
                  copy: "North Indian plates, Himachali warmth, and evenings that end with pine air instead of honking.",
                },
              ].map((venue, index) => (
                <Reveal key={venue.eyebrow} delay={index * 140}>
                  <Link
                    href="/dine"
                    className="group block overflow-hidden rounded-[2rem] bg-forest-900 ring-1 ring-cream-50/10"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={venue.image.src}
                        alt={venue.image.alt}
                        fill
                        placeholder="blur"
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover transition duration-[1.4s] ease-out group-hover:scale-[1.05]"
                      />
                    </div>
                    <div className="p-7">
                      <p className="eyebrow text-wood-300">{venue.eyebrow}</p>
                      <h3 className="font-display mt-2 text-3xl">{venue.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-cream-200/80">{venue.copy}</p>
                      <p className="mt-5 text-sm font-semibold tracking-wide text-wood-300 transition group-hover:text-wood-200">
                        Learn more →
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Act IV — the walk */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-28 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem]">
              <Image
                src={images.forest.src}
                alt={images.forest.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">No. 04 — Simsa · Rangri · Kanyal Road</p>
            <h2 className="font-display mt-4 text-4xl leading-[1.1] text-forest-900 sm:text-5xl">
              West of the Beas, two kilometres from the noise.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-700">
              The waterfall walk starts at the village edge. Everything louder — Hadimba, Old Manali, Mall Road — is a
              short taxi away, and stays there.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {site.dayTrips.map((trip) => (
                <li key={trip} className="rounded-full bg-forest-800 px-4 py-2 text-sm text-cream-50">
                  {trip}
                </li>
              ))}
            </ul>
            <figure className="mt-9 border-l-2 border-wood-400 pl-6">
              <blockquote className="font-display text-2xl italic leading-snug text-forest-800">
                “Very good arrangement and cooperative staff — food is delicious and view is awesome.”
              </blockquote>
              <figcaption className="mt-3 text-sm text-ink-500">
                Guest review on Google · {site.googleRating}★ across {site.googleReviewCount} reviews, honestly counted
              </figcaption>
            </figure>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/location" className="btn-primary">
                How to reach
              </Link>
              <a href={mapsOpenSrc()} target="_blank" rel="noreferrer" className="btn-secondary">
                Open in Google Maps
              </a>
            </div>
          </Reveal>
        </section>

        {/* Closing frame */}
        <section className="vignette relative isolate overflow-hidden text-cream-50">
          <Image
            src={images.roomValley.src}
            alt={images.roomValley.alt}
            fill
            placeholder="blur"
            sizes="100vw"
            className="absolute inset-0 -z-10 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-forest-950/70" />
          <div className="mx-auto flex min-h-[72vh] max-w-4xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
            <Reveal>
              <Logo size={96} className="drop-shadow-[0_10px_40px_rgba(12,26,20,0.7)]" />
              <h2 className="font-display mt-8 text-4xl leading-tight [text-shadow:0_2px_24px_rgba(12,26,20,0.6)] sm:text-6xl">
                Come up the hill.
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-lg text-cream-100/95 [text-shadow:0_1px_12px_rgba(12,26,20,0.7)]">
                Named rooms, night-count pricing, and a desk that answers. Book direct — or write to us the old way.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link href="/book" className="btn-primary bg-wood-400 text-forest-950 hover:bg-wood-300">
                  Book a stay
                </Link>
                <WhatsAppLink className="btn-secondary border-cream-200/40 bg-cream-50/10 text-cream-50 hover:bg-cream-50/20">
                  WhatsApp the desk
                </WhatsAppLink>
              </div>
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-block text-sm tracking-wide text-cream-100/80 underline decoration-wood-400/60 underline-offset-4 transition hover:text-wood-200"
              >
                This week on the hillside — {site.instagramHandle}
              </a>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
