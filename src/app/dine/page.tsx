import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { images } from "@/lib/images";

export const metadata = {
  title: "Café & restaurant",
};

export default function DinePage() {
  return (
    <>
      <Header overlay />
      <PageHero
        eyebrow="Gastronomy"
        title="Eat on the same hill you sleep on."
        lede="Zigsa Stays is a hotel and B&B with a café and a restaurant. Come in from Kanyal Road for a meal even if the rooms are full — or stay in and never put the town traffic back on."
        image={images.restaurant}
      />
      <main className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:px-6">
        <article className="grid items-center gap-8 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem]">
            <Image
              src={images.cafe.src}
              alt={images.cafe.alt}
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">Café</p>
            <h2 className="font-display mt-3 text-3xl text-forest-900 sm:text-4xl">Morning light, second cup.</h2>
            <p className="mt-4 leading-relaxed text-ink-700">
              The café is the soft landing after Bhuntar or the bus stand. Coffee, chai, and a plate that does not treat
              breakfast as a queue. Sit with the valley still waking — Simsa is quieter than Old Manali at 8 a.m., and
              we intend to keep it that way.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-ink-700">
              <li>Tea, filter coffee, and something sweet if the kitchen is already warm</li>
              <li>A pause between the waterfall walk and the Hadimba taxi</li>
              <li>Guests first; walk-ins welcome when tables are free</li>
            </ul>
          </div>
        </article>

        <article className="grid items-center gap-8 lg:grid-cols-2">
          <div className="order-last lg:order-first">
            <p className="eyebrow">Restaurant</p>
            <h2 className="font-display mt-3 text-3xl text-forest-900 sm:text-4xl">Dinner after the day trips.</h2>
            <p className="mt-4 leading-relaxed text-ink-700">
              Guests on Google mention the food in the same breath as the views. We will not invent a menu of twelve
              cuisines. Expect a hillside restaurant: North Indian plates, Himachali warmth, and the sense that someone
              in the kitchen is actually cooking for the table.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-ink-700">
              <li>Evening service for in-house guests and the road</li>
              <li>Ask about the day&apos;s pot — it changes with season and supply</li>
              <li>Tell us about allergies when you book or on WhatsApp</li>
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem]">
            <Image
              src={images.restaurant.src}
              alt={images.restaurant.alt}
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </article>

        <div className="rounded-[1.75rem] bg-forest-900 p-8 text-cream-50 sm:p-10">
          <h2 className="font-display text-3xl">A table without a reservation app.</h2>
          <p className="mt-3 max-w-2xl text-cream-200/80">
            For dinner on a busy weekend, message the desk. We would rather hold a table than over-promise a digital
            waitlist.
          </p>
          <WhatsAppLink
            className="btn-primary mt-6 bg-wood-400 text-forest-950 hover:bg-wood-300"
            message="Hello Zigsa Stays, I would like a table at the restaurant."
          >
            WhatsApp for a table
          </WhatsAppLink>
        </div>
      </main>
      <Footer />
    </>
  );
}
