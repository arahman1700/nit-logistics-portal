import { createClient } from "@/lib/supabase/server"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { InventoryChart } from "@/components/dashboard/inventory-chart"
import { JobOrdersChart } from "@/components/dashboard/job-orders-chart"
import { LowStockAlert } from "@/components/dashboard/low-stock-alert"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch dashboard stats
  const [
    { count: totalJobOrders },
    { count: pendingJobOrders },
    { count: completedJobOrders },
    { count: totalInventory },
    { count: lowStockItems },
    { count: totalShipments },
    { count: inTransitShipments },
    { count: totalProjects },
    { count: activeProjects },
  ] = await Promise.all([
    supabase.from("job_orders").select("*", { count: "exact", head: true }),
    supabase.from("job_orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("job_orders").select("*", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("inventory_items").select("*", { count: "exact", head: true }),
    supabase.from("inventory_items").select("*", { count: "exact", head: true }).lt("quantity", 10),
    supabase.from("shipments").select("*", { count: "exact", head: true }),
    supabase.from("shipments").select("*", { count: "exact", head: true }).eq("status", "in_transit"),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "active"),
  ])

  // Fetch recent job orders
  const { data: recentJobOrders } = await supabase
    .from("job_orders")
    .select("*, project:projects(*)")
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch low stock items
  const { data: lowStockItemsList } = await supabase
    .from("inventory_items")
    .select("*, warehouse:warehouses(*)")
    .lt("quantity", 10)
    .order("quantity", { ascending: true })
    .limit(5)

  const stats = {
    totalJobOrders: totalJobOrders || 0,
    pendingJobOrders: pendingJobOrders || 0,
    completedJobOrders: completedJobOrders || 0,
    totalInventoryItems: totalInventory || 0,
    lowStockItems: lowStockItems || 0,
    totalShipments: totalShipments || 0,
    inTransitShipments: inTransitShipments || 0,
    totalProjects: totalProjects || 0,
    activeProjects: activeProjects || 0,
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
        <p className="text-muted-foreground">
          مرحباً بك في نظام إدارة اللوجستيات - NIT
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <JobOrdersChart />
        <InventoryChart />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity jobOrders={recentJobOrders || []} />
        <LowStockAlert items={lowStockItemsList || []} />
      </div>
    </div>
  )
}
