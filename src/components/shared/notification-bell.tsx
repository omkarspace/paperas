"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetch("/api/notifications?unread=true")
      .then((r) => r.json())
      .then((data) => {
        if (data.notifications) setUnreadCount(data.notifications.length)
      })
      .catch(() => {})
  }, [])

  return (
    <Link href="/notifications" className="relative">
      <Button variant="ghost" size="icon" className="h-10 w-10">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>
    </Link>
  )
}
