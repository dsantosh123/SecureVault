"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Shield, Eye, EyeOff, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { API_ENDPOINTS } from "@/lib/api-config"
import { apiPost } from "@/lib/api-client"

export default function SecuritySettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  })

  // Enhanced password strength checker
  useEffect(() => {
    const criteria = {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
    }
    setPasswordCriteria(criteria)

    const strength = Object.values(criteria).filter(Boolean).length
    setPasswordStrength(strength)
  }, [newPassword])

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500"
    if (passwordStrength === 3) return "bg-yellow-500"
    if (passwordStrength === 4) return "bg-blue-500"
    return "bg-green-500"
  }

  const getStrengthText = () => {
    if (passwordStrength <= 2) return "Weak"
    if (passwordStrength === 3) return "Fair"
    if (passwordStrength === 4) return "Good"
    return "Strong"
  }

  const handlePasswordChange = async () => {
    setMessage("")
    setIsLoading(true)

    try {
      // Validation
      if (!currentPassword || !newPassword || !confirmPassword) {
        setMessage("error|Please fill in all password fields")
        setIsLoading(false)
        return
      }

      if (newPassword !== confirmPassword) {
        setMessage("error|New passwords do not match")
        setIsLoading(false)
        return
      }

      if (passwordStrength < 4) {
        setMessage("error|Password must meet at least 4 security criteria")
        setIsLoading(false)
        return
      }

      if (currentPassword === newPassword) {
        setMessage("error|New password must be different from current password")
        setIsLoading(false)
        return
      }

      const response = await apiPost(API_ENDPOINTS.auth.changePassword, {
        currentPassword,
        newPassword
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to change password");
      }

      setMessage("success|Password changed successfully! Your account is now more secure.")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      // Auto-clear success message after 5 seconds
      setTimeout(() => setMessage(""), 5000)
    } catch (err) {
      setMessage("error|Failed to change password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && passwordStrength >= 4 && newPassword === confirmPassword) {
      handlePasswordChange()
    }
  }

  const isSuccess = message.startsWith("success|")
  const displayMessage = message.replace(/^(success|error)\|/, "")

  return (
    <div className="space-y-8 max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          Security Settings
        </h1>
        <p className="text-muted-foreground">Manage your account security and encryption</p>
      </div>

      {/* Security Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 transition-colors">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground">End-to-End Encryption</h3>
              <p className="text-sm text-muted-foreground">Active & Enabled</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>AES-256 Encryption</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10 transition-colors">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">Not Enabled</p>
              <Button variant="link" className="mt-1 p-0 h-auto text-xs text-primary">
                Enable 2FA →
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Change Password */}
      <Card className="p-8 border border-border shadow-lg">
        <h2 className="text-xl font-semibold text-foreground mb-6">Change Password</h2>

        {message && (
          <Alert
            className={`mb-6 animate-in fade-in slide-in-from-top-2 duration-300 ${isSuccess
              ? "bg-green-500/10 border-green-500/50"
              : "bg-red-500/10 border-red-500/50"
              }`}
          >
            <AlertDescription
              className={`flex items-center gap-2 ${isSuccess
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
                }`}
            >
              {isSuccess ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              {displayMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-foreground font-semibold">
              Current Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-input border-border text-foreground placeholder-muted-foreground focus:ring-ring pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-foreground font-semibold">
              New Password <span className="text-destructive">*</span>
            </Label>
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-input border-border text-foreground placeholder-muted-foreground focus:ring-ring"
              disabled={isLoading}
            />

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="space-y-2 mt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Password Strength:</span>
                  <span className={`font-semibold ${passwordStrength <= 2 ? 'text-red-500' :
                    passwordStrength === 3 ? 'text-yellow-500' :
                      passwordStrength === 4 ? 'text-blue-500' : 'text-green-500'
                    }`}>
                    {getStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>

                {/* Password Criteria Checklist */}
                <div className="grid grid-cols-1 gap-1 text-xs mt-3">
                  <div className={`flex items-center gap-2 ${passwordCriteria.length ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                    {passwordCriteria.length ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordCriteria.uppercase ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                    {passwordCriteria.uppercase ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    <span>One uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordCriteria.lowercase ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                    {passwordCriteria.lowercase ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    <span>One lowercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordCriteria.number ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                    {passwordCriteria.number ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    <span>One number</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordCriteria.special ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                    {passwordCriteria.special ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    <span>One special character (!@#$%^&*)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground font-semibold">
              Confirm Password <span className="text-destructive">*</span>
            </Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-input border-border text-foreground placeholder-muted-foreground focus:ring-ring"
              disabled={isLoading}
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <XCircle className="w-3 h-3" />
                Passwords do not match
              </p>
            )}
            {confirmPassword && newPassword === confirmPassword && (
              <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" />
                Passwords match
              </p>
            )}
          </div>

          <Button
            onClick={handlePasswordChange}
            disabled={isLoading || passwordStrength < 4 || newPassword !== confirmPassword}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold py-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating Password...
              </span>
            ) : (
              "Update Password"
            )}
          </Button>
        </div>
      </Card>

      {/* Security Tips */}
      <Card className="p-6 border border-border bg-muted/30">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Security Best Practices
        </h3>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Use a strong password with a mix of uppercase, lowercase, numbers, and symbols</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Never share your password with anyone, including SecureVault staff</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Enable two-factor authentication for an extra layer of security</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Log out of your account when using shared computers</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Change your password regularly (recommended every 90 days)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">•</span>
            <span>All data is encrypted end-to-end with AES-256 encryption</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}