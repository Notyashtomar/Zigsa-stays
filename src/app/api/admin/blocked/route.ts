import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { getPrimaryProperty } from "@/lib/booking";
import { parseDateOnly } from "@/lib/dates";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  roomTypeId: z.string().nullable().optional(),
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string().max(200).optional(),
});

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const blocked = await prisma.blockedDate.findMany({
    include: { roomType: true },
    orderBy: { startDate: "asc" },
  });
  return NextResponse.json({ blocked });
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const property = await getPrimaryProperty();
  if (!property) {
    return NextResponse.json({ error: "No property has been seeded." }, { status: 400 });
  }
  const body = schema.parse(await request.json());
  const startDate = parseDateOnly(body.startDate);
  const endDate = parseDateOnly(body.endDate);
  if (!startDate || !endDate || endDate <= startDate) {
    return NextResponse.json({ error: "End date must be after start date." }, { status: 400 });
  }

  const blocked = await prisma.blockedDate.create({
    data: {
      propertyId: property.id,
      roomTypeId: body.roomTypeId || null,
      startDate,
      endDate,
      reason: body.reason,
    },
  });
  return NextResponse.json({ blocked });
}
