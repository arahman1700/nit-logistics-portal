"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { InventoryItem, Warehouse } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  AlertTriangle,
} from "lucide-react"

interface InventoryTableProps {
  items: InventoryItem[]
  warehouses: Pick<Warehouse, "id" | "name">[]
  totalCount: number
  currentPage: number
  pageSize: number
}

export function InventoryTable({
  items,
  warehouses,
  totalCount,
  currentPage,
  pageSize,
}: InventoryTableProps) {
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
    router.push(`/dashboard/inventory?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters("search", search)
  }

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/dashboard/inventory?${params.toString()}`)
  }

  const getStockStatus = (item: InventoryItem) => {
    const percentage = (item.quantity / item.min_quantity) * 100
    if (percentage < 30) return { label: "حرج", color: "destructive" }
    if (percentage < 70) return { label: "منخفض", color: "warning" }
    return { label: "جيد", color: "success" }
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
                placeholder="بحث بالاسم أو SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10"
              />
            </div>
          </form>

          <div className="flex gap-2">
            <Select
              value={searchParams.get("warehouse") || "all"}
              onValueChange={(value) => updateFilters("warehouse", value)}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder="المستودع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المستودعات</SelectItem>
                {warehouses.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={searchParams.get("filter") || "all"}
              onValueChange={(value) => updateFilters("filter", value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="الفلتر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="low_stock">مخزون منخفض</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-right">الصنف</TableHead>
                <TableHead className="text-right">SKU</TableHead>
                <TableHead className="text-right">المستودع</TableHead>
                <TableHead className="text-right">الكمية</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">السعر</TableHead>
                <TableHead className="text-right w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <p className="text-muted-foreground">لا توجد أصناف</p>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => {
                  const status = getStockStatus(item)
                  const percentage = Math.min(
                    (item.quantity / item.min_quantity) * 100,
                    100
                  )

                  return (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.category || "غير مصنف"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {item.sku}
                      </TableCell>
                      <TableCell>{item.warehouse?.name || "-"}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span>
                              {item.quantity} / {item.min_quantity}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {item.unit}
                            </span>
                          </div>
                          <Progress
                            value={percentage}
                            className={`h-1.5 w-20 ${
                              status.color === "destructive"
                                ? "[&>div]:bg-destructive"
                                : status.color === "warning"
                                ? "[&>div]:bg-amber-500"
                                : "[&>div]:bg-green-500"
                            }`}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            status.color === "success" ? "default" : "secondary"
                          }
                          className={
                            status.color === "destructive"
                              ? "bg-red-100 text-red-800"
                              : status.color === "warning"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {status.color !== "success" && (
                            <AlertTriangle className="w-3 h-3 ml-1" />
                          )}
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.unit_price.toLocaleString("ar-SA")} ر.س
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
                                href={`/dashboard/inventory/${item.id}`}
                                className="flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                عرض
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/inventory/${item.id}/edit`}
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
                  )
                })
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
