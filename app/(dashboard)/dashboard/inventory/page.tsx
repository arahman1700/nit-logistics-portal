import { createClient } from "@/lib/supabase/server"
import { InventoryHeader } from "@/components/inventory/inventory-header"
import { InventoryTable } from "@/components/inventory/inventory-table"

interface PageProps {
  searchParams: Promise<{
    category?: string
    warehouse?: string
    search?: string
    filter?: string
    page?: string
  }>
}

export default async function InventoryPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("inventory_items")
    .select("*, warehouse:warehouses(*), supplier:suppliers(*)", { count: "exact" })
    .order("name", { ascending: true })

  if (params.category) {
    query = query.eq("category", params.category)
  }
  if (params.warehouse) {
    query = query.eq("warehouse_id", params.warehouse)
  }
  if (params.search) {
    query = query.or(`name.ilike.%${params.search}%,sku.ilike.%${params.search}%`)
  }
  if (params.filter === "low_stock") {
    query = query.lt("quantity", 10)
  }

  const page = parseInt(params.page || "1")
  const pageSize = 10
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  query = query.range(from, to)

  const { data: items, count } = await query

  // Fetch warehouses for filter
  const { data: warehouses } = await supabase
    .from("warehouses")
    .select("id, name")
    .order("name")

  return (
    <div className="space-y-6 animate-fade-in">
      <InventoryHeader />
      <InventoryTable
        items={items || []}
        warehouses={warehouses || []}
        totalCount={count || 0}
        currentPage={page}
        pageSize={pageSize}
      />
    </div>
  )
}
