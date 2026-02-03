"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Package, Download } from "lucide-react"

export function InventoryHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Package className="w-7 h-7 text-primary" />
          المخزون
        </h1>
        <p className="text-muted-foreground">
          إدارة جميع المواد والأصناف في المستودعات
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          تصدير
        </Button>
        <Button asChild className="gradient-primary gap-2">
          <Link href="/dashboard/inventory/new">
            <Plus className="w-4 h-4" />
            إضافة صنف
          </Link>
        </Button>
      </div>
    </div>
  )
}
