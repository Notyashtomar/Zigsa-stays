import Image from "next/image";

type LogoProps = {
  size?: number;
  className?: string;
  showWordmark?: boolean;
  light?: boolean;
};

export function Logo({ size = 72, className = "", showWordmark = false, light = false }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Image
        src="/brand/logo.png"
        alt="Zigsa Stays Manali — hotel cum restaurant"
        width={size}
        height={size}
        className="rounded-full shadow-[0_8px_24px_rgba(18,38,29,0.25)]"
        priority={size >= 72}
      />
      {showWordmark ? (
        <span className="leading-tight">
          <span className={`block font-display text-lg tracking-wide ${light ? "text-cream-50" : "text-forest-900"}`}>
            Zigsa Stays
          </span>
          <span className={`block text-[11px] uppercase tracking-[0.22em] ${light ? "text-wood-300" : "text-wood-700"}`}>
            Manali
          </span>
        </span>
      ) : null}
    </span>
  );
}
