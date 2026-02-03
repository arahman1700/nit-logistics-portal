import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { JobOrdersTable } from "@/components/job-orders/job-orders-table"
import { JobOrdersHeader } from "@/components/job-orders/job-orders-header"
import { Skeleton } from "@/components/ui/skeleton"

interface PageProps {
  searchParams: Promise<{
    status?: string
    type?: string
    search?: string
    page?: string
  }>
}

export default async function JobOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("job_orders")
    .select("*, project:projects(*)", { count: "exact" })
    .order("created_at", { ascending: false })

  if (params.status) {
    query = query.eq("status", params.status)
  }
  if (params.type) {
    query = query.eq("type", params.type)
  }
  if (params.search) {
    query = query.ilike("order_number", `%${params.search}%`)
  }

  const page = parseInt(params.page || "1")
  const pageSize = 10
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  query = query.range(from, to)

  const { data: jobOrders, count } = await query

  return (
    <div className="space-y-6 animate-fade-in">
      <JobOrdersHeader />
      <Suspense fallback={<TableSkeleton />}>
        <JobOrdersTable
          jobOrders={jobOrders || []}
          totalCount={count || 0}
          currentPage={page}
          pageSize={pageSize}
        />
      </Suspense>
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  )
}
