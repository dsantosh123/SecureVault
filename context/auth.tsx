"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  isLoggedIn: boolean
  user: any | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (fullName: string, email: string, password: string, phone?: string, country?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()
      localStorage.setItem("authToken", data.token)
      localStorage.setItem("user", JSON.stringify(data))

      setIsLoggedIn(true)
      setUser(data)
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const signup = async (fullName: string, email: string, password: string, phone?: string, country?: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, phoneNumber: phone, country }),
      })

      if (!response.ok) {
        throw new Error("Signup failed")
      }

      const data = await response.json()
      localStorage.setItem("authToken", data.token)
      localStorage.setItem("user", JSON.stringify(data))

      setIsLoggedIn(true)
      setUser(data)
      router.push("/pricing")
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    setUser(null)
    router.push("/")
  }

  return <AuthContext.Provider value={{ isLoggedIn, user, login, logout, signup }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
