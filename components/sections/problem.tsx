"use client"

import { AlertCircle, FileText, Lock, User } from "lucide-react"

export default function Problem() {
  const problems = [
    {
      icon: FileText,
      title: "Digital Chaos",
      description: "Passwords, accounts, and digital assets scattered across platforms with no organized access plan.",
    },
    {
      icon: Lock,
      title: "Security Nightmare",
      description:
        "Sharing credentials to protect assets is risky. Traditional solutions lack encryption and verification.",
    },
    {
      icon: User,
      title: "Nominee Dilemma",
      description: "How do nominees prove identity? How to ensure assets transfer only after verification?",
    },
    {
      icon: AlertCircle,
      title: "Legal Complexity",
      description:
        "Digital inheritance laws are unclear. Without proper documentation, assets can be permanently lost.",
    },
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4 mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold">The Problem Nobody Talks About</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Digital assets are valuable but vulnerable. Most people have no secure way to manage or transfer them.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => {
            const Icon = problem.icon
            return (
              <div
                key={index}
                className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition">
                  <Icon size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{problem.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{problem.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
