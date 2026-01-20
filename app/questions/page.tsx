"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  AlertCircle, 
  CheckCircle, 
  Lock, 
  Shield, 
  Sparkles,
  Eye,
  EyeOff,
  KeyRound,
  UserCheck,
  Fingerprint,
  Clock,
  ArrowRight,
  Trophy,
  Star,
  Zap
} from "lucide-react"

export default function TrustVerificationPage() {
  // Security Questions State
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({
    motherMaidenName: "",
    firstPetName: "",
    birthCity: "",
    favoriteTeacher: "",
    childhoodFriend: ""
  })

  // Additional Security State
  const [verificationCode, setVerificationCode] = useState("")
  const [backupEmail, setBackupEmail] = useState("")
  const [backupPhone, setBackupPhone] = useState("")
  const [securityPin, setSecurityPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")

  // UI States
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [showConfirmPin, setShowConfirmPin] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [celebrating, setCelebrating] = useState(false)

  const securityQuestions = [
    {
      id: "motherMaidenName",
      question: "What is your mother's maiden name?",
      placeholder: "Enter mother's maiden name",
      icon: UserCheck,
      tip: "This helps us verify your identity securely"
    },
    {
      id: "firstPetName",
      question: "What was the name of your first pet?",
      placeholder: "Enter first pet's name",
      icon: Fingerprint,
      tip: "A memorable answer only you would know"
    },
    {
      id: "birthCity",
      question: "In which city were you born?",
      placeholder: "Enter birth city",
      icon: Shield,
      tip: "Your place of birth for verification"
    },
    {
      id: "favoriteTeacher",
      question: "What was your favorite teacher's name?",
      placeholder: "Enter teacher's name",
      icon: KeyRound,
      tip: "Someone who made a difference in your life"
    },
    {
      id: "childhoodFriend",
      question: "What was your childhood best friend's name?",
      placeholder: "Enter friend's name",
      icon: UserCheck,
      tip: "Your closest friend from growing up"
    }
  ]

  const currentQ = securityQuestions[currentQuestion]
  const IconComponent = currentQ.icon

  // Auto-hide success messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: value
    }))
    setError("")
  }

  const handleNextQuestion = () => {
    const currentAnswer = answers[currentQ.id as keyof typeof answers]
    
    if (!currentAnswer.trim()) {
      setError("Please provide an answer to continue")
      return
    }

    if (currentAnswer.trim().length < 2) {
      setError("Answer must be at least 2 characters long")
      return
    }

    if (currentQuestion < securityQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setError("")
      setSuccessMessage("Great! Moving to the next question...")
    } else {
      setCurrentStep(2)
      setError("")
      setSuccessMessage("Security questions completed! 🎉")
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      setError("")
    }
  }

  const handleSendVerificationCode = async () => {
    if (!backupEmail && !backupPhone) {
      setError("Please provide at least one backup contact method")
      return
    }

    if (backupEmail && !backupEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address")
      return
    }

    if (backupPhone && !backupPhone.match(/^\+?[\d\s-()]+$/)) {
      setError("Please enter a valid phone number")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setVerificationSent(true)
      setSuccessMessage("Verification code sent successfully! ✓")
    } catch (err) {
      setError("Failed to send verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStep2Submit = async () => {
    if (!verificationSent) {
      setError("Please send and verify your backup contact first")
      return
    }

    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter the 6-digit verification code")
      return
    }

    if (!securityPin || securityPin.length !== 4) {
      setError("Security PIN must be 4 digits")
      return
    }

    if (securityPin !== confirmPin) {
      setError("Security PINs do not match")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setCurrentStep(3)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    } catch (err) {
      setError("Verification failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFinalSubmit = async () => {
    setIsLoading(true)
    setCelebrating(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      if (typeof window !== 'undefined') {
        const userData = JSON.parse(localStorage.getItem("user") || "{}")
        userData.trustVerified = true
        userData.trustVerificationDate = new Date().toISOString()
        userData.securityQuestionsSet = true
        localStorage.setItem("user", JSON.stringify(userData))
      }

      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1000)
    } catch (err) {
      setError("Failed to complete verification. Please try again.")
      setIsLoading(false)
      setCelebrating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-indigo-400/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 4s ease-out forwards;
        }
      `}</style>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header with Animation */}
        <div className="mb-8 text-center animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 mb-4 shadow-2xl shadow-blue-500/50 relative group transform hover:scale-110 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity animate-pulse"></div>
            <Shield className="w-10 h-10 text-white relative z-10" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Trust Verification
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg flex items-center justify-center gap-2">
            <Lock className="w-5 h-5" />
            Secure Your Account with Enhanced Protection
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </p>
        </div>

        {/* Success Message Toast */}
        {successMessage && (
          <div className="mb-6 animate-in slide-in-from-top duration-300">
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950/30">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-700 dark:text-green-300 font-medium">
                {successMessage}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Enhanced Progress Indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                currentStep === step 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/50 scale-125" 
                  : currentStep > step 
                  ? "bg-green-500 text-white shadow-lg"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}>
                {currentStep > step ? (
                  <CheckCircle className="w-6 h-6 animate-in zoom-in" />
                ) : (
                  <span className="text-lg">{step}</span>
                )}
                {currentStep === step && (
                  <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75"></div>
                )}
              </div>
              {step < 3 && (
                <div className={`w-16 h-2 mx-2 rounded-full transition-all duration-500 ${
                  currentStep > step ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                }`}>
                  {currentStep > step && (
                    <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-pulse"></div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Security Questions */}
        {currentStep === 1 && (
          <Card className="p-8 border-2 border-blue-200 dark:border-blue-800 shadow-2xl backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 relative overflow-hidden animate-in fade-in slide-in-from-bottom duration-500">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"></div>
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 mb-4 transform hover:rotate-12 transition-transform duration-300">
                <IconComponent className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Question {currentQuestion + 1} of {securityQuestions.length}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">{currentQ.tip}</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6 animate-in fade-in slide-in-from-top-2 shake">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-3">
                  <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  {currentQ.question}
                </Label>
                <Input
                  type="text"
                  placeholder={currentQ.placeholder}
                  value={answers[currentQ.id as keyof typeof answers]}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-lg py-7 rounded-xl hover:border-blue-400 hover:shadow-lg"
                  onKeyDown={(e) => e.key === 'Enter' && handleNextQuestion()}
                  autoFocus
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Your answers are encrypted and stored securely with bank-level protection
                </p>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300">
                  <span className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Progress
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">
                    {currentQuestion + 1}/{securityQuestions.length}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-700 ease-out relative"
                    style={{ width: `${((currentQuestion + 1) / securityQuestions.length) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                {currentQuestion > 0 && (
                  <Button
                    onClick={handlePreviousQuestion}
                    variant="outline"
                    className="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all py-7 text-lg rounded-xl font-semibold hover:scale-105"
                  >
                    Previous
                  </Button>
                )}
                <Button
                  onClick={handleNextQuestion}
                  className={`${currentQuestion > 0 ? 'flex-1' : 'w-full'} bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-7 text-lg shadow-xl shadow-blue-500/50 hover:shadow-2xl hover:shadow-blue-600/60 transition-all duration-300 rounded-xl hover:scale-105 flex items-center justify-center gap-2`}
                >
                  {currentQuestion < securityQuestions.length - 1 ? "Next Question" : "Continue to Security Setup"}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: Additional Security Setup */}
        {currentStep === 2 && (
          <Card className="p-8 border-2 border-indigo-200 dark:border-indigo-800 shadow-2xl backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 relative overflow-hidden animate-in fade-in slide-in-from-right duration-500">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600"></div>
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 mb-4 transform hover:rotate-12 transition-transform duration-300">
                <KeyRound className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Additional Security Layer</h2>
              <p className="text-gray-600 dark:text-gray-300">Set up backup recovery and create your security PIN</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              {/* Backup Contact Methods */}
              <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  Backup Recovery Contact
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="backupEmail" className="text-gray-700 dark:text-gray-200 font-semibold">Backup Email Address</Label>
                    <Input
                      id="backupEmail"
                      type="email"
                      placeholder="your.backup@email.com"
                      value={backupEmail}
                      onChange={(e) => setBackupEmail(e.target.value)}
                      className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-blue-500/50 transition-all py-6 text-lg rounded-xl"
                    />
                  </div>

                  <div className="text-center font-semibold text-gray-500 dark:text-gray-400">OR</div>

                  <div className="space-y-2">
                    <Label htmlFor="backupPhone" className="text-gray-700 dark:text-gray-200 font-semibold">Backup Phone Number</Label>
                    <Input
                      id="backupPhone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={backupPhone}
                      onChange={(e) => setBackupPhone(e.target.value)}
                      className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-blue-500/50 transition-all py-6 text-lg rounded-xl"
                    />
                  </div>
                </div>

                {!verificationSent ? (
                  <Button
                    onClick={handleSendVerificationCode}
                    disabled={isLoading || (!backupEmail && !backupPhone)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Sending Code...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Send Verification Code
                      </>
                    )}
                  </Button>
                ) : (
                  <Alert className="border-green-500 bg-green-50 dark:bg-green-950/30 animate-in zoom-in">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <AlertDescription className="text-green-700 dark:text-green-300 font-semibold">
                      ✓ Code sent to {backupEmail || backupPhone}!
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Verification Code */}
              {verificationSent && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top duration-500 p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800">
                  <Label htmlFor="verificationCode" className="text-gray-800 dark:text-white font-bold text-lg flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-purple-600" />
                    Enter 6-Digit Verification Code
                  </Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    maxLength={6}
                    placeholder="● ● ● ● ● ●"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                    className="text-center text-3xl tracking-[1em] font-bold bg-white dark:bg-gray-800 border-2 border-purple-300 dark:border-purple-600 focus:ring-4 focus:ring-purple-500/50 py-8 rounded-xl"
                  />
                </div>
              )}

              {/* Security PIN Setup */}
              <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-2 border-indigo-200 dark:border-indigo-800">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                  <Fingerprint className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  Create Security PIN
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="securityPin" className="text-gray-700 dark:text-gray-200 font-semibold">4-Digit Security PIN</Label>
                    <div className="relative">
                      <Input
                        id="securityPin"
                        type={showPin ? "text" : "password"}
                        maxLength={4}
                        placeholder="••••"
                        value={securityPin}
                        onChange={(e) => setSecurityPin(e.target.value.replace(/\D/g, ""))}
                        className="text-center text-3xl tracking-[1em] font-bold bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-indigo-500/50 py-8 pr-12 rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-2"
                      >
                        {showPin ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPin" className="text-gray-700 dark:text-gray-200 font-semibold">Confirm Security PIN</Label>
                    <div className="relative">
                      <Input
                        id="confirmPin"
                        type={showConfirmPin ? "text" : "password"}
                        maxLength={4}
                        placeholder="••••"
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                        className="text-center text-3xl tracking-[1em] font-bold bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-indigo-500/50 py-8 pr-12 rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPin(!showConfirmPin)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-2"
                      >
                        {showConfirmPin ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                      </button>
                    </div>
                  </div>

                  {confirmPin && securityPin !== confirmPin && (
                    <Alert variant="destructive" className="animate-in fade-in">
                      <AlertCircle className="w-4 h-4" />
                      <AlertDescription>PINs do not match</AlertDescription>
                    </Alert>
                  )}
                  
                  {confirmPin && securityPin === confirmPin && securityPin.length === 4 && (
                    <Alert className="border-green-500 bg-green-50 dark:bg-green-950/30 animate-in zoom-in">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <AlertDescription className="text-green-700 dark:text-green-300 font-semibold">
                        Perfect! PINs match ✓
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              <Button
                onClick={handleStep2Submit}
                disabled={isLoading || !verificationCode || securityPin.length !== 4 || securityPin !== confirmPin}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-7 text-lg shadow-xl shadow-indigo-500/50 hover:shadow-2xl transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Continue to Final Step
                    <Sparkles className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Final Confirmation */}
        {currentStep === 3 && (
          <Card className="p-10 border-2 border-green-200 dark:border-green-800 shadow-2xl backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 relative overflow-hidden animate-in fade-in zoom-in duration-700">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
            
            {celebrating && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              </div>
            )}
            
            <div className="text-center mb-8 relative z-10">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 mb-6 relative transform hover:rotate-12 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl blur-xl opacity-40 animate-pulse"></div>
                <Trophy className="w-14 h-14 text-green-600 dark:text-green-400 relative z-10" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 animate-in zoom-in">
                Trust Verification Complete! 🎉
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">Your account is now protected with enhanced security</p>
            </div>

            <div className="space-y-4 mb-10 relative z-10">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">Security Questions Set</h3>
                    <p className="text-gray-600 dark:text-gray-300">5 security questions configured for account recovery</p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">Backup Contact Verified</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {backupEmail || backupPhone} confirmed for account recovery
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">Security PIN Created</h3>
                    <p className="text-gray-600 dark:text-gray-300">4-digit PIN set for quick verification</p>
                  </div>
                </div>
              </div>
            </div>

            <Alert className="mb-8 border-blue-500 bg-blue-50 dark:bg-blue-950/30 relative z-10">
              <Shield className="h-5 w-5 text-blue-600" />
              <AlertDescription className="text-gray-700 dark:text-gray-200">
                <span className="font-bold">Important:</span> You'll be asked to verify your identity using these security measures when performing sensitive operations or accessing your account from new devices.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleFinalSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold py-8 text-xl shadow-2xl shadow-green-500/50 hover:shadow-3xl hover:shadow-green-600/60 transition-all duration-300 rounded-2xl relative z-10 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                  Taking you to dashboard...
                </>
              ) : (
                <>
                  <Trophy className="w-6 h-6 mr-3" />
                  Complete Setup & Go to Dashboard
                  <ArrowRight className="w-6 h-6 ml-3" />
                </>
              )}
            </Button>
          </Card>
        )}

        {/* Enhanced Security Notice */}
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <span>
              <span className="font-bold text-gray-800 dark:text-white">Timeout Protection:</span> For your security, this session will expire after 15 minutes of inactivity. You can resume the verification process anytime from your account settings.
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}