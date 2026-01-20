"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Star, Loader2 } from "lucide-react"

interface PricingPlan {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted: boolean
  cta: string
  stripePriceId?: string
}

interface PaymentState {
  isLoading: boolean
  selectedPlan: string | null
  error: string | null
  showPaymentModal: boolean
}

export default function PricingPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [paymentState, setPaymentState] = useState<PaymentState>({
    isLoading: false,
    selectedPlan: null,
    error: null,
    showPaymentModal: false,
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/signup")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const plans: PricingPlan[] = [
    {
      id: "free",
      name: "Free Plan",
      price: "₹0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Up to 3 digital assets",
        "Email-based nominee verification",
        "Basic security features",
        "Standard inactivity periods",
        "Limited storage (500MB)",
        "Community support",
      ],
      highlighted: false,
      cta: "Start Free",
    },
    {
      id: "plus",
      name: "Plus Plan",
      price: "₹199",
      period: "per month",
      description: "Best for most users",
      features: [
        "Up to 20 digital assets",
        "Video message support",
        "Enhanced encryption",
        "Flexible inactivity rules",
        "Increased storage (5GB)",
        "Priority email support",
        "Activity timeline & logs",
        "Multi-nominee management",
      ],
      highlighted: true,
      cta: "Upgrade to Plus",
      stripePriceId: "price_plus_inr",
    },
    {
      id: "premium",
      name: "Premium Plan",
      price: "₹499",
      period: "per month",
      description: "For power users",
      features: [
        "Unlimited digital assets",
        "Video & voice message support",
        "Military-grade encryption",
        "Custom inactivity periods",
        "Unlimited storage",
        "24/7 priority support",
        "Advanced analytics & reporting",
        "Dedicated account manager",
        "Legal consultation included",
        "Multi-language support",
      ],
      highlighted: false,
      cta: "Upgrade to Premium",
      stripePriceId: "price_premium_inr",
    },
  ]

  const handleUpgrade = async (planId: string) => {
    if (planId === "free") {
      // Direct downgrade to free
      const updatedUser = { ...user, plan: "free", currentPlan: { name: "Free", price: "₹0" } }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      router.push("/dashboard")
      return
    }

    setPaymentState({ ...paymentState, selectedPlan: planId, showPaymentModal: true })
  }

  const handlePayment = async () => {
    const plan = plans.find((p) => p.id === paymentState.selectedPlan)
    if (!plan) return

    setPaymentState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Simulate payment processing with Stripe
      // In production, this would call your backend to create a Stripe checkout session
      console.log("[v0] Processing payment for plan:", paymentState.selectedPlan)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update user with new plan
      const updatedUser = {
        ...user,
        plan: paymentState.selectedPlan,
        currentPlan: { name: plan.name, price: plan.price, period: plan.period },
        planUpgradedAt: new Date().toISOString(),
      }
      localStorage.setItem("user", JSON.stringify(updatedUser))

      console.log("[v0] Payment successful, redirecting to dashboard")

      // Close modal and redirect
      setPaymentState({
        isLoading: false,
        selectedPlan: null,
        error: null,
        showPaymentModal: false,
      })

      setTimeout(() => {
        router.push("/dashboard")
      }, 500)
    } catch (err) {
      console.log("[v0] Payment error:", err)
      setPaymentState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Payment failed. Please try again.",
      }))
    }
  }

  const currentPlan = user?.plan || "free"

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
            </div>
            <span className="font-bold text-lg">SecureVault</span>
          </div>
          <Button onClick={() => router.push("/dashboard")} variant="outline" className="border-border bg-transparent">
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your digital asset protection needs. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 flex flex-col ${
                plan.highlighted
                  ? "border-primary/80 shadow-lg scale-105 md:scale-100"
                  : "border-border hover:border-primary/30"
              }`}
            >
              {/* Highlight Badge */}
              {plan.highlighted && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
              )}

              {plan.highlighted && (
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  <Star className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              {/* Current Plan Badge */}
              {currentPlan === plan.id && (
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  <CheckCircle className="w-3 h-3" />
                  Current Plan
                </div>
              )}

              <div className="p-6 space-y-4 flex-1">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 pt-4 border-t border-border">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="p-6 border-t border-border">
                <Button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={currentPlan === plan.id}
                  className={`w-full font-semibold flex items-center justify-center gap-2 transition-all ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
                      : "bg-transparent border border-border hover:bg-muted text-foreground"
                  } ${currentPlan === plan.id ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {currentPlan === plan.id ? "Current Plan" : `${plan.cta} →`}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card className="p-8 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Can I change my plan later?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, you can upgrade or downgrade your plan anytime from your dashboard. Changes take effect
                immediately.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">What happens when I cancel?</h3>
              <p className="text-muted-foreground text-sm">
                Your assets remain safe and encrypted. You'll be downgraded to the Free plan with limited features.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, we offer a 30-day money-back guarantee if you're not satisfied. No questions asked.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Is there a contract?</h3>
              <p className="text-muted-foreground text-sm">
                No long-term contract required. You can cancel your subscription at any time with no penalties.
              </p>
            </div>
          </div>
        </Card>

        {/* Benefits Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border border-border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Bank-Grade Security</h3>
            <p className="text-sm text-muted-foreground">
              AES-256 encryption for all your digital assets with blockchain verification logs.
            </p>
          </Card>

          <Card className="p-6 border border-border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Lifetime Access</h3>
            <p className="text-sm text-muted-foreground">
              Your assets are permanently secured and accessible 24/7 whenever you need them.
            </p>
          </Card>

          <Card className="p-6 border border-border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5-4a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Expert Support</h3>
            <p className="text-sm text-muted-foreground">
              Our team is available to help you secure and manage your digital inheritance.
            </p>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      {paymentState.showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border border-border p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Complete Payment</h2>
              <p className="text-muted-foreground">{plans.find((p) => p.id === paymentState.selectedPlan)?.name}</p>
            </div>

            {paymentState.error && (
              <div className="p-4 rounded-lg bg-red-600/10 border border-red-600/30 text-sm text-red-600">
                {paymentState.error}
              </div>
            )}

            {/* Simulated Payment Form */}
            <div className="space-y-4 border-t border-b border-border py-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Card Number</label>
                <div className="p-3 rounded-lg border border-border bg-card text-muted-foreground text-sm">
                  4242 4242 4242 4242 (Demo)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Expiry</label>
                  <div className="p-3 rounded-lg border border-border bg-card text-muted-foreground text-sm">
                    12/25 (Demo)
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">CVV</label>
                  <div className="p-3 rounded-lg border border-border bg-card text-muted-foreground text-sm">
                    123 (Demo)
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Amount to be charged:</p>
                <p className="text-2xl font-bold text-primary">
                  {plans.find((p) => p.id === paymentState.selectedPlan)?.price}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setPaymentState({ ...paymentState, showPaymentModal: false, error: null })}
                variant="outline"
                className="flex-1 border-border"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={paymentState.isLoading}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold"
              >
                {paymentState.isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Payment
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              This is a demo payment flow. In production, this integrates with Stripe.
            </p>
          </Card>
        </div>
      )}
    </div>
  )
}
