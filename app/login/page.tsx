"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Lock, Home, Eye, EyeOff, Mail, KeyRound, Loader2, ArrowLeft, Shield } from "lucide-react"

export default function EnhancedLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  
  // Forgot Password State
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const getEmailError = () => {
    if (!emailTouched || !email) return ""
    if (!validateEmail(email)) return "Please enter a valid email address"
    return ""
  }

  const getPasswordError = () => {
    if (!passwordTouched || !password) return ""
    if (password.length < 6) return "Password must be at least 6 characters"
    return ""
  }

  const handleSubmit = async () => {
    setError("")
    setEmailTouched(true)
    setPasswordTouched(true)

    if (!email || !password) {
        setError("Please fill in all fields")
        return
    }

    if (!validateEmail(email)) {
        setError("Please enter a valid email address")
        return
    }

    setIsLoading(true)

    try {
        // ✅ Call your Spring Boot backend with BCrypt password verification
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email, 
                password // ✅ Send raw password - backend will verify with BCrypt
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(errorText || "Invalid email or password")
        }

        const userData = await response.json()

        // ✅ Store user session data
        const sessionData = {
            id: userData.id,
            email: userData.email,
            fullName: userData.fullName,
            loginTime: new Date().toISOString(),
        }

        // ✅ Remember me functionality
        if (rememberMe) {
            localStorage.setItem("user", JSON.stringify(sessionData))
        } else {
            sessionStorage.setItem("user", JSON.stringify(sessionData))
        }

        // ✅ Redirect to dashboard
        router.push("/dashboard")
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Invalid email or password"
        setError(errorMessage)
    } finally {
        setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
  if (!resetEmail || !validateEmail(resetEmail)) {
    setError("Please enter a valid email address")
    return
  }

  setResetLoading(true)
  setError("")

  try {
    const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: resetEmail })
    })

    if (!response.ok) {
      throw new Error("Failed to send reset email")
    }

    setResetEmailSent(true)
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to send reset email. Please try again."
    setError(errorMessage)
  } finally {
    setResetLoading(false)
  }
}

  const resetForgotPasswordForm = () => {
    setShowForgotPassword(false)
    setResetEmail("")
    setResetEmailSent(false)
    setError("")
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action()
    }
  }

  const emailError = getEmailError()
  const passwordError = getPasswordError()

  // Forgot Password View
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center animate-in fade-in slide-in-from-top duration-500">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 shadow-lg">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Reset Password</h1>
            <p className="text-muted-foreground">
              {resetEmailSent 
                ? "Check your email for reset instructions" 
                : "Enter your email to receive a password reset link"}
            </p>
          </div>

          <Card className="p-8 border border-border shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom duration-500">
            {resetEmailSent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Email Sent!</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent password reset instructions to <strong className="text-foreground">{resetEmail}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Please check your inbox and follow the link to reset your password.
                  </p>
                </div>
                <Button
                  onClick={resetForgotPasswordForm}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold h-12"
                >
                  Back to Login
                </Button>
              </div>
            ) : (
              <>
                {error && (
                  <Alert variant="destructive" className="mb-6 animate-in fade-in slide-in-from-top duration-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email" className="text-foreground font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      Email Address
                    </Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="you@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, handleForgotPassword)}
                      className="bg-input border-border text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring transition-all h-11"
                      disabled={resetLoading}
                      autoFocus
                    />
                  </div>

                  <Button
                    onClick={handleForgotPassword}
                    disabled={resetLoading || !resetEmail}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold h-12 text-base shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {resetLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={resetForgotPasswordForm}
                    disabled={resetLoading}
                    className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    )
  }

  // Login View
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header with animation */}
        <div className="mb-8 text-center animate-in fade-in slide-in-from-top duration-500">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 shadow-lg transform transition-transform hover:scale-105">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">SecureVault</h1>
          <p className="text-muted-foreground">Welcome back! Please login to continue</p>
        </div>

        {/* Login Form Card */}
        <Card className="p-8 border border-border shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom duration-500">
          {error && (
            <Alert variant="destructive" className="mb-6 animate-in fade-in slide-in-from-top duration-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  onKeyPress={(e) => handleKeyPress(e, handleSubmit)}
                  className={`bg-input border-border text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring transition-all pl-4 pr-10 h-11 ${
                    emailError ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
                {email && validateEmail(email) && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                    ✓
                  </div>
                )}
              </div>
              {emailError && (
                <p className="text-red-500 text-sm mt-1 animate-in fade-in slide-in-from-top duration-200">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-primary" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setPasswordTouched(true)}
                  onKeyPress={(e) => handleKeyPress(e, handleSubmit)}
                  className={`bg-input border-border text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring transition-all pr-10 h-11 ${
                    passwordError ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm mt-1 animate-in fade-in slide-in-from-top duration-200">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring cursor-pointer"
                  disabled={isLoading}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer select-none"
                >
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-primary hover:text-accent font-medium transition-colors"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !!emailError || !!passwordError}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold h-12 text-base shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm border-t border-border pt-6">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/signup" className="text-primary hover:text-accent font-semibold transition-colors underline-offset-4 hover:underline">
              Sign Up
            </Link>
          </div>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border backdrop-blur-sm animate-in fade-in slide-in-from-bottom duration-700">
          <p className="text-sm text-muted-foreground flex items-start gap-2">
            <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span>
              <span className="font-semibold text-foreground">Secure Login:</span> Your password is verified using BCrypt encryption. We never store passwords in plain text.
            </span>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center animate-in fade-in slide-in-from-bottom duration-1000">
          <Link href="/">
            <Button
              variant="outline"
              className="border-border text-primary hover:bg-primary/10 flex items-center gap-2 mx-auto bg-transparent transition-all hover:scale-105"
              disabled={isLoading}
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}