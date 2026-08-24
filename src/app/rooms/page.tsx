import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { RoomCard } from "@/components/RoomCard";
import { getPrimaryProperty, serializeRoom } from "@/lib/booking";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Rooms",
};

export default async function RoomsPage() {
  const property = await getPrimaryProperty();
  const rooms = property?.roomTypes.map(serializeRoom) ?? [];

  return (
    <>
      <Header />
      <PageHero
        eyebrow="Named room types"
        title="Three ways to sleep on the hill."
        lede="Rates and inventory below are placeholders the owner can edit in admin. What will not change: quiet rooms, a kitchen downstairs, and a road that does not dump you onto Mall Road at midnight."
      />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
