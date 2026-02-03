"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Save, ArrowRight, Building2, User, Phone, Mail, MapPin } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface SupplierFormProps {
  initialData?: any
}

export function SupplierForm({ initialData }: SupplierFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    code: initialData?.code || "",
    name: initialData?.name || "",
    type: initialData?.type || "LOCAL SUPPLIER",
    city: initialData?.city || "",
    contact_name: initialData?.contact_name || "",
    contact_phone: initialData?.contact_phone || "",
    contact_email: initialData?.contact_email || "",
    status: initialData?.status || "Active",
  })

  const generateCode = () => {
    const prefix = formData.type === "INTERNATIONAL" ? "INT" : formData.type === "MANUFACTURER" ? "MFG" : "SUP"
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0")
    setFormData({ ...formData, code: `${prefix}-${random}` })
  }

  const handleSubmit = async () => {
    startTransition(async () => {
      if (initialData?.id) {
        const { error } = await supabase
          .from("suppliers")
          .update(formData)
          .eq("id", initialData.id)

        if (error) {
          console.error("Error updating supplier:", error)
          return
        }
      } else {
        const { error } = await supabase
          .from("suppliers")
          .insert(formData)

        if (error) {
          console.error("Error creating supplier:", error)
          return
        }
      }

      router.push("/dashboard/suppliers")
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            معلومات المورد الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>كود المورد *</Label>
            <div className="flex gap-2">
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="SUP-0001"
              />
              <Button type="button" variant="outline" onClick={generateCode}>
                توليد
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>اسم المورد *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="اسم الشركة"
            />
          </div>

          <div className="space-y-2">
            <Label>نوع المورد</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOCAL SUPPLIER">مورد محلي</SelectItem>
                <SelectItem value="INTERNATIONAL">دولي</SelectItem>
                <SelectItem value="MANUFACTURER">مصنع</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>المدينة</Label>
            <div className="relative">
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="الرياض"
                className="pr-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>الحالة</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">نشط</SelectItem>
                <SelectItem value="Inactive">غير نشط</SelectItem>
                <SelectItem value="Blacklisted">محظور</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            معلومات الاتصال
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>اسم جهة الاتصال</Label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                placeholder="محمد أحمد"
                className="pr-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>رقم الهاتف</Label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                placeholder="+966 50 000 0000"
                className="pr-10"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>البريد الإلكتروني</Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="email@company.com"
                className="pr-10"
                dir="ltr"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          رجوع
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isPending || !formData.code || !formData.name}
          className="gap-2 gradient-primary text-primary-foreground"
        >
          <Save className="w-4 h-4" />
          {initialData?.id ? "تحديث المورد" : "حفظ المورد"}
        </Button>
      </div>
    </div>
  )
}
