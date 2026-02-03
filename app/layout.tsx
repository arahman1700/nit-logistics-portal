import type { Metadata, Viewport } from "next"
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
})

export const metadata: Metadata = {
  title: "NIT Logistics Portal | Nesma Industrial Technology",
  description: "Enterprise logistics management system for Nesma Industrial Technology - Managing warehouses, shipments, and supply chain operations",
  keywords: ["logistics", "warehouse", "supply chain", "NIT", "Nesma", "industrial"],
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0ea5e9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c4a6e" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.variable} ${ibmPlexArabic.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
