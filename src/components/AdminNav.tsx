"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/rooms", label: "Rooms & rates" },
  { href: "/admin/blocked", label: "Blocked dates" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <aside className="flex flex-col justify-between bg-forest-950 p-6 text-cream-50 md:min-h-screen md:w-64">
      <div>
        <p className="font-display text-2xl">Zigsa staff</p>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-wood-300">Manali desk</p>
        <nav className="mt-8 space-y-1" aria-label="Admin">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-xl px-3 py-2 text-sm ${active ? "bg-forest-700" : "hover:bg-white/5"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-8 space-y-2">
        <Link href="/" className="block text-sm text-cream-200/70 hover:text-cream-50">
          View site
        </Link>
        <button type="button" className="text-sm text-wood-300" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
