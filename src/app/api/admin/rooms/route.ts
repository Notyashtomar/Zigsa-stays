import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { getPrimaryProperty } from "@/lib/booking";
import { rupeesToPaise } from "@/lib/money";
import { prisma } from "@/lib/prisma";

const roomSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  maxGuests: z.number().int().min(1).max(12),
  inventoryCount: z.number().int().min(1).max(50),
  baseRateRupees: z.number().min(500),
  amenities: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const rooms = await prisma.roomType.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ rooms });
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const property = await getPrimaryProperty();
  if (!property) {
    return NextResponse.json({ error: "No property has been seeded." }, { status: 400 });
  }
  const body = roomSchema.parse(await request.json());
  const room = await prisma.roomType.create({
    data: {
      propertyId: property.id,
      name: body.name,
      slug: body.slug,
      description: body.description,
      maxGuests: body.maxGuests,
      inventoryCount: body.inventoryCount,
      baseRateNight: rupeesToPaise(body.baseRateRupees),
      amenities: JSON.stringify(body.amenities),
      isActive: body.isActive,
      sortOrder: body.sortOrder,
    },
  });
  return NextResponse.json({ room });
}
