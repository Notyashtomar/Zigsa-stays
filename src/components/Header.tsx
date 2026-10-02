"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

const links = [
  { href: "/rooms", label: "Rooms" },
  { href: "/dine", label: "Café & restaurant" },
  { href: "/location", label: "Location" },
  { href: "/gallery", label: "Gallery" },
];

export function Header({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const onDark = overlay && !open;

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  return (
    <header
      className={`z-40 w-full ${
        overlay
          ? `fixed inset-x-0 top-0 transition-all duration-500 ${
              scrolled
                ? "border-b border-cream-50/10 bg-forest-950/85 shadow-[0_10px_40px_rgba(12,26,20,0.35)] backdrop-blur-md"
                : "bg-transparent"
            }`
          : "sticky top-0 border-b border-wood-300/50 bg-cream-100/90 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" aria-label="Zigsa Stays home" className="shrink-0">
          <Logo size={52} showWordmark light={onDark} />
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide transition ${
                pathname.startsWith(link.href)
                  ? onDark
                    ? "text-wood-300"
                    : "text-forest-800"
                  : onDark
                    ? "text-cream-100/85 hover:text-cream-50"
                    : "text-ink-700 hover:text-forest-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/book" className={onDark ? "btn-secondary border-cream-200/40 bg-cream-50/10 text-cream-50 hover:bg-cream-50/20" : "btn-primary"}>
            Book a stay
          </Link>
        </nav>
        <button
          type="button"
          className={`md:hidden rounded-full px-3 py-2 text-sm ${onDark ? "text-cream-50" : "text-forest-800"}`}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open ? (
        <nav
          id="mobile-nav"
          className="space-y-1 border-t border-wood-300/40 bg-cream-50 px-4 py-4 md:hidden"
          aria-label="Mobile"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-lg px-3 py-2 text-forest-900"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/book" className="btn-primary mt-2 w-full" onClick={() => setOpen(false)}>
            Book a stay
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
