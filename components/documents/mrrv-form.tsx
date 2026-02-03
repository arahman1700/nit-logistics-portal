"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Trash2, Save, Send, ArrowRight, Package } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface MRRVFormProps {
  suppliers: Array<{ id: string; name: string; code: string }>
  warehouses: Array<{ id: string; name: string; code: string }>
  initialData?: any
}

interface LineItem {
  id: string
  item_code: string
  description: string
  unit: string
  quantity: number
  unit_price: number
  total: number
}

export function MRRVForm({ suppliers, warehouses, initialData }: MRRVFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    supplier_id: initialData?.supplier_id || "",
    warehouse_id: initialData?.warehouse_id || "",
    po_number: initialData?.po_number || "",
    delivery_note: initialData?.delivery_note || "",
    receipt_date: initialData?.receipt_date || new Date().toISOString().split("T")[0],
    rfim_required: initialData?.rfim_required || false,
    notes: initialData?.notes || "",
  })

  const [lineItems, setLineItems] = useState<LineItem[]>(
    initialData?.items || [
      { id: crypto.randomUUID(), item_code: "", description: "", unit: "pcs", quantity: 1, unit_price: 0, total: 0 },
    ]
  )

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: crypto.randomUUID(), item_code: "", description: "", unit: "pcs", quantity: 1, unit_price: 0, total: 0 },
    ])
  }

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id))
    }
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === "quantity" || field === "unit_price") {
            updated.total = updated.quantity * updated.unit_price
          }
          return updated
        }
        return item
      })
    )
  }

  const totalValue = lineItems.reduce((sum, item) => sum + item.total, 0)

  const generateFormNumber = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
    return `MRRV-${year}${month}-${random}`
  }

  const handleSubmit = async (status: "Draft" | "Pending Approval") => {
    startTransition(async () => {
      const formNumber = generateFormNumber()
      const supplierName = suppliers.find(s => s.id === formData.supplier_id)?.name || ""

      const { data, error } = await supabase
        .from("mrrv")
        .insert({
          form_number: formNumber,
          supplier_id: formData.supplier_id || null,
          supplier_name: supplierName,
          warehouse_id: formData.warehouse_id || null,
          po_number: formData.po_number,
          delivery_note: formData.delivery_note,
          receipt_date: formData.receipt_date,
          total_value: totalValue,
          rfim_required: formData.rfim_required,
          notes: formData.notes,
          status,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating MRRV:", error)
        return
      }

      router.push("/dashboard/documents/mrrv")
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            معلومات الاستلام
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>المورد *</Label>
            <Select
              value={formData.supplier_id}
              onValueChange={(value) => setFormData({ ...formData, supplier_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر المورد" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.code} - {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>المستودع *</Label>
            <Select
              value={formData.warehouse_id}
              onValueChange={(value) => setFormData({ ...formData, warehouse_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر المستودع" />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.code} - {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>رقم أمر الشراء (PO)</Label>
            <Input
              value={formData.po_number}
              onChange={(e) => setFormData({ ...formData, po_number: e.target.value })}
              placeholder="PO-2024-001"
            />
          </div>

          <div className="space-y-2">
            <Label>رقم إشعار التسليم</Label>
            <Input
              value={formData.delivery_note}
              onChange={(e) => setFormData({ ...formData, delivery_note: e.target.value })}
              placeholder="DN-001"
            />
          </div>

          <div className="space-y-2">
            <Label>تاريخ الاستلام *</Label>
            <Input
              type="date"
              value={formData.receipt_date}
              onChange={(e) => setFormData({ ...formData, receipt_date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>ملاحظات</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="أي ملاحظات إضافية..."
              rows={3}
            />
          </div>

          <div className="flex items-center gap-3 md:col-span-2">
            <Switch
              checked={formData.rfim_required}
              onCheckedChange={(checked) => setFormData({ ...formData, rfim_required: checked })}
            />
            <Label>يتطلب فحص المواد (RFIM)</Label>
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>المواد المستلمة</CardTitle>
          <Button onClick={addLineItem} variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            إضافة صنف
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right w-[120px]">كود الصنف</TableHead>
                <TableHead className="text-right">الوصف</TableHead>
                <TableHead className="text-right w-[100px]">الوحدة</TableHead>
                <TableHead className="text-right w-[100px]">الكمية</TableHead>
                <TableHead className="text-right w-[120px]">سعر الوحدة</TableHead>
                <TableHead className="text-right w-[120px]">الإجمالي</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lineItems.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Input
                      value={item.item_code}
                      onChange={(e) => updateLineItem(item.id, "item_code", e.target.value)}
                      placeholder="ITM-001"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                      placeholder="وصف الصنف"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={item.unit}
                      onValueChange={(value) => updateLineItem(item.id, "unit", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pcs">قطعة</SelectItem>
                        <SelectItem value="kg">كيلو</SelectItem>
                        <SelectItem value="m">متر</SelectItem>
                        <SelectItem value="ltr">لتر</SelectItem>
                        <SelectItem value="box">صندوق</SelectItem>
                        <SelectItem value="set">طقم</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) => updateLineItem(item.id, "unit_price", parseFloat(e.target.value) || 0)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.total.toLocaleString()} ريال
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeLineItem(item.id)}
                      disabled={lineItems.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end mt-4 pt-4 border-t">
            <div className="text-left">
              <p className="text-sm text-muted-foreground">إجمالي القيمة</p>
              <p className="text-2xl font-bold text-primary">{totalValue.toLocaleString()} ريال</p>
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
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => handleSubmit("Draft")}
            disabled={isPending}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            حفظ كمسودة
          </Button>
          <Button
            onClick={() => handleSubmit("Pending Approval")}
            disabled={isPending || !formData.supplier_id || !formData.warehouse_id}
            className="gap-2 gradient-primary text-primary-foreground"
          >
            <Send className="w-4 h-4" />
            إرسال للموافقة
          </Button>
        </div>
      </div>
    </div>
  )
}
