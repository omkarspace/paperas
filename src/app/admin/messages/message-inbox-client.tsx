"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface MessageInboxClientProps {
  messageId: string;
}

export function MessageInboxClient({ messageId }: MessageInboxClientProps) {
  const router = useRouter();

  async function markAsRead() {
    await fetch(`/api/admin/messages/${messageId}`, { method: "PATCH" });
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" className="mt-3" onClick={markAsRead}>
      Mark as read
    </Button>
  );
}
