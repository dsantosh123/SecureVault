"use client"

import { useState, useEffect, SetStateAction } from 'react'

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [progress, setProgress] = useState(0)

  const steps = [
    {
      number: "01",
      title: "Create Account",
      description: "Sign up and verify your identity with multi-factor authentication for maximum security.",
      icon: "👤",
      color: "from-blue-500 to-cyan-500",
      details: ["Multi-factor authentication", "Secure encryption", "Identity verification"]
    },
    {
      number: "02",
      title: "Add Digital Assets",
      description: "Upload documents, credentials, and asset details. Each asset requires a designated nominee.",
      icon: "📁",
      color: "from-purple-500 to-pink-500",
      details: ["Document upload", "Asset cataloging", "Secure storage"]
    },
    {
      number: "03",
      title: "Set Nominees",
      description: "Specify nominees and set the inactivity period (30-365 days). Nominees are not immediately notified.",
      icon: "👥",
      color: "from-green-500 to-emerald-500",
      details: ["Nominee selection", "Period configuration", "Privacy maintained"]
    },
    {
      number: "04",
      title: "Inactivity Trigger",
      description: "After the inactivity period, nominees receive a secure link to verify their identity via OTP.",
      icon: "⏰",
      color: "from-orange-500 to-red-500",
      details: ["Automatic monitoring", "Secure notification", "OTP generation"]
    },
    {
      number: "05",
      title: "Verification Process",
      description: "Nominees upload verification documents and complete identity confirmation securely.",
      icon: "✓",
      color: "from-indigo-500 to-purple-500",
      details: ["Document verification", "Identity confirmation", "Secure validation"]
    },
    {
      number: "06",
      title: "Asset Transfer",
      description: "After verification, nominees gain decrypted access to their assigned assets via secure portal.",
      icon: "🔐",
      color: "from-teal-500 to-cyan-500",
      details: ["Decryption process", "Secure access", "Asset delivery"]
    },
  ]

 useEffect(() => {
    if (!isAutoPlaying) return

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2
        if (newProgress >= 100) {
          setActiveStep((current) => (current + 1) % steps.length)
          return 0
        }
        return newProgress
      })
    }, 100)

    return () => clearInterval(progressInterval)
  }, [isAutoPlaying, steps.length])

  const handleStepClick = (index: SetStateAction<number>) => {
    setActiveStep(index)
    setProgress(0)
    setIsAutoPlaying(false)
  }

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="space-y-4 mb-20 text-center">
          <div className="inline-block animate-bounce">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
              Step-by-Step Process
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A simple six-step process designed for maximum security and ease of use.
          </p>
        </div>

        {/* Interactive Step Visualization - Desktop & Tablet */}
        <div className="hidden md:block mb-16">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-8 shadow-2xl">
            {/* Step indicators */}
            <div className="flex justify-between items-center mb-12 relative">
              {/* Progress line background */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted/30 rounded-full -translate-y-1/2"></div>
              
              {/* Animated progress line */}
              <div 
                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500 -translate-y-1/2"
                style={{ 
                  width: `${(activeStep / (steps.length - 1)) * 100}%` 
                }}
              ></div>

              {/* Step buttons */}
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => handleStepClick(index)}
                  className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    index <= activeStep
                      ? `bg-gradient-to-br ${step.color} text-white shadow-lg scale-110`
                      : 'bg-muted text-muted-foreground hover:scale-105'
                  }`}
                >
                  {index < activeStep ? '✓' : step.number}
                </button>
              ))}
            </div>

            {/* Active step content */}
            <div className="grid md:grid-cols-2 gap-8 items-center min-h-[400px]">
              {/* Left side - Visual */}
              <div className="relative">
                <div className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${steps[activeStep].color} p-1 animate-pulse`}>
                  <div className="w-full h-full bg-card rounded-xl flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="text-8xl animate-bounce">{steps[activeStep].icon}</div>
                      <div className={`text-2xl font-bold bg-gradient-to-r ${steps[activeStep].color} bg-clip-text text-transparent`}>
                        Step {steps[activeStep].number}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Progress ring */}
                {isAutoPlaying && (
                  <svg className="absolute -top-2 -right-2 w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-muted/30"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
                      className="text-primary transition-all duration-100"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>

              {/* Right side - Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold mb-3">{steps[activeStep].title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {steps[activeStep].description}
                  </p>
                </div>

                <div className="space-y-3">
                  {steps[activeStep].details.map((detail, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-3 bg-muted/30 p-3 rounded-lg transform transition-all duration-300 hover:scale-105"
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${steps[activeStep].color}`}></div>
                      <span className="text-sm font-medium">{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setActiveStep((prev) => (prev - 1 + steps.length) % steps.length)
                      setProgress(0)
                      setIsAutoPlaying(false)
                    }}
                    className="px-6 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors font-medium"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => {
                      setActiveStep((prev) => (prev + 1) % steps.length)
                      setProgress(0)
                      setIsAutoPlaying(false)
                    }}
                    className={`px-6 py-2 rounded-lg bg-gradient-to-r ${steps[activeStep].color} text-white hover:opacity-90 transition-opacity font-medium flex-1`}
                  >
                    Next →
                  </button>
                  <button
                    onClick={() => {
                      setIsAutoPlaying(!isAutoPlaying)
                      setProgress(0)
                    }}
                    className="px-4 py-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    title={isAutoPlaying ? "Pause" : "Play"}
                  >
                    {isAutoPlaying ? '⏸' : '▶'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Timeline - All Steps Visible */}
        <div className="md:hidden space-y-6">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex gap-5 group transition-all duration-300 ${
                activeStep === index ? 'scale-105' : 'opacity-70 hover:opacity-100'
              }`}
              onClick={() => handleStepClick(index)}
            >
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${step.color} flex flex-col items-center justify-center text-white font-bold shadow-lg transition-all duration-300 border-2 ${
                  activeStep === index ? 'border-white scale-110' : 'border-transparent'
                }`}>
                  <span className="text-xl mb-0.5">{step.icon}</span>
                  <span className="text-sm">{step.number}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-0.5 h-16 bg-gradient-to-b ${step.color} mt-3 transition-all duration-300 ${
                    index < activeStep ? 'opacity-100' : 'opacity-30'
                  }`} />
                )}
              </div>
              <div className={`flex-1 pt-1 pb-8 backdrop-blur-sm p-5 rounded-xl border transition-all duration-300 ${
                activeStep === index 
                  ? `bg-card/80 border-primary/50 shadow-lg shadow-primary/10` 
                  : 'bg-card/30 border-border/50'
              }`}>
                <h3 className="font-semibold text-lg mb-2 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm mb-3">{step.description}</p>
                
                {activeStep === index && (
                  <div className="space-y-2 mt-4 animate-fadeIn">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${step.color}`}></div>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-card/30 backdrop-blur-sm rounded-xl border border-border/50">
            <div className="text-3xl font-bold text-primary mb-2">6</div>
            <div className="text-sm text-muted-foreground">Simple Steps</div>
          </div>
          <div className="text-center p-6 bg-card/30 backdrop-blur-sm rounded-xl border border-border/50">
            <div className="text-3xl font-bold text-primary mb-2">100%</div>
            <div className="text-sm text-muted-foreground">Secure Process</div>
          </div>
          <div className="text-center p-6 bg-card/30 backdrop-blur-sm rounded-xl border border-border/50">
            <div className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              24/7
            </div>
            <div className="text-sm text-muted-foreground">Automated Protection</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  )
}