import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageInboxClient } from "./message-inbox-client";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Contact Messages</h2>
        <p className="text-sm text-muted-foreground">
          {messages.filter((m) => !m.read).length} unread
        </p>
      </div>

      <div className="space-y-3">
        {messages.map((message) => (
          <Card key={message.id} className={message.read ? "" : "border-primary/30"}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    {message.subject}
                    {!message.read && (
                      <Badge variant="default" className="rounded-full h-2 w-2 p-0" />
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {message.name} &lt;{message.email}&gt;
                  </p>
                </div>
                <p className="text-xs text-muted-foreground shrink-0">
                  {new Intl.DateTimeFormat(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(message.createdAt))}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{message.message}</p>
              {!message.read && <MessageInboxClient messageId={message.id} />}
            </CardContent>
          </Card>
        ))}
        {messages.length === 0 && (
          <p className="text-muted-foreground text-center py-12">No messages yet.</p>
        )}
      </div>
    </div>
  );
}
