import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { RoomCard } from "@/components/RoomCard";
import { getPrimaryProperty, serializeRoom } from "@/lib/booking";
import { images } from "@/lib/images";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Rooms",
};

export default async function RoomsPage() {
  const property = await getPrimaryProperty();
  const rooms = property?.roomTypes.map(serializeRoom) ?? [];

  return (
    <>
      <Header overlay />
      <PageHero
        eyebrow="Accommodations"
        title="Three ways to sleep on the hill."
        lede="Wood-panelled rooms, windows that earn their keep, and a kitchen downstairs. Rates below are editable by the desk — the quiet is not."
        image={images.roomValley}
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
