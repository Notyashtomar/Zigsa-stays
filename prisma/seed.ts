import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const property = await prisma.property.upsert({
    where: { slug: "zigsa-stays-manali" },
    update: {
      name: "Zigsa Stays",
      tagline: "Elevation: High. Stress: Zero",
      description:
        "A luxury hotel and B&B in Simsa village — hotel, café, and restaurant on a quiet hillside west of the Beas, about two kilometres from Mall Road.",
      address: "Near Hotel Avishi Greens, Simsa Village, Manali, Himachal Pradesh 175131",
      city: "Manali",
      state: "Himachal Pradesh",
      pincode: "175131",
      latitude: 32.2230781,
      longitude: 77.1891798,
      plusCode: "65FQ+6M",
      phone1: "+91 8700267946",
      phone2: "+91 9166485579",
      instagramUrl: "https://www.instagram.com/zigsastays/",
    },
    create: {
      name: "Zigsa Stays",
      slug: "zigsa-stays-manali",
      tagline: "Elevation: High. Stress: Zero",
      description:
        "A luxury hotel and B&B in Simsa village — hotel, café, and restaurant on a quiet hillside west of the Beas, about two kilometres from Mall Road.",
      address: "Near Hotel Avishi Greens, Simsa Village, Manali, Himachal Pradesh 175131",
      city: "Manali",
      state: "Himachal Pradesh",
      pincode: "175131",
      latitude: 32.2230781,
      longitude: 77.1891798,
      plusCode: "65FQ+6M",
      phone1: "+91 8700267946",
      phone2: "+91 9166485579",
      instagramUrl: "https://www.instagram.com/zigsastays/",
    },
  });

  const rooms = [
    {
      name: "Deluxe Room",
      slug: "deluxe-room",
      description:
        "A quiet room for two on the village side of the hill. Wood, warm light, and enough space to unpack after the Kullu valley drive. Placeholder rate — the owner can edit this in admin.",
      maxGuests: 2,
      inventoryCount: 2,
      baseRateNight: 650000,
      amenities: JSON.stringify([
        "King or twin beds",
        "Valley-side windows",
        "Ensuite bath",
        "Heating in season",
        "Daily housekeeping",
      ]),
      sortOrder: 1,
    },
    {
      name: "Valley View Room",
      slug: "valley-view-room",
      description:
        "Wider glass toward the Beas valley and the ridgelines west of town. Made for slow mornings and a second cup from the café downstairs. Placeholder rate — edit in admin.",
      maxGuests: 2,
      inventoryCount: 2,
      baseRateNight: 850000,
      amenities: JSON.stringify([
        "Valley outlook",
        "King bed",
        "Sitting nook",
        "Ensuite bath",
        "Heating in season",
        "Daily housekeeping",
      ]),
      sortOrder: 2,
    },
    {
      name: "Family Suite",
      slug: "family-suite",
      description:
        "A larger suite for four — extra sitting room for wet boots, cards, and late tea after Hadimba or Old Manali. One suite on the books. Placeholder rate — edit in admin.",
      maxGuests: 4,
      inventoryCount: 1,
      baseRateNight: 1200000,
      amenities: JSON.stringify([
        "Sleeps four",
        "Separate sitting room",
        "Ensuite bath",
        "Heating in season",
        "Room for luggage and kids",
        "Daily housekeeping",
      ]),
      sortOrder: 3,
    },
  ];

  for (const room of rooms) {
    await prisma.roomType.upsert({
      where: { slug: room.slug },
      update: {
        ...room,
        propertyId: property.id,
        isActive: true,
      },
      create: {
        ...room,
        propertyId: property.id,
        isActive: true,
      },
    });
  }

  console.log("Seeded Zigsa Stays Manali with three editable room types.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
