import { createClient } from "@/lib/supabase/server"
import { JobOrderForm } from "@/components/job-orders/job-order-form"

export default async function NewJobOrderPage() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, code")
    .eq("status", "active")
    .order("name")

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">إنشاء طلب عمل جديد</h1>
        <p className="text-muted-foreground">
          قم بتعبئة النموذج أدناه لإنشاء طلب عمل جديد
        </p>
      </div>

      <JobOrderForm projects={projects || []} />
    </div>
  )
}
