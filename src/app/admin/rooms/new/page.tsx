import { RoomEditor } from "@/components/RoomEditor";

export const metadata = { title: "New room type" };

export default function NewRoomPage() {
  return (
    <main className="space-y-6">
      <h1 className="font-display text-4xl text-forest-900">Add a room type</h1>
      <RoomEditor />
    </main>
  );
}
