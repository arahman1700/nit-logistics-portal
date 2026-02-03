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
import { Plus, Search, Eye, Edit, Trash2, Building2, Phone, Mail, MapPin } from "lucide-react"
import Link from "next/link"

const statusColors: Record<string, string> = {
  "Active": "bg-success/20 text-success",
  "Inactive": "bg-muted text-muted-foreground",
  "Blacklisted": "bg-destructive/20 text-destructive",
}

const typeColors: Record<string, string> = {
  "LOCAL SUPPLIER": "bg-primary/20 text-primary",
  "INTERNATIONAL": "bg-accent/20 text-accent-foreground",
  "MANUFACTURER": "bg-warning/20 text-warning",
}

export default async function SuppliersPage() {
  const supabase = await createClient()

  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("*")
    .order("name")

  const { count: totalCount } = await supabase
    .from("suppliers")
    .select("*", { count: "exact", head: true })

  const { count: activeCount } = await supabase
    .from("suppliers")
    .select("*", { count: "exact", head: true })
    .eq("status", "Active")

  const { count: localCount } = await supabase
    .from("suppliers")
    .select("*", { count: "exact", head: true })
    .eq("type", "LOCAL SUPPLIER")

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">الموردين</h1>
          <p className="text-muted-foreground">
            إدارة الموردين والتواصل معهم
          </p>
        </div>
        <Link href="/dashboard/suppliers/new">
          <Button className="gap-2 gradient-primary text-primary-foreground">
            <Plus className="w-4 h-4" />
            إضافة مورد جديد
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الموردين</p>
                <p className="text-2xl font-bold">{totalCount || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">موردين نشطين</p>
                <p className="text-2xl font-bold text-success">{activeCount || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">موردين محليين</p>
                <p className="text-2xl font-bold text-primary">{localCount || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">موردين دوليين</p>
                <p className="text-2xl font-bold text-accent">
                  {suppliers?.filter(s => s.type === "INTERNATIONAL")?.length || 0}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-accent" />
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
                <Input placeholder="بحث باسم المورد أو الكود..." className="pr-10" />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
                <SelectItem value="blacklisted">محظور</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="local">مورد محلي</SelectItem>
                <SelectItem value="international">دولي</SelectItem>
                <SelectItem value="manufacturer">مصنع</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الموردين</CardTitle>
          <CardDescription>
            عرض وإدارة جميع الموردين المسجلين في النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الكود</TableHead>
                <TableHead className="text-right">اسم المورد</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">المدينة</TableHead>
                <TableHead className="text-right">جهة الاتصال</TableHead>
                <TableHead className="text-right">الهاتف</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers && suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.code}</TableCell>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>
                      <Badge className={typeColors[supplier.type] || "bg-muted"}>
                        {supplier.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{supplier.city || "-"}</TableCell>
                    <TableCell>{supplier.contact_name || "-"}</TableCell>
                    <TableCell dir="ltr" className="text-right">
                      {supplier.contact_phone || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[supplier.status] || "bg-muted"}>
                        {supplier.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/dashboard/suppliers/${supplier.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/suppliers/${supplier.id}/edit`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        {supplier.contact_phone && (
                          <a href={`tel:${supplier.contact_phone}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Phone className="w-4 h-4" />
                            </Button>
                          </a>
                        )}
                        {supplier.contact_email && (
                          <a href={`mailto:${supplier.contact_email}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Mail className="w-4 h-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Building2 className="w-10 h-10 text-muted-foreground" />
                      <p className="text-muted-foreground">لا يوجد موردين مسجلين</p>
                      <Link href="/dashboard/suppliers/new">
                        <Button variant="outline" size="sm" className="mt-2">
                          إضافة مورد جديد
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
