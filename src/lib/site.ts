export const site = {
  name: "Zigsa Stays",
  nameLong: "Zigsa Stays Manali",
  tagline: "Elevation: High. Stress: Zero",
  bio: "Luxury hotel and B&B — hotel, café, and restaurant on a quiet hillside in Simsa.",
  address: "Near Hotel Avishi Greens, Simsa Village, Manali, Himachal Pradesh 175131",
  village: "Simsa Village",
  city: "Manali",
  state: "Himachal Pradesh",
  pincode: "175131",
  setting: "Quiet hillside on Kanyal Road / Rangri / Simsa, west of the Beas, about 2 km from Mall Road.",
  latitude: 32.2230781,
  longitude: 77.1891798,
  plusCode: "65FQ+6M",
  phones: ["+91 8700267946", "+91 9166485579"] as const,
  phoneE164: ["918700267946", "919166485579"] as const,
  instagramUrl: "https://www.instagram.com/zigsastays/",
  instagramHandle: "@zigsastays",
  googleRating: 4.1,
  googleReviewCount: 7,
  howToReach: {
    taxi: "Taxi from the Manali bus stand via Kanyal Road toward Rangri and Simsa. Ask for Zigsa Stays, near Hotel Avishi Greens.",
    airport:
      "Bhuntar (Kullu–Manali) Airport is about 50 km and 1.5–2 hours by road, depending on season and traffic.",
    rail: "There is no local railway. The usual railheads are farther down-country; most guests finish the journey by road from Bhuntar or the Manali bus stand.",
  },
  dayTrips: ["Hadimba Temple", "Old Manali", "Mall Road", "Village waterfall nearby"],
} as const;

export function whatsappHref(message?: string) {
  const base = `https://wa.me/${site.phoneE164[0]}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function telHref(index = 0) {
  return `tel:+${site.phoneE164[index]}`;
}

export function mapsEmbedSrc() {
  const { latitude, longitude } = site;
  return `https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=15&output=embed`;
}

export function mapsOpenSrc() {
  return `https://www.google.com/maps/search/?api=1&query=${site.latitude},${site.longitude}`;
}
