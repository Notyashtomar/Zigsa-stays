import { notFound } from "next/navigation";
import { RoomEditor } from "@/components/RoomEditor";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Edit room" };

export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = await prisma.roomType.findUnique({ where: { id } });
  if (!room) notFound();
  return (
    <main className="space-y-6">
      <h1 className="font-display text-4xl text-forest-900">Edit {room.name}</h1>
      <RoomEditor room={room} />
    </main>
  );
}
