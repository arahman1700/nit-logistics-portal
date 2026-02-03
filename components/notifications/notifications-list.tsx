"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Notification } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  Check,
  CheckCheck,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Trash2,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ar } from "date-fns/locale"

interface NotificationsListProps {
  notifications: Notification[]
}

const typeIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
}

const typeColors = {
  info: "text-blue-500 bg-blue-100",
  success: "text-green-500 bg-green-100",
  warning: "text-amber-500 bg-amber-100",
  error: "text-red-500 bg-red-100",
}

export function NotificationsList({ notifications }: NotificationsListProps) {
  const [items, setItems] = useState(notifications)
  const [isMarkingAll, setIsMarkingAll] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const unreadCount = items.filter((n) => !n.read).length

  async function markAsRead(id: string) {
    await supabase.from("notifications").update({ read: true }).eq("id", id)
    setItems(items.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  async function markAllAsRead() {
    setIsMarkingAll(true)
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("read", false)
    setItems(items.map((n) => ({ ...n, read: true })))
    setIsMarkingAll(false)
  }

  async function deleteNotification(id: string) {
    await supabase.from("notifications").delete().eq("id", id)
    setItems(items.filter((n) => n.id !== id))
  }

  if (items.length === 0) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="py-12 text-center">
          <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">لا توجد إشعارات</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Actions Bar */}
      {unreadCount > 0 && (
        <div className="flex items-center justify-between">
          <Badge variant="secondary">
            {unreadCount} إشعار غير مقروء
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={isMarkingAll}
            className="gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            تعليم الكل كمقروء
          </Button>
        </div>
      )}

      {/* Notifications List */}
      <Card className="border-0 shadow-md overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {items.map((notification) => {
              const Icon = typeIcons[notification.type]
              const colorClass = typeColors[notification.type]

              return (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 transition-colors ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p
                          className={`font-medium ${
                            !notification.read ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDistanceToNow(new Date(notification.created_at), {
                            addSuffix: true,
                            locale: ar,
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(notification.id)}
                            title="تعليم كمقروء"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteNotification(notification.id)}
                          title="حذف"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {notification.link && (
                      <Link
                        href={notification.link}
                        className="inline-block mt-2 text-sm text-primary hover:underline"
                      >
                        عرض التفاصيل
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
