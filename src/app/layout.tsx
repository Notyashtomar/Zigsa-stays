import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { Providers } from "@/components/Providers";
import { site } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: {
    default: `${site.nameLong} · ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.bio,
  openGraph: {
    title: site.nameLong,
    description: `${site.tagline}. ${site.bio}`,
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "/brand/logo.png",
    apple: "/brand/logo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${outfit.variable} paper-grain antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
