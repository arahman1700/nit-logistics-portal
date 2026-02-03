import { createClient } from "@/lib/supabase/server"
import { MRRVForm } from "@/components/documents/mrrv-form"

export default async function NewMRRVPage() {
  const supabase = await createClient()

  const [
    { data: suppliers },
    { data: warehouses },
  ] = await Promise.all([
    supabase.from("suppliers").select("*").eq("status", "Active").order("name"),
    supabase.from("warehouses").select("*").eq("status", "Active").order("name"),
  ])

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          إنشاء سند استلام جديد
        </h1>
        <p className="text-muted-foreground">
          إنشاء سند استلام مواد جديد MRRV
        </p>
      </div>

      <MRRVForm 
        suppliers={suppliers || []} 
        warehouses={warehouses || []} 
      />
    </div>
  )
}
