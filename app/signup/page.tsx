"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertCircle,
  CheckCircle,
  Lock,
  Mail,
  User,
  Globe,
  Shield,
  Sparkles,
  Eye,
  EyeOff
} from "lucide-react"
import { API_ENDPOINTS, setAuthToken } from "@/lib/api-config"
import { apiPost } from "@/lib/api-client"

export default function SignUpPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [accountType, setAccountType] = useState("individual")
  const [country, setCountry] = useState("India")
  const [otp, setOtp] = useState("")

  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [encryptionConfirmed, setEncryptionConfirmed] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const calculatePasswordStrength = (pwd: string): number => {
    let strength = 0
    if (pwd.length >= 8) strength++
    if (pwd.length >= 12) strength++
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[!@#$%^&*]/.test(pwd)) strength++
    return strength
  }

  const passwordStrength = calculatePasswordStrength(password)

  const getPasswordStrengthLabel = (strength: number) => {
    if (strength <= 1) return { label: "Weak", color: "bg-red-500", textColor: "text-red-600" }
    if (strength <= 2) return { label: "Fair", color: "bg-orange-500", textColor: "text-orange-600" }
    if (strength <= 3) return { label: "Good", color: "bg-yellow-500", textColor: "text-yellow-600" }
    if (strength <= 4) return { label: "Strong", color: "bg-lime-500", textColor: "text-lime-600" }
    return { label: "Very Strong", color: "bg-green-500", textColor: "text-green-600" }
  }

  const handleStep1Submit = async () => {
    setError("")
    setIsLoading(true)

    try {
      if (!fullName.trim()) {
        setError("Please enter your full name")
        setIsLoading(false)
        return
      }

      if (!email || !password || !confirmPassword) {
        setError("Please fill in all fields")
        setIsLoading(false)
        return
      }

      if (password.length < 8) {
        setError("Password must be at least 8 characters long")
        setIsLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match")
        setIsLoading(false)
        return
      }

      if (!encryptionConfirmed) {
        setError("You must acknowledge the encryption policy to proceed")
        setIsLoading(false)
        return
      }

      const response = await apiPost((API_ENDPOINTS.auth as any).sendOtp || `${API_ENDPOINTS.auth.login.replace('/login', '/send-otp')}`, { email })

      if (!response.success) {
        throw new Error(response.error || "Failed to send OTP")
      }

      setCurrentStep(2)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send OTP. Please try again."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStep2Submit = async () => {
    setError("")
    setIsLoading(true)

    try {
      if (!otp || otp.length !== 6) {
        setError("Please enter a valid 6-digit OTP")
        setIsLoading(false)
        return
      }

      const response = await apiPost<any>(API_ENDPOINTS.auth.signup, {
        email,
        password,
        fullName,
        accountType,
        country,
        otp,
      })

      if (!response.success) {
        throw new Error(response.error || "Signup failed")
      }

      const { token, user } = response.data

      setAuthToken(token)

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify({
          id: user.id,
          email: user.email,
          fullName: user.fullName
        }))
      }

      window.location.href = "/dashboard"
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Invalid OTP or signup failed"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">SecureVault</h1>
          <p className="text-gray-600 mt-2 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Create Your Secure Account
            <Sparkles className="w-4 h-4" />
          </p>
        </div>

        {currentStep === 1 && (
          <Card className="p-8 shadow-xl">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  We'll send a verification code to this email
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type</Label>
                  <select
                    id="accountType"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white"
                  >
                    <option value="individual">Individual</option>
                    <option value="student">Student</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    Country
                  </Label>
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white"
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {password && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-600">Password Strength</span>
                      <span className={`text-xs font-bold ${getPasswordStrengthLabel(passwordStrength).textColor}`}>
                        {getPasswordStrengthLabel(passwordStrength).label}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className={`h-full transition-all ${getPasswordStrengthLabel(passwordStrength).color}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Passwords do not match
                  </p>
                )}
              </div>

              <div className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${encryptionConfirmed
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50"
                }`}>
                <input
                  type="checkbox"
                  id="encryption"
                  checked={encryptionConfirmed}
                  onChange={(e) => setEncryptionConfirmed(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded cursor-pointer"
                />
                <Label htmlFor="encryption" className="text-sm cursor-pointer flex-1">
                  I understand my data is encrypted end-to-end and cannot be recovered if credentials are lost.
                </Label>
                <Shield className={`w-5 h-5 ${encryptionConfirmed ? "text-blue-600" : "text-gray-400"}`} />
              </div>

              <Button
                onClick={handleStep1Submit}
                disabled={isLoading || !encryptionConfirmed}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold py-6"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Continue to Verification
                    <Sparkles className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-100 mb-4">
                <Mail className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Verify Your Email</h2>
              <p className="text-gray-600">We've sent a 6-digit code to</p>
              <p className="font-semibold mt-1">{email}</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="otp" className="text-center block">
                  Enter 6-Digit Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="text-center text-3xl tracking-[0.5em] font-bold py-6"
                />
                <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" />
                  Check your spam folder if you don't see the email
                </p>
              </div>

              <Button
                onClick={handleStep2Submit}
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold py-6"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Verify & Create Account
                  </>
                )}
              </Button>

              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">Didn't receive the code?</p>
                <Button
                  onClick={() => setCurrentStep(1)}
                  variant="outline"
                  className="border-gray-300"
                >
                  Go Back to Form
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}