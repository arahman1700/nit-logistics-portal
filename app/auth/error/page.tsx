import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Building2 } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-mesh p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4 shadow-lg">
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">NIT Logistics Portal</h1>
        </div>

        <Card className="border-0 shadow-xl glass">
          <CardHeader className="space-y-1 pb-4 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-xl">حدث خطأ في المصادقة</CardTitle>
            <CardDescription>
              لم نتمكن من تسجيل دخولك. يرجى المحاولة مرة أخرى.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full gradient-primary">
              <Link href="/auth/login">العودة إلى تسجيل الدخول</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">الصفحة الرئيسية</Link>
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2024 Nesma Industrial Technology. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  )
}
