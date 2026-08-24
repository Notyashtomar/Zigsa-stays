import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RoomIllustration } from "@/components/MountainScene";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata = {
  title: "Gallery",
};

const frames = [
  { title: "Valley morning", caption: "West-facing light over the Beas side of the hill.", variant: "valley" as const },
  { title: "Cabin and pines", caption: "The mark on the sign — wood, forest, snow line.", variant: "deluxe" as const },
  { title: "After Hadimba", caption: "Boots by the door, tea before dinner.", variant: "family" as const },
  { title: "Kanyal Road dusk", caption: "The quiet way home from Rangri.", variant: "default" as const },
  { title: "Café table", caption: "A plate and a second cup — photo still to come.", variant: "deluxe" as const },
  { title: "Restaurant evening", caption: "Guests mention the kitchen. We will show it properly soon.", variant: "family" as const },
  { title: "Village waterfall", caption: "A short walk from Simsa, not a postcard invent.", variant: "valley" as const },
  { title: "Winter ridge", caption: "Snow on the Dhauladhar when the road allows.", variant: "default" as const },
  { title: "Suite sitting room", caption: "Family suite placeholder — replace with a real frame.", variant: "family" as const },
];

export default function GalleryPage() {
  return (
    <>
      <Header />
      <PageHero
        eyebrow="Photographs in progress"
        title="The hill is real. These frames are waiting."
        lede={`We do not have a full photo set on this site yet. Follow ${site.instagramHandle} for current rooms and weather, and treat the grid below as honest placeholders — not stock mountains from another valley.`}
      />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {frames.map((frame) => (
            <figure key={frame.title} className="overflow-hidden rounded-3xl border border-wood-300/70 bg-cream-50">
              <div className="h-44">
                <RoomIllustration variant={frame.variant} />
              </div>
              <figcaption className="p-4">
                <p className="font-display text-xl text-forest-900">{frame.title}</p>
                <p className="mt-1 text-sm text-ink-600">{frame.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href={site.instagramUrl} target="_blank" rel="noreferrer" className="btn-primary">
            Current photos on Instagram
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
