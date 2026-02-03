"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { JobOrder } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

interface JobOrdersTableProps {
  jobOrders: JobOrder[]
  totalCount: number
  currentPage: number
  pageSize: number
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

const priorityLabels: Record<string, string> = {
  low: "منخفض",
  medium: "متوسط",
  high: "عالي",
  urgent: "عاجل",
}

export function JobOrdersTable({
  jobOrders,
  totalCount,
  currentPage,
  pageSize,
}: JobOrdersTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")

  const totalPages = Math.ceil(totalCount / pageSize)

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set("page", "1")
    router.push(`/dashboard/job-orders?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters("search", search)
  }

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/dashboard/job-orders?${params.toString()}`)
  }

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="بحث برقم الطلب..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10"
              />
            </div>
          </form>

          <div className="flex gap-2">
            <Select
              value={searchParams.get("status") || "all"}
              onValueChange={(value) => updateFilters("status", value)}
            >
              <SelectTrigger className="w-[150px]">
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="approved">معتمد</SelectItem>
                <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="cancelled">ملغى</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={searchParams.get("type") || "all"}
              onValueChange={(value) => updateFilters("type", value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="material_request">طلب مواد</SelectItem>
                <SelectItem value="transfer">نقل</SelectItem>
                <SelectItem value="return">إرجاع</SelectItem>
                <SelectItem value="inspection">فحص</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-right">رقم الطلب</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">المشروع</TableHead>
                <TableHead className="text-right">الأولوية</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <p className="text-muted-foreground">لا توجد طلبات عمل</p>
                  </TableCell>
                </TableRow>
              ) : (
                jobOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      {order.order_number}
                    </TableCell>
                    <TableCell>{typeLabels[order.type]}</TableCell>
                    <TableCell>{order.project?.name || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          order.priority === "urgent"
                            ? "border-red-500 text-red-500"
                            : order.priority === "high"
                            ? "border-orange-500 text-orange-500"
                            : ""
                        }
                      >
                        {priorityLabels[order.priority]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.created_at), "dd MMM yyyy", {
                        locale: ar,
                      })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/job-orders/${order.id}`}
                              className="flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              عرض
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/job-orders/${order.id}/edit`}
                              className="flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              تعديل
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              عرض {(currentPage - 1) * pageSize + 1} -{" "}
              {Math.min(currentPage * pageSize, totalCount)} من {totalCount}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <span className="text-sm">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
