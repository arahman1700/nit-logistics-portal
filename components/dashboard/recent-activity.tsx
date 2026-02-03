"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { JobOrder } from "@/lib/types"
import { Activity, ArrowLeft, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ar } from "date-fns/locale"

interface RecentActivityProps {
  jobOrders: JobOrder[]
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  approved: "معتمد",
  in_progress: "قيد التنفيذ",
  completed: "مكتمل",
  cancelled: "ملغى",
}

const typeLabels: Record<string, string> = {
  material_request: "طلب مواد",
  transfer: "نقل",
  return: "إرجاع",
  inspection: "فحص",
}

export function RecentActivity({ jobOrders }: RecentActivityProps) {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          آخر طلبات العمل
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/job-orders" className="gap-1">
            عرض الكل
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {jobOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>لا توجد طلبات عمل حتى الآن</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobOrders.map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/job-orders/${order.id}`}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">
                      {order.order_number}
                    </span>
                    <Badge
                      variant="secondary"
                      className={statusColors[order.status]}
                    >
                      {statusLabels[order.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {typeLabels[order.type]} - {order.project?.name || "بدون مشروع"}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(order.created_at), {
                      addSuffix: true,
                      locale: ar,
                    })}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    order.priority === "urgent"
                      ? "border-red-500 text-red-500"
                      : order.priority === "high"
                      ? "border-orange-500 text-orange-500"
                      : "border-muted-foreground"
                  }
                >
                  {order.priority === "urgent"
                    ? "عاجل"
                    : order.priority === "high"
                    ? "عالي"
                    : order.priority === "medium"
                    ? "متوسط"
                    : "منخفض"}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
