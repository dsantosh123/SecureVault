import Navigation from "@/components/navigation"
import Hero from "@/components/sections/hero"
import Problem from "@/components/sections/problem"
import Solution from "@/components/sections/solution"
import HowItWorks from "@/components/sections/how-it-works"
import Security from "@/components/sections/security"
import Legal from "@/components/sections/legal"
import CTA from "@/components/sections/cta"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <Security />
      <Legal />
      <CTA />
      <Footer />
    </main>
  )
}
