"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Plus,
  FileText,
  Package,
  Truck,
  ClipboardList,
  Download,
} from "lucide-react"

const actions = [
  {
    title: "طلب عمل جديد",
    href: "/dashboard/job-orders/new",
    icon: ClipboardList,
    color: "gradient-primary text-primary-foreground",
  },
  {
    title: "استلام مواد MRRV",
    href: "/dashboard/documents/mrrv/new",
    icon: Package,
    color: "bg-emerald-500 text-white hover:bg-emerald-600",
  },
  {
    title: "صرف مواد MIRV",
    href: "/dashboard/documents/mirv/new",
    icon: FileText,
    color: "bg-amber-500 text-white hover:bg-amber-600",
  },
  {
    title: "شحنة جديدة",
    href: "/dashboard/shipments/new",
    icon: Truck,
    color: "bg-purple-500 text-white hover:bg-purple-600",
  },
  {
    title: "تقرير PDF",
    href: "/dashboard/reports",
    icon: Download,
    color: "bg-slate-700 text-white hover:bg-slate-800",
  },
]

export function QuickActions() {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          إجراءات سريعة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {actions.map((action) => (
            <Button
              key={action.href}
              asChild
              className={`gap-2 ${action.color}`}
            >
              <Link href={action.href}>
                <action.icon className="w-4 h-4" />
                {action.title}
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
