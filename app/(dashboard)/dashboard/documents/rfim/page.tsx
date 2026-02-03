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
import { Plus, Search, FileText, Eye, Edit, Download, ClipboardCheck } from "lucide-react"
import Link from "next/link"

const statusColors: Record<string, string> = {
  "Pending": "bg-warning/20 text-warning",
  "Pass": "bg-success/20 text-success",
  "Fail": "bg-destructive/20 text-destructive",
  "Conditional": "bg-accent/20 text-accent-foreground",
}

const priorityColors: Record<string, string> = {
  "Normal": "bg-muted text-muted-foreground",
  "Urgent": "bg-warning/20 text-warning",
  "Critical": "bg-destructive/20 text-destructive",
}

const inspectionTypeLabels: Record<string, string> = {
  "Visual": "فحص بصري",
  "Dimensional": "فحص أبعاد",
  "Functional": "فحص وظيفي",
  "Documentation": "فحص مستندي",
}

export default async function RFIMListPage() {
  const supabase = await createClient()

  const { data: rfim } = await supabase
    .from("rfim")
    .select(`
      *,
      mrrv:mrrv(*),
      inspector:profiles!rfim_inspector_id_fkey(*)
    `)
    .order("created_at", { ascending: false })

  const { count: totalCount } = await supabase
    .from("rfim")
    .select("*", { count: "exact", head: true })

  const { count: pendingCount } = await supabase
    .from("rfim")
    .select("*", { count: "exact", head: true })
    .eq("status", "Pending")

  const { count: passCount } = await supabase
    .from("rfim")
    .select("*", { count: "exact", head: true })
    .eq("status", "Pass")

  const { count: failCount } = await supabase
    .from("rfim")
    .select("*", { count: "exact", head: true })
    .eq("status", "Fail")

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            RFIM - طلبات فحص المواد
          </h1>
          <p className="text-muted-foreground">
            Request for Inspection of Material - إدارة طلبات فحص جودة المواد
          </p>
        </div>
        <Link href="/dashboard/documents/rfim/new">
          <Button className="gap-2 gradient-primary text-primary-foreground">
            <Plus className="w-4 h-4" />
            طلب فحص جديد
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
                <ClipboardCheck className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">بانتظار الفحص</p>
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
                <p className="text-sm text-muted-foreground">اجتاز الفحص</p>
                <p className="text-2xl font-bold text-success">{passCount || 0}</p>
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
                <p className="text-sm text-muted-foreground">فشل الفحص</p>
                <p className="text-2xl font-bold text-destructive">{failCount || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-destructive" />
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
                <Input placeholder="بحث برقم الطلب أو MRRV..." className="pr-10" />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">بانتظار</SelectItem>
                <SelectItem value="pass">اجتاز</SelectItem>
                <SelectItem value="fail">فشل</SelectItem>
                <SelectItem value="conditional">مشروط</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="نوع الفحص" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="visual">فحص بصري</SelectItem>
                <SelectItem value="dimensional">فحص أبعاد</SelectItem>
                <SelectItem value="functional">فحص وظيفي</SelectItem>
                <SelectItem value="documentation">فحص مستندي</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة طلبات الفحص</CardTitle>
          <CardDescription>
            عرض وإدارة جميع طلبات فحص المواد
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">رقم الطلب</TableHead>
                <TableHead className="text-right">رقم MRRV</TableHead>
                <TableHead className="text-right">نوع الفحص</TableHead>
                <TableHead className="text-right">الأولوية</TableHead>
                <TableHead className="text-right">الفاحص</TableHead>
                <TableHead className="text-right">تاريخ الفحص</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfim && rfim.length > 0 ? (
                rfim.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.form_number}</TableCell>
                    <TableCell>{item.mrrv?.form_number || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {inspectionTypeLabels[item.inspection_type] || item.inspection_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityColors[item.priority] || "bg-muted"}>
                        {item.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.inspector_name || item.inspector?.full_name || "-"}</TableCell>
                    <TableCell>
                      {item.inspection_date
                        ? new Date(item.inspection_date).toLocaleDateString("ar-SA")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[item.status] || "bg-muted"}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/dashboard/documents/rfim/${item.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/documents/rfim/${item.id}/edit`}>
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
                      <ClipboardCheck className="w-10 h-10 text-muted-foreground" />
                      <p className="text-muted-foreground">لا توجد طلبات فحص</p>
                      <Link href="/dashboard/documents/rfim/new">
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
