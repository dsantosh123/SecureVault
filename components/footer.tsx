"use client"

import { Mail, Linkedin, Twitter, Github } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-sm">SV</span>
              </div>
              <span className="font-bold">SecureVault</span>
            </div>
            <p className="text-sm text-muted-foreground">Securing your digital legacy for generations to come.</p>
            <div className="flex gap-3">
              <button className="w-8 h-8 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition">
                <Mail size={16} />
              </button>
              <button className="w-8 h-8 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition">
                <Linkedin size={16} />
              </button>
              <button className="w-8 h-8 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition">
                <Twitter size={16} />
              </button>
              <button className="w-8 h-8 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition">
                <Github size={16} />
              </button>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  API Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Compliance
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {currentYear} SecureVault. All rights reserved.</p>
          <p>Made with security and trust in mind.</p>
        </div>
      </div>
    </footer>
  )
}
