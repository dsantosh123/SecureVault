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
  Fingerprint,
  ArrowRight,
  Trophy,
  Star,
  Users,
  UserCheck
} from "lucide-react"

export default function TrustVerificationSystem() {
  const [currentPage, setCurrentPage] = useState("questions")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  
  // FIXED: Initialized with empty strings for all keys to prevent uncontrolled input errors
  const [answers, setAnswers] = useState({
    motherMaidenName: "",
    firstPetName: "",
    birthCity: ""
  })

  const [securityPin, setSecurityPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [showConfirmPin, setShowConfirmPin] = useState(false)

  const [familyName, setFamilyName] = useState("")
  const [familyEmail, setFamilyEmail] = useState("")
  const [familyPhone, setFamilyPhone] = useState("")

  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
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
    }
  ]

 const currentQ = securityQuestions[currentQuestion]
  const IconComponent = currentQ.icon
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  // FIXED: Improved state update logic
  const handleAnswerChange = (value: string) => {
    const fieldId = securityQuestions[currentQuestion].id;
    setAnswers(prev => ({
      ...prev,
      [fieldId]: value
    }))
    if (error) setError("")
  }

  const handleNextQuestion = () => {
    const fieldId = securityQuestions[currentQuestion].id;
    const currentAnswer = answers[fieldId as keyof typeof answers]
    
    if (!currentAnswer || !currentAnswer.trim()) {
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
      setCurrentPage("pin")
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

  const handlePinSubmit = () => {
    // FIXED: Added stricter digit-only validation
    if (!/^\d{4}$/.test(securityPin)) {
      setError("Security PIN must be exactly 4 digits")
      return
    }

    if (securityPin !== confirmPin) {
      setError("Security PINs do not match")
      return
    }

    setCurrentPage("family")
    setError("")
    setSuccessMessage("PIN created successfully! ✓")
  }

  const handleFamilySubmit = async () => {
    if (!familyName.trim()) {
      setError("Please enter family member's name")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!familyEmail.trim() || !emailRegex.test(familyEmail)) {
      setError("Please enter a valid email address")
      return
    }

    // FIXED: Improved phone validation regex
    if (!familyPhone.trim() || familyPhone.length < 10) {
      setError("Please enter a valid phone number (at least 10 digits)")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setCurrentPage("complete")
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    } catch (err) {
      setError("Failed to save information. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFinalSubmit = async () => {
    setIsLoading(true)
    setCelebrating(true)
    
    try {
      // Retrieve original user object from localStorage
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      
      const verificationData = {
        ...storedUser,
        trustVerified: true,
        trustVerificationDate: new Date().toISOString(),
        securityQuestions: answers,
        securityPin: securityPin, // In production, this should be hashed
        familyContact: {
          name: familyName,
          email: familyEmail,
          phone: familyPhone
        }
      }

      // FIXED: Actually saving to localStorage to maintain session persistence
      localStorage.setItem("user", JSON.stringify(verificationData));

      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert("Verification Complete! Redirecting to dashboard...")
      window.location.href = "/dashboard"
    } catch (err) {
      setError("Failed to complete verification. Please try again.")
      setIsLoading(false)
      setCelebrating(false)
    }
  }

  const getProgressStep = () => {
    switch(currentPage) {
      case "questions": return 1
      case "pin": return 2
      case "family": return 3
      case "complete": return 4
      default: return 1
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-3 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-indigo-400/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
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
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 4s ease-out forwards;
        }
      `}</style>

      <div className="w-full max-w-2xl relative z-10">
        <div className="mb-4 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 mb-2 shadow-xl relative">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
            Trust Verification
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            Secure Your Digital Assets
          </p>
        </div>

        {successMessage && (
          <div className="mb-3 animate-in slide-in-from-top duration-300">
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950/30 py-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700 dark:text-green-300 text-sm font-medium">
                {successMessage}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="mb-4 flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                getProgressStep() === step 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-110" 
                  : getProgressStep() > step 
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              }`}>
                {getProgressStep() > step ? <CheckCircle className="w-4 h-4" /> : step}
              </div>
              {step < 4 && (
                <div className={`w-10 h-1 mx-1 rounded-full transition-all ${
                  getProgressStep() > step ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                }`} />
              )}
            </div>
          ))}
        </div>

        {currentPage === "questions" && (
          <Card className="p-5 border-2 border-blue-200 dark:border-blue-800 shadow-xl bg-white/95 dark:bg-gray-900/95">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"></div>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 mb-2">
                <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                Question {currentQuestion + 1} of {securityQuestions.length}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{currentQ.tip}</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-3 py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  {currentQ.question}
                </Label>
                <Input
                  type="text"
                  placeholder={currentQ.placeholder}
                  value={answers[currentQ.id as keyof typeof answers] || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="border-2 focus:ring-2 text-base py-5 rounded-lg"
                  onKeyDown={(e) => e.key === 'Enter' && handleNextQuestion()}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-300">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    Progress
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">
                    {currentQuestion + 1}/{securityQuestions.length}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-700"
                    style={{ width: `${((currentQuestion + 1) / securityQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {currentQuestion > 0 && (
                  <Button
                    onClick={handlePreviousQuestion}
                    variant="outline"
                    className="flex-1 py-5 text-sm rounded-lg"
                  >
                    Previous
                  </Button>
                )}
                <Button
                  onClick={handleNextQuestion}
                  className={`${currentQuestion > 0 ? 'flex-1' : 'w-full'} bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-5 text-sm rounded-lg`}
                >
                  {currentQuestion < securityQuestions.length - 1 ? "Next Question" : "Continue to PIN"}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {currentPage === "pin" && (
          <Card className="p-5 border-2 border-indigo-200 dark:border-indigo-800 shadow-xl bg-white/95 dark:bg-gray-900/95">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600"></div>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 mb-2">
                <Fingerprint className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Create Security PIN</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">4-digit PIN for quick verification</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-3 py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Enter 4-Digit PIN</Label>
                <div className="relative">
                  <Input
                    type={showPin ? "text" : "password"}
                    maxLength={4}
                    placeholder="••••"
                    value={securityPin}
                    onChange={(e) => setSecurityPin(e.target.value.replace(/\D/g, ""))}
                    className="text-center text-2xl tracking-[1em] font-bold py-6 pr-10 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Confirm PIN</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPin ? "text" : "password"}
                    maxLength={4}
                    placeholder="••••"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                    className="text-center text-2xl tracking-[1em] font-bold py-6 pr-10 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {confirmPin && securityPin !== confirmPin && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="w-3 h-3" />
                  <AlertDescription className="text-xs">PINs do not match</AlertDescription>
                </Alert>
              )}
              
              <Button
                onClick={handlePinSubmit}
                disabled={securityPin.length !== 4 || securityPin !== confirmPin}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 py-5 text-sm rounded-lg"
              >
                Continue to Family Contact
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        )}

        {currentPage === "family" && (
          <Card className="p-5 border-2 border-purple-200 dark:border-purple-800 shadow-xl bg-white/95 dark:bg-gray-900/95">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-600"></div>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 mb-2">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Family/Nominee Contact</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Backup contact for asset recovery</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-3 py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Family Member Name</Label>
                <Input
                  type="text"
                  placeholder="Enter full name"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="py-5 text-sm rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Email Address</Label>
                <Input
                  type="email"
                  placeholder="family@email.com"
                  value={familyEmail}
                  onChange={(e) => setFamilyEmail(e.target.value)}
                  className="py-5 text-sm rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Phone Number</Label>
                <Input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={familyPhone}
                  onChange={(e) => setFamilyPhone(e.target.value.replace(/\D/g, ""))}
                  className="py-5 text-sm rounded-lg"
                />
              </div>

              <Button
                onClick={handleFamilySubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-5 text-sm rounded-lg"
              >
                {isLoading ? "Saving..." : "Complete Verification"}
                <Sparkles className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        )}

        {currentPage === "complete" && (
          <Card className="p-6 border-2 border-green-200 dark:border-green-800 shadow-xl bg-white/95 dark:bg-gray-900/95">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
            <div className="text-center mb-4 relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 mb-3">
                <Trophy className="w-9 h-9 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Verification Complete! 🎉
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Your account is now fully protected</p>
            </div>

            <div className="space-y-2 mb-6 relative z-10">
              {[
                { title: "Security Questions", sub: "3 questions configured", color: "green" },
                { title: "Security PIN", sub: "4-digit PIN created", color: "blue" },
                { title: "Family Contact", sub: `${familyName}`, color: "purple" }
              ].map((item, i) => (
                <div key={i} className={`p-3 rounded-lg bg-${item.color}-50 dark:bg-${item.color}-950/30 border border-${item.color}-200 dark:border-${item.color}-800`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-${item.color}-500 flex items-center justify-center`}>
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white">{item.title}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{item.sub}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={handleFinalSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 py-5 text-sm rounded-lg"
            >
              {isLoading ? "Redirecting..." : "Go to Dashboard"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}