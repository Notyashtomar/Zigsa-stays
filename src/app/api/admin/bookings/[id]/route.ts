import { BookingStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  status: z.enum(["CONFIRMED", "CANCELLED"]),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await context.params;
  const { status } = schema.parse(await request.json());

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      status: status as BookingStatus,
      expiresAt: null,
    },
    include: { roomType: true, payment: true },
  });

  return NextResponse.json({ booking });
}
