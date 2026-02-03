"use client"

import { Card, CardContent } from "@/components/ui/card"
import { DashboardStats } from "@/lib/types"
import {
  ClipboardList,
  Package,
  Truck,
  FolderKanban,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "طلبات العمل",
      value: stats.totalJobOrders,
      subtitle: `${stats.pendingJobOrders} قيد الانتظار`,
      icon: ClipboardList,
      trend: stats.completedJobOrders > 0 ? "up" : "neutral",
      trendValue: `${stats.completedJobOrders} مكتملة`,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "المخزون",
      value: stats.totalInventoryItems,
      subtitle: `${stats.lowStockItems} منخفض`,
      icon: Package,
      trend: stats.lowStockItems > 5 ? "down" : "up",
      trendValue: stats.lowStockItems > 5 ? "تنبيه" : "جيد",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "الشحنات",
      value: stats.totalShipments,
      subtitle: `${stats.inTransitShipments} في الطريق`,
      icon: Truck,
      trend: "neutral",
      trendValue: "نشط",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: "المشاريع",
      value: stats.totalProjects,
      subtitle: `${stats.activeProjects} نشط`,
      icon: FolderKanban,
      trend: "up",
      trendValue: "مستمر",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
      {cards.map((card) => (
        <Card key={card.title} className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-3xl font-bold text-foreground">{card.value}</p>
                <div className="flex items-center gap-2">
                  {card.trend === "up" && (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  )}
                  {card.trend === "down" && (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  {card.trend === "neutral" && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {card.trendValue}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
              {card.subtitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
