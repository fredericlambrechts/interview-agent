import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next"
import { ThemeProvider } from "../components/provider"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "SuperSwift Interview Agent",
  description: "AI-powered strategic assessment for MedTech companies",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} font-inter antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          forcedTheme="light"
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
