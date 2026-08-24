import { NextResponse } from "next/server";
import { getRoomAvailability } from "@/lib/booking";
import { parseDateOnly } from "@/lib/dates";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roomTypeId = searchParams.get("roomTypeId");
  const checkIn = parseDateOnly(searchParams.get("checkIn") ?? "");
  const checkOut = parseDateOnly(searchParams.get("checkOut") ?? "");

  if (!roomTypeId || !checkIn || !checkOut) {
    return NextResponse.json(
      { error: "roomTypeId, checkIn, and checkOut are required." },
      { status: 400 },
    );
  }

  const result = await getRoomAvailability({ roomTypeId, checkIn, checkOut });
  return NextResponse.json({
    available: result.available,
    inventory: result.inventory,
    blocked: result.blocked,
    ratePerNight: result.room?.baseRateNight ?? 0,
  });
}
