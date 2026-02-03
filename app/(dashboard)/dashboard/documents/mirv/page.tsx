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
import { Plus, Search, FileText, Eye, Edit, Download, ArrowUpFromLine } from "lucide-react"
import Link from "next/link"

const statusColors: Record<string, string> = {
  "Draft": "bg-muted text-muted-foreground",
  "Pending Approval": "bg-warning/20 text-warning",
  "Approved": "bg-success/20 text-success",
  "Rejected": "bg-destructive/20 text-destructive",
  "Issued": "bg-primary/20 text-primary",
}

export default async function MIRVListPage() {
  const supabase = await createClient()

  const { data: mirv } = await supabase
    .from("mirv")
    .select(`
      *,
      project:projects(*),
      warehouse:warehouses(*),
      requester:profiles!mirv_requester_id_fkey(*)
    `)
    .order("created_at", { ascending: false })

  const { count: totalCount } = await supabase
    .from("mirv")
    .select("*", { count: "exact", head: true })

  const { count: pendingCount } = await supabase
    .from("mirv")
    .select("*", { count: "exact", head: true })
    .eq("status", "Pending Approval")

  const { count: issuedCount } = await supabase
    .from("mirv")
    .select("*", { count: "exact", head: true })
    .eq("status", "Issued")

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            MIRV - طلبات صرف المواد
          </h1>
          <p className="text-muted-foreground">
            Material Issue Request Voucher - إدارة طلبات صرف المواد للمشاريع
          </p>
        </div>
        <Link href="/dashboard/documents/mirv/new">
          <Button className="gap-2 gradient-primary text-primary-foreground">
            <Plus className="w-4 h-4" />
            طلب صرف جديد
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
                <p className="text-2xl font-bold">{totalCount || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ArrowUpFromLine className="w-5 h-5 text-primary" />
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
                <p className="text-sm text-muted-foreground">تم الصرف</p>
                <p className="text-2xl font-bold text-success">{issuedCount || 0}</p>
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
                <p className="text-sm text-muted-foreground">بدون تصريح خروج</p>
                <p className="text-2xl font-bold text-accent">
                  {mirv?.filter(m => m.status === "Approved" && !m.gate_pass_created)?.length || 0}
                </p>
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
                <Input placeholder="بحث برقم الطلب أو المشروع..." className="pr-10" />
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
                <SelectItem value="issued">تم الصرف</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="المشروع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المشاريع</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة طلبات الصرف</CardTitle>
          <CardDescription>
            عرض وإدارة جميع طلبات صرف المواد
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">رقم الطلب</TableHead>
                <TableHead className="text-right">المشروع</TableHead>
                <TableHead className="text-right">مقدم الطلب</TableHead>
                <TableHead className="text-right">المستودع</TableHead>
                <TableHead className="text-right">تاريخ الطلب</TableHead>
                <TableHead className="text-right">القيمة التقديرية</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mirv && mirv.length > 0 ? (
                mirv.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.form_number}</TableCell>
                    <TableCell>{item.project_name || item.project?.name || "-"}</TableCell>
                    <TableCell>{item.requester_name || item.requester?.full_name || "-"}</TableCell>
                    <TableCell>{item.warehouse?.name || "-"}</TableCell>
                    <TableCell>
                      {item.request_date
                        ? new Date(item.request_date).toLocaleDateString("ar-SA")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {item.estimated_value
                        ? `${item.estimated_value.toLocaleString()} ريال`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[item.status] || "bg-muted"}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/dashboard/documents/mirv/${item.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/documents/mirv/${item.id}/edit`}>
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
                      <ArrowUpFromLine className="w-10 h-10 text-muted-foreground" />
                      <p className="text-muted-foreground">لا توجد طلبات صرف</p>
                      <Link href="/dashboard/documents/mirv/new">
                        <Button variant="outline" size="sm" className="mt-2">
                          إنشاء طلب جديد
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
