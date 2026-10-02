import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { galleryFrames, images } from "@/lib/images";
import { site } from "@/lib/site";

export const metadata = {
  title: "Gallery",
};

export default function GalleryPage() {
  return (
    <>
      <Header overlay />
      <PageHero
        eyebrow="The hillside"
        title="Wood, weather, and the valley doing its work."
        lede={`An art-directed look at the stay. For this week's rooms and weather as they actually are, ${site.instagramHandle} is the ground truth.`}
        image={images.terrace}
      />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>figure]:mb-5">
          {galleryFrames.map((frame) => (
            <figure
              key={frame.title}
              className="break-inside-avoid overflow-hidden rounded-[1.5rem] bg-cream-50 ring-1 ring-wood-300/50"
            >
              <div className={`relative w-full ${frame.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                <Image
                  src={frame.src}
                  alt={frame.alt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
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
