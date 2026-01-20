"use client"

import { Shield, Lock, Server, Zap, Eye, Layers } from "lucide-react"

export default function Security() {
  const securityFeatures = [
    {
      icon: Lock,
      title: "AES-256 Encryption",
      description: "Military-grade encryption standard used by governments and financial institutions.",
    },
    {
      icon: Shield,
      title: "End-to-End Security",
      description: "Data encrypted from the moment of upload until verified access by nominees.",
    },
    {
      icon: Layers,
      title: "Blockchain Logging",
      description: "Immutable audit trail of all transactions and access events on distributed ledger.",
    },
    {
      icon: Eye,
      title: "Zero-Knowledge Architecture",
      description: "We cannot access your data. Only you and nominees hold decryption keys.",
    },
    {
      icon: Server,
      title: "Redundant Infrastructure",
      description: "Data replicated across geographically distributed secure data centers.",
    },
    {
      icon: Zap,
      title: "Real-Time Threat Detection",
      description: "AI-powered monitoring detects and prevents unauthorized access attempts.",
    },
  ]

  return (
    <section id="security" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="space-y-4 mb-16 text-center">
          <div className="inline-block bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
            <span className="text-sm font-medium text-primary">🛡️ Enterprise Security</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">Bank-Grade Security Standards</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our security infrastructure meets GDPR, SOC 2, and ISO 27001 compliance standards.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur hover:border-primary/50 hover:bg-card transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* Compliance badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {["GDPR Compliant", "SOC 2 Type II", "ISO 27001", "99.99% Uptime"].map((badge, index) => (
            <div key={index} className="p-4 rounded-lg border border-border bg-card/50 text-center">
              <p className="font-semibold text-sm">{badge}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
