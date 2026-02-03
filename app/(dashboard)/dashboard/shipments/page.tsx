import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Truck, MapPin, Clock, User, Phone } from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

const statusColors: Record<string, string> = {
  preparing: "bg-yellow-100 text-yellow-800",
  in_transit: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  delayed: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
}

const statusLabels: Record<string, string> = {
  preparing: "قيد التجهيز",
  in_transit: "في الطريق",
  delivered: "تم التسليم",
  delayed: "متأخر",
  cancelled: "ملغى",
}

export default async function ShipmentsPage() {
  const supabase = await createClient()

  const { data: shipments } = await supabase
    .from("shipments")
    .select("*, job_order:job_orders(*), origin_warehouse:warehouses(*)")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Truck className="w-7 h-7 text-primary" />
            الشحنات
          </h1>
          <p className="text-muted-foreground">تتبع وإدارة جميع الشحنات</p>
        </div>
        <Button asChild className="gradient-primary gap-2">
          <Link href="/dashboard/shipments/new">
            <Plus className="w-4 h-4" />
            شحنة جديدة
          </Link>
        </Button>
      </div>

      {/* Shipments Grid */}
      {!shipments || shipments.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="py-12 text-center">
            <Truck className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">لا توجد شحنات حتى الآن</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/shipments/new">إنشاء شحنة جديدة</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {shipments.map((shipment) => (
            <Card
              key={shipment.id}
              className="border-0 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-mono">
                      {shipment.tracking_number}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {shipment.carrier || "غير محدد"}
                    </p>
                  </div>
                  <Badge className={statusColors[shipment.status]}>
                    {statusLabels[shipment.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">من:</span>
                    <span>{shipment.origin_warehouse?.name || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">إلى:</span>
                    <span>{shipment.destination || "-"}</span>
                  </div>
                </div>

                {shipment.driver_name && (
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{shipment.driver_name}</span>
                    </div>
                    {shipment.driver_phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span dir="ltr">{shipment.driver_phone}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {shipment.estimated_delivery
                      ? format(new Date(shipment.estimated_delivery), "dd MMM yyyy", {
                          locale: ar,
                        })
                      : "غير محدد"}
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/shipments/${shipment.id}`}>
                      عرض التفاصيل
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
