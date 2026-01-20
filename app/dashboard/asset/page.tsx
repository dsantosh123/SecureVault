"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Eye, Copy, ExternalLink, CheckCircle } from "lucide-react"

interface ReleasedAsset {
  id: string
  name: string
  type: "file" | "credential" | "note" | "video"
  content: string
  releasedAt: string
  expiresAt: string
  viewCount: number
}

function AssetViewContent() {
  const searchParams = useSearchParams()
  const assetToken = searchParams?.get("token")
  const [asset, setAsset] = useState<ReleasedAsset | null>(null)
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!assetToken) {
      setError("Invalid asset link. Please check your email.")
      return
    }

    const timer = setTimeout(() => {
      setAsset({
        id: "asset-1",
        name: "Digital Will - Last Will and Testament",
        type: "file",
        content: `This is your encrypted digital will. The actual file content would be decrypted and displayed here after verification.

[PDF Content Preview]
- Total pages: 5
- Size: 245 KB
- Format: PDF

Access is time-limited and logged for security.`,
        releasedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        expiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        viewCount: 1,
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [assetToken])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleViewContent = async () => {
    setIsDecrypting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setShowContent(true)
    setIsDecrypting(false)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
        <Card className="p-8 max-w-md border border-border">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </Card>
      </div>
    )
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
        <Card className="p-8 max-w-md border border-border">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 animate-pulse">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <p className="text-foreground font-medium">Decrypting asset...</p>
            <p className="text-xs text-muted-foreground">Please wait while we verify and prepare your asset</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent mb-4">
            <Lock className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">SecureVault</h1>
          <p className="text-muted-foreground mt-2">Secure Asset Access</p>
        </div>

        <Card className="p-8 border border-border">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  {asset.type === "file" && <Lock className="w-6 h-6 text-primary" />}
                  {asset.type === "video" && <Eye className="w-6 h-6 text-primary" />}
                </div>
                <span className="text-xs font-semibold text-primary uppercase">{asset.type}</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">{asset.name}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border border-border bg-muted/30">
              <div>
                <p className="text-xs text-muted-foreground">Released On</p>
                <p className="font-semibold text-foreground text-sm">{asset.releasedAt}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Expires On</p>
                <p className="font-semibold text-foreground text-sm">{asset.expiresAt}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Access Count</p>
                <p className="font-semibold text-foreground text-sm">{asset.viewCount}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Encryption</p>
                <p className="font-semibold text-foreground text-sm">AES-256</p>
              </div>
            </div>

            <Alert className="bg-blue-600/10 border-blue-600/30">
              <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-900 dark:text-blue-100 text-sm">
                This asset is encrypted and access is logged. The link will expire on <strong>{asset.expiresAt}</strong>
                . No downloads allowed.
              </AlertDescription>
            </Alert>

            {!showContent ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Click below to decrypt and view the asset content. This action will be logged.
                </p>
                <Button
                  onClick={handleViewContent}
                  disabled={isDecrypting}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold flex items-center justify-center gap-2"
                >
                  {isDecrypting ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                      Decrypting...
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      View Asset Content
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-border bg-muted/50 max-h-64 overflow-y-auto">
                  <p className="text-sm text-foreground whitespace-pre-wrap">{asset.content}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className="flex-1 border-border flex items-center justify-center gap-2 bg-transparent"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </>
                    )}
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
                    disabled
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Download Disabled
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2 p-4 rounded-lg bg-amber-600/10 border border-amber-600/30">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Important:</p>
              <ul className="text-xs text-amber-900 dark:text-amber-100 space-y-1 list-disc list-inside">
                <li>This is a read-only view. You cannot download or export the content.</li>
                <li>All access is logged and monitored for security compliance.</li>
                <li>The link will expire and become invalid after the expiration date.</li>
                <li>Share only with authorized recipients. Each access is tracked.</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="mt-6 p-6 border border-border">
          <h3 className="font-semibold text-foreground mb-3">Need Help?</h3>
          <p className="text-sm text-muted-foreground">
            If you have any issues accessing this asset or need support, please contact our team at{" "}
            <strong>support@securevault.com</strong>
          </p>
        </Card>
      </div>
    </div>
  )
}

export default function AssetViewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AssetViewContent />
    </Suspense>
  )
}
