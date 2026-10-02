import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const base = process.env.SMOKE_URL || "http://localhost:3000";

function ymd(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

const room = await prisma.roomType.findFirst({ where: { slug: "deluxe-room" } });
if (!room) throw new Error("Deluxe room missing from seed");

const checkIn = ymd(5);
const checkOut = ymd(7);

const availability = await fetch(
  `${base}/api/availability?roomTypeId=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}`,
).then((r) => r.json());
console.log("availability", availability);

const created = await fetch(`${base}/api/bookings`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    roomTypeId: room.id,
    guestName: "Smoke Tester",
    guestEmail: "smoke@example.com",
    guestPhone: "+919000000000",
    checkIn,
    checkOut,
    guests: 2,
  }),
}).then(async (r) => ({ status: r.status, body: await r.json() }));
console.log("booking", created);

const order = await fetch(`${base}/api/payments/create-order`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ bookingId: created.body.bookingId }),
}).then(async (r) => ({ status: r.status, body: await r.json() }));
console.log("order", order);

const confirm = await fetch(`${base}/book/confirm?code=${created.body.confirmationCode}&status=pending`);
console.log("confirm page", confirm.status);

await prisma.$disconnect();
