import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { AnalyticsBootstrap } from "@/components/analytics/analytics-bootstrap"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { ThemeScript } from "@/components/layout/theme-script"
import { LocaleProvider } from "@/components/providers/locale-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { en } from "@/lib/i18n"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>
          <LocaleProvider>
            <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_bottom,oklch(0.55_0.15_265/0.03),transparent_40%)] dark:opacity-100 opacity-60" />
            <div className="relative flex min-h-full flex-col">
              <AnalyticsBootstrap />
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
