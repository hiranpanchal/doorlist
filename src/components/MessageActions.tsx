"use client";

import { useRouter } from "next/navigation";
import { Archive, Inbox, Trash2 } from "lucide-react";

export default function MessageActions({
  messageId,
  archived,
}: {
  messageId: string;
  archived: boolean;
}) {
  const router = useRouter();

  async function toggleArchive() {
    await fetch(`/api/messages/${messageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: !archived }),
    });
    router.push("/dashboard/messages");
    router.refresh();
  }

  async function deleteMessage() {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/messages/${messageId}`, { method: "DELETE" });
    router.push("/dashboard/messages");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleArchive}
        className="p-2 rounded-lg hover:bg-surface transition-colors text-muted hover:text-ink"
        title={archived ? "Move to inbox" : "Archive"}
      >
        {archived ? <Inbox className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
      </button>
      <button
        onClick={deleteMessage}
        className="p-2 rounded-lg hover:bg-red-50 transition-colors text-muted hover:text-red-600"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
