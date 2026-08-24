import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="eyebrow">Wrong trail</p>
        <h1 className="font-display mt-3 text-4xl text-forest-900">That page is not on this hillside.</h1>
        <p className="mt-4 text-ink-700">The stay, the kitchen, and the road up from Kanyal are still here.</p>
        <Link href="/" className="btn-primary mt-8">
          Back to Zigsa Stays
        </Link>
      </main>
      <Footer />
    </>
  );
}
