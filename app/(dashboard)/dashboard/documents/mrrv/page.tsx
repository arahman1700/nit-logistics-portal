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
import { Plus, Search, FileText, Eye, Edit, Download } from "lucide-react"
import Link from "next/link"

const statusColors: Record<string, string> = {
  "Draft": "bg-muted text-muted-foreground",
  "Pending Approval": "bg-warning/20 text-warning",
  "Approved": "bg-success/20 text-success",
  "Rejected": "bg-destructive/20 text-destructive",
  "Inspected": "bg-primary/20 text-primary",
  "Pending QC": "bg-accent/20 text-accent-foreground",
}

export default async function MRRVListPage() {
  const supabase = await createClient()

  const { data: mrrv, error } = await supabase
    .from("mrrv")
    .select(`
      *,
      supplier:suppliers(*),
      warehouse:warehouses(*),
      receiver:profiles!mrrv_received_by_fkey(*)
    `)
    .order("created_at", { ascending: false })

  const { count: totalCount } = await supabase
    .from("mrrv")
    .select("*", { count: "exact", head: true })

  const { count: pendingCount } = await supabase
    .from("mrrv")
    .select("*", { count: "exact", head: true })
    .eq("status", "Pending Approval")

  const { count: approvedCount } = await supabase
    .from("mrrv")
    .select("*", { count: "exact", head: true })
    .eq("status", "Approved")

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            MRRV - سندات استلام المواد
          </h1>
          <p className="text-muted-foreground">
            Material Receipt Report Voucher - إدارة سندات استلام المواد من الموردين
          </p>
        </div>
        <Link href="/dashboard/documents/mrrv/new">
          <Button className="gap-2 gradient-primary text-primary-foreground">
            <Plus className="w-4 h-4" />
            سند استلام جديد
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي السندات</p>
                <p className="text-2xl font-bold">{totalCount || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">بانتظار الموافقة</p>
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
                <p className="text-sm text-muted-foreground">تمت الموافقة</p>
                <p className="text-2xl font-bold text-success">{approvedCount || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">تحتاج فحص</p>
                <p className="text-2xl font-bold text-accent">{(mrrv?.filter(m => m.rfim_required && !m.rfim_created)?.length) || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-accent" />
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
                <Input placeholder="بحث برقم السند أو المورد..." className="pr-10" />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="draft">مسودة</SelectItem>
                <SelectItem value="pending">بانتظار الموافقة</SelectItem>
                <SelectItem value="approved">تمت الموافقة</SelectItem>
                <SelectItem value="rejected">مرفوض</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="المستودع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المستودعات</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة سندات الاستلام</CardTitle>
          <CardDescription>
            عرض وإدارة جميع سندات استلام المواد
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">رقم السند</TableHead>
                <TableHead className="text-right">المورد</TableHead>
                <TableHead className="text-right">المستودع</TableHead>
                <TableHead className="text-right">تاريخ الاستلام</TableHead>
                <TableHead className="text-right">القيمة</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">RFIM</TableHead>
                <TableHead className="text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mrrv && mrrv.length > 0 ? (
                mrrv.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.form_number}</TableCell>
                    <TableCell>{item.supplier_name || item.supplier?.name || "-"}</TableCell>
                    <TableCell>{item.warehouse?.name || "-"}</TableCell>
                    <TableCell>
                      {item.receipt_date
                        ? new Date(item.receipt_date).toLocaleDateString("ar-SA")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {item.total_value
                        ? `${item.total_value.toLocaleString()} ريال`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[item.status] || "bg-muted"}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.rfim_required ? (
                        item.rfim_created ? (
                          <Badge className="bg-success/20 text-success">تم الإنشاء</Badge>
                        ) : (
                          <Badge className="bg-warning/20 text-warning">مطلوب</Badge>
                        )
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/dashboard/documents/mrrv/${item.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/documents/mrrv/${item.id}/edit`}>
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
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-10 h-10 text-muted-foreground" />
                      <p className="text-muted-foreground">لا توجد سندات استلام</p>
                      <Link href="/dashboard/documents/mrrv/new">
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
