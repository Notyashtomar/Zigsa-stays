import { Logo } from "@/components/Logo";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-7 bg-forest-950">
      <span className="loader-emblem inline-flex rounded-full">
        <Logo size={92} />
      </span>
      <div className="text-center">
        <p className="font-display text-2xl tracking-wide text-cream-50">Zigsa Stays</p>
        <p className="eyebrow mt-2 text-wood-300">Simsa Village · Manali</p>
      </div>
      <span className="loader-track relative block h-px w-40 overflow-hidden bg-cream-50/15">
        <span className="loader-sweep absolute inset-y-0 w-1/3 bg-wood-300" />
      </span>
    </div>
  );
}
