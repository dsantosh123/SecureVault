"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Home, Plus, Eye, Settings, Menu, X, CreditCard, ArrowLeft, Users } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Check if user is authenticated
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const navigationItems = [
    { href: "/dashboard", label: "Overview", icon: Home },
    { href: "/dashboard/add-asset", label: "Add Digital Asset", icon: Plus },
    { href: "/dashboard/assets", label: "View Assets", icon: Eye },
    { href: "/dashboard/nominees", label: "Manage Nominees", icon: Users },
    { href: "/dashboard/security", label: "Security Settings", icon: Settings },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-card border-b border-border px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <span className="font-bold">SecureVault</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } fixed md:relative md:translate-x-0 left-0 top-0 md:top-auto h-screen md:h-auto w-64 bg-card border-r border-border transition-transform duration-300 z-30 md:z-auto overflow-y-auto flex flex-col`}
        >
          {/* Logo */}
          <div className="hidden md:flex items-center gap-3 p-6 border-b border-border">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-lg">SecureVault</h2>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="p-4 md:px-6 md:pt-4 md:pb-2">
            <Link href="/">
              <button
                onClick={() => {
                  if (isMobile) setIsSidebarOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/50"
              >
                <ArrowLeft className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">Back to Home</span>
              </button>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 md:px-6 md:pt-2 md:pb-6 space-y-2">
            <div className="mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2">
                Dashboard Menu
              </p>
            </div>
            {navigationItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <button
                  onClick={() => {
                    if (isMobile) setIsSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(href)
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-foreground hover:bg-muted hover:translate-x-1"
                    }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{label}</span>
                </button>
              </Link>
            ))}
          </nav>

          {/* User Info Card */}
          {user && (
            <div className="mx-4 md:mx-6 mb-4 p-3 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
                  {user.fullName?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{user.fullName || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email || ""}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-4 md:p-6 space-y-3 border-t border-border">
            <Link href="/pricing" className="block">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-primary/30 hover:bg-primary/10 text-primary bg-transparent transition-all hover:scale-105"
              >
                <CreditCard className="w-4 h-4" />
                <span>Upgrade Plan</span>
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-destructive/30 hover:bg-destructive hover:text-destructive-foreground bg-transparent transition-all hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && isMobile && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  )
}