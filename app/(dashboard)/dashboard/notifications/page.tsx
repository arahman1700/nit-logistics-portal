import { createClient } from "@/lib/supabase/server"
import { NotificationsList } from "@/components/notifications/notifications-list"
import { Bell } from "lucide-react"

export default async function NotificationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Bell className="w-7 h-7 text-primary" />
          الإشعارات
        </h1>
        <p className="text-muted-foreground">
          جميع الإشعارات والتنبيهات الخاصة بك
        </p>
      </div>

      <NotificationsList notifications={notifications || []} />
    </div>
  )
}
