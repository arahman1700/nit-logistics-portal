import { SupplierForm } from "@/components/suppliers/supplier-form"

export default function NewSupplierPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          إضافة مورد جديد
        </h1>
        <p className="text-muted-foreground">
          إضافة مورد جديد إلى قائمة الموردين
        </p>
      </div>

      <SupplierForm />
    </div>
  )
}
