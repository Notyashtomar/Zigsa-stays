import Link from "next/link";
import { Logo } from "@/components/Logo";
import { StickyBookBar } from "@/components/StickyBookBar";
import { site, telHref } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-wood-300/60 bg-forest-950 text-cream-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <Logo size={64} showWordmark light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-200/80">
            {site.tagline}. Hotel, café, and restaurant on a quiet hillside in Simsa — west of the Beas, a short way from Mall Road.
          </p>
        </div>
        <div>
          <p className="eyebrow text-wood-300">Find us</p>
          <p className="mt-3 text-sm leading-relaxed text-cream-100/90">{site.address}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-wood-300">Plus code {site.plusCode}</p>
          <ul className="mt-4 space-y-1 text-sm">
            {site.phones.map((phone, index) => (
              <li key={phone}>
                <a className="hover:text-wood-300" href={telHref(index)}>
                  {phone}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-wood-300">Stay in touch</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <a href={site.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-wood-300">
              Instagram {site.instagramHandle}
            </a>
            <Link href="/book" className="hover:text-wood-300">
              Book a room
            </Link>
            <Link href="/dine" className="hover:text-wood-300">
              Café & restaurant
            </Link>
            <Link href="/location" className="hover:text-wood-300">
              How to reach
            </Link>
            <Link href="/admin/login" className="text-cream-200/50 hover:text-cream-100">
              Staff
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 pb-20 text-center text-xs text-cream-200/50 md:pb-4">
        © {new Date().getFullYear()} Zigsa Stays Manali. Single hillside property — more stays can join later.
      </div>
      <StickyBookBar />
    </footer>
  );
}
