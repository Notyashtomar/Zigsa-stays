"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function StickyBookBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/book")) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-wood-300/70 bg-cream-50/95 p-3 shadow-[0_-8px_30px_rgba(18,38,29,0.12)] backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-1">
        <p className="text-sm text-ink-700">
          <span className="block font-display text-base text-forest-900">Zigsa Stays</span>
          Simsa · west of the Beas
        </p>
        <Link href="/book" className="btn-primary">
          Book a stay
        </Link>
      </div>
    </div>
  );
}
