"use client"

import { FileText, Gavel, Check } from "lucide-react"

export default function Legal() {
  const legalPoints = [
    "Complete compliance with digital asset inheritance laws across jurisdictions",
    "Legal framework ensures nominee eligibility and asset authenticity verification",
    "Transparent documentation of all transfers for legal proceedings and disputes",
    "Partnership with legal experts to ensure ethical and compliant practices",
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4 mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold">Legal & Ethical Compliance</h2>
          <p className="text-lg text-muted-foreground">
            Built with legal experts to ensure your digital inheritance is protected by law.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
          <div className="flex gap-6 mb-8">
            <div className="flex-shrink-0">
              <Gavel className="text-primary" size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Legal Framework</h3>
              <p className="text-muted-foreground">
                SecureVault operates within established legal frameworks for digital asset management and inheritance
                planning. Every transfer is documented and verifiable for legal proceedings.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {legalPoints.map((point, index) => (
              <div key={index} className="flex gap-3 items-start">
                <Check size={20} className="text-primary flex-shrink-0 mt-1" />
                <p className="text-foreground">{point}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <FileText className="text-secondary flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold mb-1">Documentation</h4>
                  <p className="text-sm text-muted-foreground">
                    All transactions and nominee verifications are permanently documented
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Gavel className="text-accent flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold mb-1">Legal Support</h4>
                  <p className="text-sm text-muted-foreground">Access to legal resources for inheritance planning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
