"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { InventoryItem } from "@/lib/types"
import { AlertTriangle, ArrowLeft, Package } from "lucide-react"

interface LowStockAlertProps {
  items: InventoryItem[]
}

export function LowStockAlert({ items }: LowStockAlertProps) {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          تنبيهات المخزون المنخفض
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/inventory?filter=low_stock" className="gap-1">
            عرض الكل
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>جميع المواد بمستويات جيدة</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const percentage = Math.round(
                (item.quantity / item.min_quantity) * 100
              )
              const isUrgent = percentage < 30

              return (
                <Link
                  key={item.id}
                  href={`/dashboard/inventory/${item.id}`}
                  className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        SKU: {item.sku} | {item.warehouse?.name || "غير محدد"}
                      </p>
                    </div>
                    <Badge
                      variant={isUrgent ? "destructive" : "secondary"}
                      className="shrink-0"
                    >
                      {isUrgent ? "حرج" : "منخفض"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.quantity} / {item.min_quantity} {item.unit}
                      </span>
                      <span
                        className={
                          isUrgent ? "text-destructive" : "text-amber-600"
                        }
                      >
                        {percentage}%
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      className={`h-2 ${
                        isUrgent ? "[&>div]:bg-destructive" : "[&>div]:bg-amber-500"
                      }`}
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
