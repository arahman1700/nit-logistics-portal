import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Plus, FolderKanban, MapPin, Calendar, Building2 } from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  on_hold: "bg-yellow-100 text-yellow-800",
}

const statusLabels: Record<string, string> = {
  active: "نشط",
  completed: "مكتمل",
  on_hold: "متوقف",
}

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FolderKanban className="w-7 h-7 text-primary" />
            المشاريع
          </h1>
          <p className="text-muted-foreground">إدارة وتتبع جميع المشاريع</p>
        </div>
        <Button asChild className="gradient-primary gap-2">
          <Link href="/dashboard/projects/new">
            <Plus className="w-4 h-4" />
            مشروع جديد
          </Link>
        </Button>
      </div>

      {/* Projects Grid */}
      {!projects || projects.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="py-12 text-center">
            <FolderKanban className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">لا توجد مشاريع حتى الآن</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/projects/new">إنشاء مشروع جديد</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="border-0 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <p className="text-sm font-mono text-muted-foreground">
                      {project.code}
                    </p>
                  </div>
                  <Badge className={statusColors[project.status]}>
                    {statusLabels[project.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {project.client && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span>{project.client}</span>
                    </div>
                  )}
                  {project.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{project.location}</span>
                    </div>
                  )}
                </div>

                {project.start_date && project.end_date && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(project.start_date), "dd MMM yyyy", {
                          locale: ar,
                        })}
                      </span>
                      <span>
                        {format(new Date(project.end_date), "dd MMM yyyy", {
                          locale: ar,
                        })}
                      </span>
                    </div>
                    <Progress value={50} className="h-1.5" />
                  </div>
                )}

                <div className="pt-3 border-t border-border">
                  <Button variant="ghost" size="sm" asChild className="w-full">
                    <Link href={`/dashboard/projects/${project.id}`}>
                      عرض التفاصيل
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
