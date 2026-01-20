"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { LogOut, Menu, X, LayoutDashboard, Shield, Users, FileText, Clock, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken")
    
    // Don't redirect if already on login page
    if (!adminToken && pathname !== "/admin/login") {
      router.push("/admin/login")
    } else if (adminToken) {
      setIsAuthenticated(true)
    } else if (pathname === "/admin/login") {
      setIsAuthenticated(true) // Allow login page to render
    }
  }, [router, pathname])

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
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminEmail")
    localStorage.removeItem("adminLoginTime")
    router.push("/admin/login")
  }

  const navigationItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/verification", label: "Verifications", icon: Shield },
    { href: "/admin/users", label: "Users & Nominees", icon: Users },
    { href: "/admin/documents", label: "Documents", icon: FileText },
    { href: "/admin/logs", label: "Activity Logs", icon: Clock },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ]

  const isActive = (href: string) => pathname === href

  // If on login page, render without sidebar
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-background">{children}</div>
  }

  // If not authenticated, show loading
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-card border-b border-border px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <span className="font-bold">Admin Panel</span>
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
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed md:relative md:translate-x-0 left-0 top-0 md:top-auto h-screen md:h-auto w-64 bg-card border-r border-border transition-transform duration-300 z-30 md:z-auto overflow-y-auto flex flex-col`}
        >
          {/* Logo */}
          <div className="hidden md:flex items-center gap-3 p-6 border-b border-border">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-lg">SecureVault</h2>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 md:p-6 space-y-2">
            {navigationItems.map(({ href, label, icon: Icon }) => (
              <a key={href} href={href}>
                <button
                  onClick={() => {
                    if (isMobile) setIsSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(href) 
                      ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md" 
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{label}</span>
                </button>
              </a>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 md:p-6 border-t border-border">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-border hover:bg-red-600 hover:text-white hover:border-red-600 bg-transparent transition-all"
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