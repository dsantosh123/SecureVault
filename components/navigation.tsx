"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useAuth } from "@/context/auth"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { isLoggedIn } = useAuth()

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold">SV</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">SecureVault</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm hover:text-primary transition">
              Features
            </Link>
            <Link href="#security" className="text-sm hover:text-primary transition">
              Security
            </Link>
            <Link href="#pricing" className="text-sm hover:text-primary transition">
              How It Works
            </Link>
            <Link href="#contact" className="text-sm hover:text-primary transition">
              Contact
            </Link>
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              {isLoggedIn ? "Dashboard" : "Get Started"}
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="#features" className="block px-3 py-2 rounded hover:bg-muted">
              Features
            </Link>
            <Link href="#security" className="block px-3 py-2 rounded hover:bg-muted">
              Security
            </Link>
            <Link href="#pricing" className="block px-3 py-2 rounded hover:bg-muted">
              How It Works
            </Link>
            <Link href="#contact" className="block px-3 py-2 rounded hover:bg-muted">
              Contact
            </Link>
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="block w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition text-center"
            >
              {isLoggedIn ? "Dashboard" : "Get Started"}
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}