"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, ClipboardList } from "lucide-react"

export function JobOrdersHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="w-7 h-7 text-primary" />
          طلبات العمل
        </h1>
        <p className="text-muted-foreground">
          إدارة وتتبع جميع طلبات العمل في النظام
        </p>
      </div>
      <Button asChild className="gradient-primary gap-2">
        <Link href="/dashboard/job-orders/new">
          <Plus className="w-4 h-4" />
          طلب عمل جديد
        </Link>
      </Button>
    </div>
  )
}
