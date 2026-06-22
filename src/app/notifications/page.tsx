"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Notification {
  id: string
  title: string
  message: string
  link: string | null
  read: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  function load() {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        if (data.notifications) setNotifications(data.notifications)
      })
  }

  useEffect(load, [])

  async function markAllRead() {
    await fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    })
    load()
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button variant="outline" onClick={markAllRead}>Mark all read</Button>
      </div>

      {notifications.length === 0 && (
        <p className="text-muted-foreground text-center py-12">No notifications yet.</p>
      )}

      <div className="space-y-2">
        {notifications.map((n) => (
          <Card key={n.id} className={n.read ? "" : "border-l-2 border-l-primary"}>
            <CardContent className="p-4">
              <Link href={n.link || "#"} className="block" onClick={() => load()}>
                <p className="font-medium">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(n.createdAt).toLocaleDateString()}
                </p>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
