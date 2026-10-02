import Image from "next/image";
import type { SiteImage } from "@/lib/images";

export function PageHero({
  eyebrow,
  title,
  lede,
  image,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  image?: SiteImage;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-forest-950 text-cream-50">
      {image ? (
        <>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            placeholder="blur"
            sizes="100vw"
            className="absolute inset-0 -z-10 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-950/95 via-forest-950/45 to-forest-950/55" />
        </>
      ) : null}
      <div className="mx-auto flex min-h-[46vh] max-w-6xl flex-col justify-end px-4 pb-14 pt-32 sm:px-6 sm:pb-16">
        <p className="eyebrow text-sm text-wood-200 [text-shadow:0_1px_10px_rgba(12,26,20,0.8)]">{eyebrow}</p>
        <h1 className="font-display mt-3 max-w-3xl text-4xl leading-[1.05] text-cream-50 [text-shadow:0_2px_24px_rgba(12,26,20,0.55)] sm:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-cream-50 [text-shadow:0_1px_12px_rgba(12,26,20,0.7)] sm:text-xl">
          {lede}
        </p>
      </div>
    </section>
  );
}
