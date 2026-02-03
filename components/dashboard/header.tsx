"use client"

import Link from "next/link"
import { Profile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react"
import { signOut } from "@/lib/actions/auth"
import { GlobalSearch } from "./global-search"

interface HeaderProps {
  profile: Profile | null
}

const roleLabels: Record<string, string> = {
  admin: "مدير النظام",
  warehouse: "مسؤول مستودع",
  transport: "مسؤول نقل",
  engineer: "مهندس",
}

export function Header({ profile }: HeaderProps) {
  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U"

  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 bg-card border-b border-border">
      {/* Global Search */}
      <div className="flex-1 max-w-md">
        <GlobalSearch />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 left-1 w-2 h-2 bg-destructive rounded-full animate-pulse-soft" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>الإشعارات</span>
              <Badge variant="secondary" className="text-xs">
                3 جديد
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <p className="font-medium text-sm">طلب عمل جديد</p>
                <p className="text-xs text-muted-foreground">
                  تم إنشاء طلب عمل جديد #JO-2024-001
                </p>
                <p className="text-xs text-muted-foreground">منذ 5 دقائق</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <p className="font-medium text-sm">تم الموافقة على MRRV</p>
                <p className="text-xs text-muted-foreground">
                  تمت الموافقة على مستند MRRV-2024-015
                </p>
                <p className="text-xs text-muted-foreground">منذ 15 دقيقة</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <p className="font-medium text-sm">تنبيه مخزون منخفض</p>
                <p className="text-xs text-muted-foreground">
                  المخزون منخفض لـ 5 أصناف في المستودع الرئيسي
                </p>
                <p className="text-xs text-muted-foreground">منذ ساعة</p>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/notifications" className="w-full text-center text-primary">
                عرض جميع الإشعارات
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">تبديل المظهر</span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-3 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="gradient-primary text-primary-foreground text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-right">
                <span className="text-sm font-medium">
                  {profile?.full_name || "مستخدم"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {roleLabels[profile?.role || "engineer"]}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>حسابي</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>الملف الشخصي</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>الإعدادات</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form action={signOut} className="w-full">
                <button
                  type="submit"
                  className="flex items-center gap-2 w-full text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
