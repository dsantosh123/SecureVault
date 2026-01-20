"use client"

import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Hero() {
  const router = useRouter()

  return (
    <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-block bg-primary/10 border border-primary/30 rounded-full px-4 py-2">
              <span className="text-sm font-medium text-primary">🔐 Bank-Grade Security</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-balance">
              Your Digital Legacy,{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Perfectly Secured
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              SecureVault is the world's first nominee-based secure digital asset transfer platform. Protect your
              digital wealth and ensure it reaches your loved ones with military-grade encryption and blockchain
              verification.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => router.push('/login')}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 group"
              >
                Start Securing <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
              </button>
              <button className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/10 transition">
                Watch Demo
              </button>
            </div>

            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold">10K+</p>
                <p className="text-sm text-muted-foreground">Assets Secured</p>
              </div>
              <div>
                <p className="text-3xl font-bold">$500M+</p>
                <p className="text-sm text-muted-foreground">Total Value Protected</p>
              </div>
              <div>
                <p className="text-3xl font-bold">99.99%</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative w-full h-[600px]">
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-3xl" />
              
              {/* Hero Image */}
              <img 
                src="/herosection.png" 
                alt="SecureVault Digital Security" 
                className="relative z-10 w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}