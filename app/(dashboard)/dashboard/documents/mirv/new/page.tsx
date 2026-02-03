import { createClient } from "@/lib/supabase/server"
import { MIRVForm } from "@/components/documents/mirv-form"

export default async function NewMIRVPage() {
  const supabase = await createClient()

  const [
    { data: projects },
    { data: warehouses },
    { data: inventoryItems },
  ] = await Promise.all([
    supabase.from("projects").select("*").eq("status", "Active").order("name"),
    supabase.from("warehouses").select("*").eq("status", "Active").order("name"),
    supabase.from("inventory_items").select("*").gt("quantity", 0).order("name"),
  ])

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          إنشاء طلب صرف جديد
        </h1>
        <p className="text-muted-foreground">
          إنشاء طلب صرف مواد جديد MIRV
        </p>
      </div>

      <MIRVForm 
        projects={projects || []} 
        warehouses={warehouses || []}
        inventoryItems={inventoryItems || []}
      />
    </div>
  )
}
