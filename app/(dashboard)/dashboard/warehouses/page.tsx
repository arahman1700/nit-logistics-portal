import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Plus, Warehouse, MapPin, Package, Users } from "lucide-react"

export default async function WarehousesPage() {
  const supabase = await createClient()

  const { data: warehouses } = await supabase
    .from("warehouses")
    .select("*, manager:profiles(full_name)")
    .order("name")

  // Get item counts per warehouse
  const { data: itemCounts } = await supabase
    .from("inventory_items")
    .select("warehouse_id")

  const warehouseItemCounts =
    itemCounts?.reduce((acc, item) => {
      if (item.warehouse_id) {
        acc[item.warehouse_id] = (acc[item.warehouse_id] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>) || {}

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Warehouse className="w-7 h-7 text-primary" />
            المستودعات
          </h1>
          <p className="text-muted-foreground">إدارة جميع المستودعات والمواقع</p>
        </div>
        <Button asChild className="gradient-primary gap-2">
          <Link href="/dashboard/warehouses/new">
            <Plus className="w-4 h-4" />
            مستودع جديد
          </Link>
        </Button>
      </div>

      {/* Warehouses Grid */}
      {!warehouses || warehouses.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="py-12 text-center">
            <Warehouse className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">لا توجد مستودعات حتى الآن</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/warehouses/new">إضافة مستودع جديد</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {warehouses.map((warehouse) => {
            const itemCount = warehouseItemCounts[warehouse.id] || 0
            const capacityUsed = warehouse.capacity
              ? Math.round((warehouse.current_stock / warehouse.capacity) * 100)
              : 0

            return (
              <Card
                key={warehouse.id}
                className="border-0 shadow-md hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Warehouse className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                        {warehouse.location && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {warehouse.location}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={capacityUsed > 80 ? "destructive" : "secondary"}
                    >
                      {capacityUsed}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Capacity Progress */}
                  {warehouse.capacity && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">السعة المستخدمة</span>
                        <span>
                          {warehouse.current_stock.toLocaleString()} /{" "}
                          {warehouse.capacity.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={capacityUsed}
                        className={`h-2 ${
                          capacityUsed > 80
                            ? "[&>div]:bg-destructive"
                            : capacityUsed > 60
                            ? "[&>div]:bg-amber-500"
                            : "[&>div]:bg-green-500"
                        }`}
                      />
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Package className="w-4 h-4" />
                        <span>الأصناف</span>
                      </div>
                      <p className="text-xl font-bold mt-1">{itemCount}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>المدير</span>
                      </div>
                      <p className="text-sm font-medium mt-1 truncate">
                        {warehouse.manager?.full_name || "غير محدد"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <Button variant="ghost" size="sm" asChild className="w-full">
                      <Link href={`/dashboard/warehouses/${warehouse.id}`}>
                        عرض التفاصيل
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
