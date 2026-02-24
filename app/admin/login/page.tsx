"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield, Lock, Mail, AlertCircle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { API_ENDPOINTS } from "@/lib/api-config"
import { apiPost } from "@/lib/api-client"

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimer, setLockTimer] = useState(0)

  // Check if already logged in
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken")
    if (adminToken) {
      router.push("/admin/dashboard")
    }
  }, [router])

  // Rate limiting countdown
  useEffect(() => {
    if (lockTimer > 0) {
      const timer = setTimeout(() => setLockTimer(lockTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else if (lockTimer === 0 && isLocked) {
      setIsLocked(false)
      setAttemptCount(0)
    }
  }, [lockTimer, isLocked])

  const validateEmail = (email: string) => {
    const adminDomains = ["securevault-admin.com", "admin.securevault.com"]
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return false
    const domain = email.split("@")[1]
    return adminDomains.includes(domain)
  }

  const handleLogin = async () => {
    setError("")

    if (isLocked) {
      setError(`Too many failed attempts. Please wait ${lockTimer} seconds.`)
      return
    }

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    if (!validateEmail(email)) {
      setError("Invalid admin email domain")
      return
    }

    if (password.length < 12) {
      setError("Password must be at least 12 characters")
      return
    }

    setLoading(true)

    try {
      const response = await apiPost(API_ENDPOINTS.auth.adminLogin, { email, password });

      if (response.success) {
        const data = response.data as any;
        localStorage.setItem("adminToken", data.token)
        localStorage.setItem("adminEmail", email)
        localStorage.setItem("adminLoginTime", Date.now().toString())

        router.push("/admin/dashboard")
      } else {
        const newAttemptCount = attemptCount + 1
        setAttemptCount(newAttemptCount)

        if (newAttemptCount >= 5) {
          setIsLocked(true)
          setLockTimer(900)
          setError("Too many failed login attempts. Account locked for 15 minutes.")
        } else {
          setError(response.error || `Invalid credentials. ${5 - newAttemptCount} attempts remaining.`)
        }
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-xl">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Portal</h1>
              <p className="text-xs text-slate-400">SecureVault</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="p-6 space-y-4">
          {/* Security Notice */}
          <div className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <p className="text-xs text-slate-300">Authorized access only. All attempts logged.</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-3 py-2 bg-red-950/50 border border-red-800/50 rounded-md">
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="admin@securevault-admin.com"
                disabled={loading || isLocked}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-md text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter password"
                disabled={loading || isLocked}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-md text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                disabled={loading || isLocked}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={loading || isLocked}
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md disabled:opacity-50 text-sm"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Authenticating...</span>
              </div>
            ) : isLocked ? (
              <span>Locked ({lockTimer}s)</span>
            ) : (
              "Secure Login"
            )}
          </Button>

          {/* Demo Info */}
          <div className="px-3 py-2 bg-blue-950/20 border border-blue-800/30 rounded-md">
            <p className="text-xs text-blue-300 mb-1 font-medium">Demo Login:</p>
            <div className="space-y-0.5 text-xs text-blue-200/70 font-mono">
              <p>admin@securevault-admin.com</p>
              <p>SecureVault@2024</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="pt-4 border-t border-slate-800">
            <p className="text-xs text-center text-slate-500">Session expires after 8 hours</p>
          </div>
        </div>
      </Card>
    </div>
  )
}