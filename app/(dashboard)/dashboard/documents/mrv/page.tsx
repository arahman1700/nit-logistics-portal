import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { Plus, Search, FileText, Eye, Edit, Download, RotateCcw } from "lucide-react"
import Link from "next/link"

const statusColors: Record<string, string> = {
  "Pending": "bg-warning/20 text-warning",
  "Approved": "bg-success/20 text-success",
  "Completed": "bg-primary/20 text-primary",
}

const returnTypeLabels: Record<string, string> = {
  "Surplus": "فائض",
  "Damaged": "تالف",
  "Wrong Item": "صنف خاطئ",
  "Project_Complete": "انتهاء المشروع",
}

export default async function MRVListPage() {
  const supabase = await createClient()

  const { data: mrv } = await supabase
    .from("mrv")
    .select(`
      *,
      project:projects(*),
      warehouse:warehouses(*)
    `)
    .order("created_at", { ascending: false })

  const { count: totalCount } = await supabase
    .from("mrv")
    .select("*", { count: "exact", head: true })

  const { count: pendingCount } = await supabase
    .from("mrv")
    .select("*", { count: "exact", head: true })
    .eq("status", "Pending")

  const { count: completedCount } = await supabase
    .from("mrv")
    .select("*", { count: "exact", head: true })
    .eq("status", "Completed")

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            MRV - سندات إرجاع المواد
          </h1>
          <p className="text-muted-foreground">
            Material Return Voucher - إدارة سندات إرجاع المواد إلى المستودعات
          </p>
        </div>
        <Link href="/dashboard/documents/mrv/new">
          <Button className="gap-2 gradient-primary text-primary-foreground">
            <Plus className="w-4 h-4" />
            سند إرجاع جديد
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي السندات</p>
                <p className="text-2xl font-bold">{totalCount || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">بانتظار المعالجة</p>
                <p className="text-2xl font-bold text-warning">{pendingCount || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">تم الإرجاع</p>
                <p className="text-2xl font-bold text-success">{completedCount || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="بحث برقم السند أو المشروع..." className="pr-10" />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">بانتظار</SelectItem>
                <SelectItem value="approved">موافق عليه</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="نوع الإرجاع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="surplus">فائض</SelectItem>
                <SelectItem value="damaged">تالف</SelectItem>
                <SelectItem value="wrong">صنف خاطئ</SelectItem>
                <SelectItem value="complete">انتهاء مشروع</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة سندات الإرجاع</CardTitle>
          <CardDescription>
            عرض وإدارة جميع سندات إرجاع المواد
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">رقم السند</TableHead>
                <TableHead className="text-right">نوع الإرجاع</TableHead>
                <TableHead className="text-right">المشروع</TableHead>
                <TableHead className="text-right">المستودع</TableHead>
                <TableHead className="text-right">تاريخ الإرجاع</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mrv && mrv.length > 0 ? (
                mrv.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.form_number}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {returnTypeLabels[item.return_type] || item.return_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.project?.name || "-"}</TableCell>
                    <TableCell>{item.warehouse?.name || "-"}</TableCell>
                    <TableCell>
                      {item.return_date
                        ? new Date(item.return_date).toLocaleDateString("ar-SA")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[item.status] || "bg-muted"}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/dashboard/documents/mrv/${item.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/documents/mrv/${item.id}/edit`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <RotateCcw className="w-10 h-10 text-muted-foreground" />
                      <p className="text-muted-foreground">لا توجد سندات إرجاع</p>
                      <Link href="/dashboard/documents/mrv/new">
                        <Button variant="outline" size="sm" className="mt-2">
                          إنشاء سند جديد
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
