import type { StaticImageData } from "next/image";
import cafeImg from "@/images/zigsa-cafe.jpg";
import forestImg from "@/images/zigsa-forest.jpg";
import heroImg from "@/images/zigsa-hero.jpg";
import restaurantImg from "@/images/zigsa-restaurant.jpg";
import roomDeluxeImg from "@/images/zigsa-room-deluxe.jpg";
import roomSuiteImg from "@/images/zigsa-room-suite.jpg";
import roomValleyImg from "@/images/zigsa-room-valley.jpg";
import terraceImg from "@/images/zigsa-terrace.jpg";

export type SiteImage = {
  src: StaticImageData;
  alt: string;
};

export const images = {
  hero: {
    src: heroImg,
    alt: "Dawn over the Manali valley from a wooden balcony — deodar forest, village rooftops, and snow peaks",
  },
  terrace: {
    src: terraceImg,
    alt: "Wooden terrace with burnt-orange cushions and chai, facing forested slopes and snow peaks",
  },
  cafe: {
    src: cafeImg,
    alt: "Café table by a window — pour-over coffee, toast, and the deodar forest outside",
  },
  restaurant: {
    src: restaurantImg,
    alt: "Evening thali with dal, rotis, and siddu by lantern light, dusk over the valley behind",
  },
  forest: {
    src: forestImg,
    alt: "Path through deodar cedars with a small waterfall — the walk out of Simsa village",
  },
  roomDeluxe: {
    src: roomDeluxeImg,
    alt: "Deluxe room — wood-panelled walls, white duvet, forest-green throw, warm lamps",
  },
  roomValley: {
    src: roomValleyImg,
    alt: "Valley-view room — bed angled to a picture window over green slopes and snow peaks",
  },
  roomSuite: {
    src: roomSuiteImg,
    alt: "Family suite — king bed, beamed ceiling, and a sitting nook with a rust-orange sofa",
  },
} as const satisfies Record<string, SiteImage>;

export function roomImage(slug: string): SiteImage {
  if (slug.includes("valley")) return images.roomValley;
  if (slug.includes("family") || slug.includes("suite")) return images.roomSuite;
  if (slug.includes("deluxe")) return images.roomDeluxe;
  return images.terrace;
}

export const galleryFrames: Array<SiteImage & { title: string; caption: string; tall?: boolean }> = [
  {
    ...images.hero,
    title: "Valley dawn",
    caption: "First light on the peaks, mist still on the Beas side.",
  },
  {
    ...images.terrace,
    title: "The terrace",
    caption: "Chai, cushions, and nothing that honks.",
  },
  {
    ...images.roomValley,
    title: "Valley View Room",
    caption: "The window does most of the decorating.",
  },
  {
    ...images.roomDeluxe,
    title: "Deluxe Room",
    caption: "Wood walls, warm lamps, proper duvet.",
  },
  {
    ...images.forest,
    title: "The waterfall walk",
    caption: "A short path out of Simsa — cedar, moss, cold water.",
    tall: true,
  },
  {
    ...images.cafe,
    title: "Café, morning",
    caption: "Second cup, valley still waking.",
  },
  {
    ...images.restaurant,
    title: "Dinner on the hill",
    caption: "Thali, siddu, lantern light.",
  },
  {
    ...images.roomSuite,
    title: "Family Suite",
    caption: "Room for the whole carload.",
  },
];
