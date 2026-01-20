"use client"

import { CheckCircle, Zap, Lock, FileCheck } from "lucide-react"

export default function Solution() {
  const features = [
    {
      icon: Lock,
      title: "Military-Grade Encryption",
      description: "End-to-end AES-256 encryption ensures your assets are protected at rest and in transit.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: CheckCircle,
      title: "Nominee Verification",
      description: "Two-factor OTP verification and document validation ensure only rightful nominees gain access.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Inactivity Triggers",
      description: "Set custom inactivity periods. If you don't log in, the transfer process automatically initiates.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: FileCheck,
      title: "Blockchain Audit Trail",
      description: "Every action is logged on blockchain for immutable verification and complete transparency.",
      color: "from-emerald-500 to-teal-500",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4 mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold">Our Solution</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            SecureVault combines cutting-edge encryption, blockchain verification, and smart nominee management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative p-8 rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all duration-300"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 text-white`}
                >
                  <Icon size={28} />
                </div>

                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
