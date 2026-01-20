"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"

export default function CTA() {
  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">Secure Your Digital Legacy Today</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users protecting their digital wealth with SecureVault. Start with 3 assets free—no credit
            card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/signup" className="block">
              <button className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 group">
                Create Free Account <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
              </button>
            </Link>
            <Link href="/login" className="block">
              <button className="w-full border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary/10 transition">
                Login
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-border">
            {["No credit card needed", "Setup takes 5 minutes", "Free forever tier included"].map((item, index) => (
              <div key={index} className="flex items-center justify-center gap-2">
                <CheckCircle size={20} className="text-accent" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
