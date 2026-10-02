import { addDays } from "date-fns";
import { BookForm } from "@/components/BookForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { getPrimaryProperty, serializeRoom } from "@/lib/booking";
import { toDateInput } from "@/lib/dates";
import { images } from "@/lib/images";
import { razorpayConfigured } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Book a stay",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string; room?: string }>;
}) {
  const query = await searchParams;
  const property = await getPrimaryProperty();
  const rooms = property?.roomTypes.map(serializeRoom) ?? [];
  const checkIn = query.checkIn || toDateInput(addDays(new Date(), 1));
  const checkOut = query.checkOut || toDateInput(addDays(new Date(), 3));
  const guests = Number(query.guests) || 2;
  const paymentsConfigured = razorpayConfigured();

  return (
    <>
      <Header overlay />
      <PageHero
        eyebrow="Direct booking"
        title={paymentsConfigured ? "Hold the room, then pay." : "Reserve now, settle on the hill."}
        lede={
          paymentsConfigured
            ? "Night-count pricing, named room types, and a 15-minute hold while you pay with UPI or card."
            : "Night-count pricing and named room types. Online payment is not switched on for this server yet, so the room is reserved in your name — pay at the property or confirm on WhatsApp."
        }
        image={images.roomDeluxe}
      />
      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <BookForm
          rooms={rooms}
          initialCheckIn={checkIn}
          initialCheckOut={checkOut}
          initialGuests={guests}
          initialRoomSlug={query.room}
          paymentsConfigured={paymentsConfigured}
        />
      </main>
      <Footer />
    </>
  );
}
