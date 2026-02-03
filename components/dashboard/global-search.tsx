"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import {
  ClipboardList,
  Package,
  Truck,
  FolderKanban,
  FileText,
  Search,
} from "lucide-react"

interface SearchResult {
  id: string
  title: string
  subtitle: string
  type: "job_order" | "inventory" | "shipment" | "project" | "document"
  href: string
}

const typeIcons = {
  job_order: ClipboardList,
  inventory: Package,
  shipment: Truck,
  project: FolderKanban,
  document: FileText,
}

const typeLabels = {
  job_order: "طلب عمل",
  inventory: "مخزون",
  shipment: "شحنة",
  project: "مشروع",
  document: "مستند",
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const search = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      setIsLoading(true)

      try {
        const [jobOrders, inventory, shipments, projects] = await Promise.all([
          supabase
            .from("job_orders")
            .select("id, order_number, type, status")
            .ilike("order_number", `%${searchQuery}%`)
            .limit(5),
          supabase
            .from("inventory_items")
            .select("id, name, sku")
            .or(`name.ilike.%${searchQuery}%,sku.ilike.%${searchQuery}%`)
            .limit(5),
          supabase
            .from("shipments")
            .select("id, tracking_number, destination")
            .ilike("tracking_number", `%${searchQuery}%`)
            .limit(5),
          supabase
            .from("projects")
            .select("id, name, code")
            .or(`name.ilike.%${searchQuery}%,code.ilike.%${searchQuery}%`)
            .limit(5),
        ])

        const searchResults: SearchResult[] = [
          ...(jobOrders.data?.map((jo) => ({
            id: jo.id,
            title: jo.order_number,
            subtitle: jo.type,
            type: "job_order" as const,
            href: `/dashboard/job-orders/${jo.id}`,
          })) || []),
          ...(inventory.data?.map((item) => ({
            id: item.id,
            title: item.name,
            subtitle: item.sku,
            type: "inventory" as const,
            href: `/dashboard/inventory/${item.id}`,
          })) || []),
          ...(shipments.data?.map((s) => ({
            id: s.id,
            title: s.tracking_number,
            subtitle: s.destination || "",
            type: "shipment" as const,
            href: `/dashboard/shipments/${s.id}`,
          })) || []),
          ...(projects.data?.map((p) => ({
            id: p.id,
            title: p.name,
            subtitle: p.code,
            type: "project" as const,
            href: `/dashboard/projects/${p.id}`,
          })) || []),
        ]

        setResults(searchResults)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [supabase]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      search(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, search])

  const handleSelect = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = []
    }
    acc[result.type].push(result)
    return acc
  }, {} as Record<string, SearchResult[]>)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-muted/50 rounded-lg hover:bg-muted transition-colors w-full max-w-md"
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-right">بحث في النظام...</span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="ابحث عن طلبات العمل، المخزون، الشحنات..."
          value={query}
          onValueChange={setQuery}
          className="text-right"
        />
        <CommandList>
          {isLoading && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              جاري البحث...
            </div>
          )}
          {!isLoading && query && results.length === 0 && (
            <CommandEmpty>لا توجد نتائج لـ &quot;{query}&quot;</CommandEmpty>
          )}
          {!isLoading &&
            Object.entries(groupedResults).map(([type, items], index) => {
              const Icon = typeIcons[type as keyof typeof typeIcons]
              return (
                <div key={type}>
                  {index > 0 && <CommandSeparator />}
                  <CommandGroup heading={typeLabels[type as keyof typeof typeLabels]}>
                    {items.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.title}
                        onSelect={() => handleSelect(item.href)}
                        className="flex items-center gap-3"
                      >
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.subtitle}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {typeLabels[item.type]}
                        </Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </div>
              )
            })}
          {!query && (
            <CommandGroup heading="روابط سريعة">
              <CommandItem onSelect={() => handleSelect("/dashboard/job-orders/new")}>
                <ClipboardList className="w-4 h-4 ml-2" />
                إنشاء طلب عمل جديد
              </CommandItem>
              <CommandItem onSelect={() => handleSelect("/dashboard/inventory")}>
                <Package className="w-4 h-4 ml-2" />
                عرض المخزون
              </CommandItem>
              <CommandItem onSelect={() => handleSelect("/dashboard/shipments")}>
                <Truck className="w-4 h-4 ml-2" />
                عرض الشحنات
              </CommandItem>
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
