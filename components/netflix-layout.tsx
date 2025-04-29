import type { ReactNode } from "react"
import Header from "./netflix-header"
import { ThemeProvider } from "@/components/theme-provider"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="pt-16">{children}</main>
      </div>
    </ThemeProvider>
  )
}
