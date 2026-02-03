import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, CheckCircle2, Mail } from "lucide-react"

export default function SignUpSuccessPage() {
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
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-xl">تم إنشاء الحساب بنجاح</CardTitle>
            <CardDescription>تم إرسال رابط التأكيد إلى بريدك الإلكتروني</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
              <Mail className="w-8 h-8 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">تحقق من بريدك الإلكتروني</p>
                <p className="text-xs text-muted-foreground">
                  انقر على الرابط المرسل لتفعيل حسابك
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Button asChild className="w-full gradient-primary">
                <Link href="/auth/login">العودة إلى تسجيل الدخول</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2024 Nesma Industrial Technology. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  )
}
