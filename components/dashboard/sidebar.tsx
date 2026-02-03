"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Profile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Building2,
  LayoutDashboard,
  Package,
  Truck,
  FileText,
  ClipboardList,
  Warehouse,
  Users,
  Settings,
  ChevronRight,
  BarChart3,
  Bell,
  LogOut,
  FolderKanban,
} from "lucide-react"
import { signOut } from "@/lib/actions/auth"

interface SidebarProps {
  profile: Profile | null
}

const mainNavItems = [
  {
    title: "لوحة التحكم",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "طلبات العمل",
    href: "/dashboard/job-orders",
    icon: ClipboardList,
  },
  {
    title: "المخزون",
    href: "/dashboard/inventory",
    icon: Package,
  },
  {
    title: "المستودعات",
    href: "/dashboard/warehouses",
    icon: Warehouse,
  },
  {
    title: "الشحنات",
    href: "/dashboard/shipments",
    icon: Truck,
  },
  {
    title: "المشاريع",
    href: "/dashboard/projects",
    icon: FolderKanban,
  },
]

const documentsNavItems = [
  {
    title: "MRRV - استلام المواد",
    href: "/dashboard/documents/mrrv",
    icon: FileText,
  },
  {
    title: "MIRV - صرف المواد",
    href: "/dashboard/documents/mirv",
    icon: FileText,
  },
  {
    title: "MRV - إرجاع المواد",
    href: "/dashboard/documents/mrv",
    icon: FileText,
  },
  {
    title: "RFIM - طلب الشراء",
    href: "/dashboard/documents/rfim",
    icon: FileText,
  },
]

const adminNavItems = [
  {
    title: "المستخدمين",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "التقارير",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    title: "الإعدادات",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col bg-card border-l border-border transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary flex-shrink-0">
          <Building2 className="w-5 h-5 text-primary-foreground" />
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-foreground truncate">NIT Logistics</h2>
            <p className="text-xs text-muted-foreground truncate">Nesma Industrial</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronRight
            className={cn(
              "w-4 h-4 transition-transform",
              isCollapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-6 px-3">
          {/* Main Navigation */}
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="text-xs font-medium text-muted-foreground px-3 mb-2">
                القائمة الرئيسية
              </p>
            )}
            {mainNavItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    pathname === item.href &&
                      "bg-primary/10 text-primary hover:bg-primary/15"
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Button>
              </Link>
            ))}
          </div>

          {/* Documents */}
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="text-xs font-medium text-muted-foreground px-3 mb-2">
                المستندات
              </p>
            )}
            {documentsNavItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    pathname === item.href &&
                      "bg-primary/10 text-primary hover:bg-primary/15"
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.title}</span>}
                </Button>
              </Link>
            ))}
          </div>

          {/* Admin */}
          {profile?.role === "admin" && (
            <div className="space-y-1">
              {!isCollapsed && (
                <p className="text-xs font-medium text-muted-foreground px-3 mb-2">
                  الإدارة
                </p>
              )}
              {adminNavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      pathname === item.href &&
                        "bg-primary/10 text-primary hover:bg-primary/15"
                    )}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <form action={signOut}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>تسجيل الخروج</span>}
          </Button>
        </form>
      </div>
    </aside>
  )
}
