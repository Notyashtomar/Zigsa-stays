export function PageHero({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede: string;
}) {
  return (
    <section className="border-b border-wood-300/50 bg-forest-900 text-cream-50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="eyebrow text-wood-300">{eyebrow}</p>
        <h1 className="font-display mt-3 max-w-3xl text-4xl leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-cream-200/85 sm:text-lg">{lede}</p>
      </div>
    </section>
  );
}
