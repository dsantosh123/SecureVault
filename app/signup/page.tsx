"use client"

import { useState } from "react"
import Link from "next/link";
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

export default function SignUpPage() {
  // Router for navigation - THIS IS CRITICAL FOR REDIRECT
  const router = typeof window !== 'undefined' ? {
    push: (path: string) => {
      // This simulates the redirect - replace with real useRouter in Next.js
      window.location.href = path
    }
  } : { push: () => {} }

  // Form states
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [accountType, setAccountType] = useState("individual")
  const [country, setCountry] = useState("India")
  const [otp, setOtp] = useState("")

  // UI states
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [encryptionConfirmed, setEncryptionConfirmed] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const calculatePasswordStrength = (pwd: string) => {
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
    if (strength <= 1) return { label: "Weak", color: "bg-red-500", textColor: "text-red-600 dark:text-red-400" }
    if (strength <= 2) return { label: "Fair", color: "bg-orange-500", textColor: "text-orange-600 dark:text-orange-400" }
    if (strength <= 3) return { label: "Good", color: "bg-yellow-500", textColor: "text-yellow-600 dark:text-yellow-400" }
    if (strength <= 4) return { label: "Strong", color: "bg-lime-500", textColor: "text-lime-600 dark:text-lime-400" }
    return { label: "Very Strong", color: "bg-green-500", textColor: "text-green-600 dark:text-green-400" }
  }

  const handleStep1Submit = async () => {
    setError("")
    setIsLoading(true)

    try {
      // Validation
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

      // Simulate OTP send to email
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setCurrentStep(2)
    } catch (err) {
      setError("Failed to send OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStep2Submit = async () => {
    setError("");
    setIsLoading(true);

    try {
        if (!otp || otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            setIsLoading(false);
            return;
        }

        const response = await fetch("http://localhost:8080/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                password,
                fullName,
                accountType,
                country
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || "Signup failed");
        }

        // CHANGE 1: Instead of response.text(), we use response.json() 
        // to get the actual User object with the ID from the database.
        const savedUser = await response.json(); 
        
        // CHANGE 2: Store the real ID from the database into localStorage.
        // This 'savedUser.id' is what fixes the "undefined" error.
        localStorage.setItem("user", JSON.stringify({ 
            id: savedUser.id, 
            email: savedUser.email, 
            fullName: savedUser.fullName 
        }));

        router.push("/questions");
    } catch (err: any) {
        setError(err.message || "Connection to server failed");
    } finally {
        setIsLoading(false);
    }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl relative z-10">
        {/* Logo/Header with enhanced styling */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent mb-4 shadow-lg shadow-primary/20 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <Lock className="w-8 h-8 text-primary-foreground relative z-10" />
          </div>
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            SecureVault
          </h1>
          <p className="text-muted-foreground mt-2 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Create Your Secure Account
            <Sparkles className="w-4 h-4" />
          </p>
        </div>

        {/* Step 1: Enhanced Form */}
        {currentStep === 1 && (
          <Card className="p-8 border border-border/50 shadow-2xl backdrop-blur-sm bg-card/95 relative overflow-hidden">
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
            
            {error && (
              <Alert variant="destructive" className="mb-6 border-red-500/50 bg-red-500/10 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-5">
              {/* Full Name Field with icon inside */}
              <div className="space-y-2 group">
                <Label htmlFor="fullName" className="text-foreground flex items-center gap-2 font-medium">
                  <User className="w-4 h-4 text-primary" />
                  Full Name
                </Label>
                <div className="relative">
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-input/50 border-border/50 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all pl-4 hover:border-primary/30"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2 group">
                <Label htmlFor="email" className="text-foreground flex items-center gap-2 font-medium">
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
                    className="bg-input/50 border-border/50 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all hover:border-primary/30"
                  />
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  We'll send a verification code to this email
                </p>
              </div>

              {/* Account Type & Country in Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountType" className="text-foreground font-medium">
                    Account Type
                  </Label>
                  <select
                    id="accountType"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-border/50 bg-input/50 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all hover:border-primary/30"
                  >
                    <option value="individual">Individual</option>
                    <option value="student">Student</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-foreground flex items-center gap-2 font-medium">
                    <Globe className="w-4 h-4 text-primary" />
                    Country
                  </Label>
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-border/50 bg-input/50 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all hover:border-primary/30"
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Password Field with Show/Hide */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground flex items-center gap-2 font-medium">
                  <Lock className="w-4 h-4 text-primary" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-input/50 border-border/50 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all pr-10 hover:border-primary/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {password && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground">Password Strength</span>
                      <span className={`text-xs font-bold ${getPasswordStrengthLabel(passwordStrength).textColor}`}>
                        {getPasswordStrengthLabel(passwordStrength).label}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ease-out ${getPasswordStrengthLabel(passwordStrength).color}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>

                    <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                      <p className="text-xs font-semibold text-foreground mb-2">Requirements:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { test: password.length >= 8, label: "8+ characters" },
                          { test: /[a-z]/.test(password) && /[A-Z]/.test(password), label: "Upper & lower" },
                          { test: /[0-9]/.test(password), label: "Number" },
                          { test: /[!@#$%^&*]/.test(password), label: "Special char" }
                        ].map((req, idx) => (
                          <div
                            key={idx}
                            className={`text-xs flex items-center gap-2 transition-all duration-300 ${
                              req.test ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                            }`}
                          >
                            {req.test ? (
                              <CheckCircle className="w-4 h-4 animate-in zoom-in duration-200" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-current" />
                            )}
                            {req.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-input/50 border-border/50 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all pr-10 hover:border-primary/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-3 h-3" />
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Enhanced Encryption Checkbox */}
              <div className="relative">
                <div className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-300 ${
                  encryptionConfirmed 
                    ? "border-primary/50 bg-primary/10 shadow-lg shadow-primary/5" 
                    : "border-border/50 bg-muted/20 hover:border-border"
                }`}>
                  <input
                    type="checkbox"
                    id="encryption"
                    checked={encryptionConfirmed}
                    onChange={(e) => setEncryptionConfirmed(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded cursor-pointer accent-primary"
                  />
                  <Label htmlFor="encryption" className="text-sm text-foreground cursor-pointer flex-1 leading-relaxed">
                    I understand my data is encrypted end-to-end and cannot be recovered if credentials are lost. This is a security feature.
                  </Label>
                  <Shield className={`w-5 h-5 transition-colors ${encryptionConfirmed ? "text-primary" : "text-muted-foreground"}`} />
                </div>
              </div>

              {/* Enhanced Submit Button */}
              <Button
                onClick={handleStep1Submit}
                disabled={isLoading || !encryptionConfirmed}
                className="w-full bg-gradient-to-r from-primary via-primary to-accent hover:opacity-90 text-primary-foreground font-semibold py-6 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Continue to Verification
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>

            /* Login Link */
<div className="mt-6 text-center text-sm">
  <span className="text-muted-foreground">Already have an account? </span>
  <Link
    href="/login"
    className="text-primary hover:text-accent font-semibold transition-colors hover:underline"
  >
    Login here
  </Link>
</div>
          </Card>
        )}

        {/* Step 2: Enhanced OTP Verification */}
        {currentStep === 2 && (
          <Card className="p-8 border border-border/50 shadow-2xl backdrop-blur-sm bg-card/95 relative overflow-hidden animate-in fade-in slide-in-from-right duration-500">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur opacity-20 animate-pulse"></div>
                <Mail className="w-10 h-10 text-primary relative z-10" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Verify Your Email</h2>
              <p className="text-muted-foreground">We've sent a 6-digit code to</p>
              <p className="text-foreground font-semibold mt-1">{email}</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6 border-red-500/50 bg-red-500/10 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="otp" className="text-foreground font-medium text-center block">
                  Enter 6-Digit Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="text-center text-3xl tracking-[0.5em] font-bold bg-input/50 border-border/50 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all py-6 hover:border-primary/30"
                />
                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" />
                  Check your spam folder if you don't see the email
                </p>
              </div>

              <Button
                onClick={handleStep2Submit}
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-primary via-primary to-accent hover:opacity-90 text-primary-foreground font-semibold py-6 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Verify & Create Account
                    </>
                  )}
                </span>
              </Button>

              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">Didn't receive the code?</p>
                <Button
                  onClick={() => setCurrentStep(1)}
                  variant="outline"
                  className="border-border/50 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all"
                >
                  Go Back to Form
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Enhanced Security Notice */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border/30 backdrop-blur-sm">
          <p className="text-xs text-muted-foreground flex items-start gap-2">
            <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span>
              <span className="font-semibold text-foreground">Security First:</span> Your data is encrypted with
              military-grade AES-256 encryption. We never store your passwords in plain text.
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}