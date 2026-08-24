import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { expireStaleBookings } from "@/lib/booking";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  await expireStaleBookings();
  const bookings = await prisma.booking.findMany({
    include: { roomType: true, payment: true },
    orderBy: { checkIn: "asc" },
  });
  return NextResponse.json({ bookings });
}
