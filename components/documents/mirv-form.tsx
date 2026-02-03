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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Trash2, Save, Send, ArrowRight, ArrowUpFromLine } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface MIRVFormProps {
  projects: Array<{ id: string; name: string; code: string }>
  warehouses: Array<{ id: string; name: string; code: string }>
  inventoryItems: Array<{ id: string; name: string; code: string; quantity: number; unit: string; unit_price: number }>
  initialData?: any
}

interface LineItem {
  id: string
  item_id: string
  item_code: string
  description: string
  unit: string
  requested_qty: number
  available_qty: number
  unit_price: number
  total: number
}

export function MIRVForm({ projects, warehouses, inventoryItems, initialData }: MIRVFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    project_id: initialData?.project_id || "",
    warehouse_id: initialData?.warehouse_id || "",
    request_date: initialData?.request_date || new Date().toISOString().split("T")[0],
    notes: initialData?.notes || "",
  })

  const [lineItems, setLineItems] = useState<LineItem[]>(
    initialData?.items || [
      { id: crypto.randomUUID(), item_id: "", item_code: "", description: "", unit: "pcs", requested_qty: 1, available_qty: 0, unit_price: 0, total: 0 },
    ]
  )

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: crypto.randomUUID(), item_id: "", item_code: "", description: "", unit: "pcs", requested_qty: 1, available_qty: 0, unit_price: 0, total: 0 },
    ])
  }

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id))
    }
  }

  const selectInventoryItem = (lineId: string, itemId: string) => {
    const inventoryItem = inventoryItems.find(i => i.id === itemId)
    if (inventoryItem) {
      setLineItems(
        lineItems.map((item) => {
          if (item.id === lineId) {
            return {
              ...item,
              item_id: itemId,
              item_code: inventoryItem.code,
              description: inventoryItem.name,
              unit: inventoryItem.unit,
              available_qty: inventoryItem.quantity,
              unit_price: inventoryItem.unit_price || 0,
              total: item.requested_qty * (inventoryItem.unit_price || 0),
            }
          }
          return item
        })
      )
    }
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === "requested_qty") {
            updated.total = (value as number) * item.unit_price
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
    return `MIRV-${year}${month}-${random}`
  }

  const handleSubmit = async (status: "Draft" | "Pending Approval") => {
    startTransition(async () => {
      const formNumber = generateFormNumber()
      const projectName = projects.find(p => p.id === formData.project_id)?.name || ""

      const { data, error } = await supabase
        .from("mirv")
        .insert({
          form_number: formNumber,
          project_id: formData.project_id || null,
          project_name: projectName,
          warehouse_id: formData.warehouse_id || null,
          request_date: formData.request_date,
          estimated_value: totalValue,
          notes: formData.notes,
          status,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating MIRV:", error)
        return
      }

      router.push("/dashboard/documents/mirv")
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpFromLine className="w-5 h-5" />
            معلومات طلب الصرف
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>المشروع *</Label>
            <Select
              value={formData.project_id}
              onValueChange={(value) => setFormData({ ...formData, project_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر المشروع" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.code} - {project.name}
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
            <Label>تاريخ الطلب *</Label>
            <Input
              type="date"
              value={formData.request_date}
              onChange={(e) => setFormData({ ...formData, request_date: e.target.value })}
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
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>المواد المطلوبة</CardTitle>
          <Button onClick={addLineItem} variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            إضافة صنف
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right w-[200px]">الصنف</TableHead>
                <TableHead className="text-right">الوصف</TableHead>
                <TableHead className="text-right w-[80px]">الوحدة</TableHead>
                <TableHead className="text-right w-[100px]">المتوفر</TableHead>
                <TableHead className="text-right w-[100px]">المطلوب</TableHead>
                <TableHead className="text-right w-[120px]">الإجمالي</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lineItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Select
                      value={item.item_id}
                      onValueChange={(value) => selectInventoryItem(item.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الصنف" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventoryItems.map((invItem) => (
                          <SelectItem key={invItem.id} value={invItem.id}>
                            {invItem.code} - {invItem.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.description || "-"}
                  </TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.available_qty}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      max={item.available_qty}
                      value={item.requested_qty}
                      onChange={(e) => updateLineItem(item.id, "requested_qty", parseInt(e.target.value) || 0)}
                      className={item.requested_qty > item.available_qty ? "border-destructive" : ""}
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
              <p className="text-sm text-muted-foreground">القيمة التقديرية</p>
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
            disabled={isPending || !formData.project_id || !formData.warehouse_id}
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
