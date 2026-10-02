import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { images } from "@/lib/images";
import { mapsEmbedSrc, mapsOpenSrc, site, telHref } from "@/lib/site";

export const metadata = {
  title: "Location",
};

export default function LocationPage() {
  return (
    <>
      <Header overlay />
      <PageHero
        eyebrow="Simsa · Rangri · Kanyal Road"
        title="West of the Beas, two kilometres from the noise."
        lede={site.setting}
        image={images.hero}
      />
      <main className="mx-auto max-w-6xl space-y-12 px-4 py-16 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-wood-300/70 bg-cream-50">
          <iframe
            title="Zigsa Stays on Google Maps"
            src={mapsEmbedSrc()}
            className="h-80 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="grid gap-6 p-6 md:grid-cols-2">
            <div>
              <p className="eyebrow">Address</p>
              <p className="mt-3 leading-relaxed text-ink-700">{site.address}</p>
              <p className="mt-2 text-sm text-ink-500">
                {site.latitude}, {site.longitude} · plus code {site.plusCode}
              </p>
              <a href={mapsOpenSrc()} target="_blank" rel="noreferrer" className="btn-secondary mt-4">
                Open in Google Maps
              </a>
            </div>
            <div>
              <p className="eyebrow">Call or message</p>
              <ul className="mt-3 space-y-2 text-ink-700">
                {site.phones.map((phone, index) => (
                  <li key={phone}>
                    <a className="underline decoration-wood-400" href={telHref(index)}>
                      {phone}
                    </a>
                  </li>
                ))}
              </ul>
              <WhatsAppLink className="btn-primary mt-4" message="Hello Zigsa Stays, I am on the way from Manali.">
                WhatsApp for directions
              </WhatsAppLink>
            </div>
          </div>
        </div>

        <section className="grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl bg-cream-50 p-6">
            <h2 className="font-display text-2xl text-forest-900">From the bus stand</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">{site.howToReach.taxi}</p>
          </article>
          <article className="rounded-3xl bg-cream-50 p-6">
            <h2 className="font-display text-2xl text-forest-900">From the airport</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">{site.howToReach.airport}</p>
          </article>
          <article className="rounded-3xl bg-cream-50 p-6">
            <h2 className="font-display text-2xl text-forest-900">By rail</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">{site.howToReach.rail}</p>
          </article>
        </section>

        <section>
          <p className="eyebrow">Once you are settled</p>
          <h2 className="font-display mt-3 text-3xl text-forest-900">Day trips, not the front yard.</h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {site.dayTrips.map((trip) => (
              <li key={trip} className="rounded-full bg-forest-800 px-4 py-2 text-sm text-cream-50">
                {trip}
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
