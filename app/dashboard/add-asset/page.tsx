"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Upload, Users, X, FileText, Video, Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { API_ENDPOINTS, getAuthToken } from "@/lib/api-config"
import { apiPost } from "@/lib/api-client"

interface Nominee {
  id: string
  name: string
  email: string
  mobile: string
}

interface FormData {
  assetType: string
  assetName: string
  description: string
  fileUrl?: string
  fileName?: string
  username?: string
  secret?: string
  credentialNotes?: string
  nominees: Nominee[]
  inactivityPeriod: string
}

export default function AddAssetPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    assetType: "",
    assetName: "",
    description: "",
    nominees: [{ id: "1", name: "", email: "", mobile: "" }],
    inactivityPeriod: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [dataEncryptionConfirmed, setDataEncryptionConfirmed] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const assetTypes = ["Document", "File", "Video", "Credentials", "Crypto", "Other"]

  const inactivityPeriods = [
    { value: "3", label: "3 months" },
    { value: "6", label: "6 months" },
    { value: "12", label: "1 year" },
    { value: "24", label: "2 years" },
  ]

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.assetType) newErrors.assetType = "Asset type is required"
    if (!formData.assetName.trim()) newErrors.assetName = "Asset name is required"
    if (!formData.inactivityPeriod) newErrors.inactivityPeriod = "Inactivity period is required"

    // Validate nominees
    formData.nominees.forEach((nominee, index) => {
      if (!nominee.name.trim()) {
        newErrors[`nominee_${index}_name`] = "Nominee name is required"
      }
      if (!nominee.email.trim()) {
        newErrors[`nominee_${index}_email`] = "Nominee email is required"
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(nominee.email)) {
          newErrors[`nominee_${index}_email`] = "Invalid email address"
        }
      }
      if (!nominee.mobile.trim()) {
        newErrors[`nominee_${index}_mobile`] = "Nominee mobile is required"
      } else {
        const mobileRegex = /^[0-9]{10,15}$/
        if (!mobileRegex.test(nominee.mobile.replace(/[\s-]/g, ''))) {
          newErrors[`nominee_${index}_mobile`] = "Invalid mobile number (10-15 digits)"
        }
      }
    })

    if (formData.assetType === "Document" || formData.assetType === "File" || formData.assetType === "Video") {
      if (!formData.fileUrl) newErrors.fileUrl = "File upload is required for this asset type"
    } else if (formData.assetType === "Credentials") {
      if (!formData.username?.trim()) newErrors.username = "Username is required for credentials"
      if (!formData.secret?.trim()) newErrors.secret = "Password/Secret is required for credentials"
    }

    if (!dataEncryptionConfirmed) newErrors.confirmation = "You must acknowledge the encryption policy"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const saveNomineeToBackend = async (nominee: any) => {
    const response = await apiPost<any>(API_ENDPOINTS.nominees.add, {
      name: nominee.name,
      email: nominee.email,
      relationship: "Primary",
      phoneNumber: nominee.mobile
    });

    if (!response.success) {
      throw new Error(response.error || "Failed to register nominee");
    }
    return response.data; // This returns the nominee with the real ID from DB
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const token = getAuthToken();
      if (!token) throw new Error("Session expired. Please login again.");

      // 1. Save the Nominee first to get a REAL ID
      const savedNominee = await saveNomineeToBackend(formData.nominees[0]);
      const realNomineeId = savedNominee.id;

      // 2. Prepare FormData for the file upload
      const data = new FormData();
      data.append("nomineeId", realNomineeId);
      data.append("description", formData.description || formData.assetName);

      if (fileInputRef.current?.files?.[0]) {
        data.append("file", fileInputRef.current.files[0]);
      } else if (formData.assetType === "Credentials" || formData.assetType === "Crypto" || formData.assetType === "Other") {
        // For text-based assets, we might want to create a virtual file or handle differently
        // currently the backend expects a MultipartFile.
        const content = JSON.stringify({
          type: formData.assetType,
          username: formData.username,
          secret: formData.secret,
          notes: formData.credentialNotes
        });
        const blob = new Blob([content], { type: "application/json" });
        data.append("file", blob, `${formData.assetName}.json`);
      }

      // 3. Upload to Spring Boot
      const response = await apiPost<any>(API_ENDPOINTS.assets.create, data);

      if (!response.success) {
        throw new Error(response.error || "Failed to upload asset");
      }

      setSuccessMessage("Asset successfully encrypted and stored!");
      setTimeout(() => router.push("/dashboard/assets"), 1500);

    } catch (err: any) {
      setErrors({ submit: err.message || "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleNomineeChange = (index: number, field: keyof Nominee, value: string) => {
    const newNominees = [...formData.nominees]
    newNominees[index] = { ...newNominees[index], [field]: value }
    setFormData((prev) => ({ ...prev, nominees: newNominees }))

    const errorKey = `nominee_${index}_${field}`
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }))
    }
  }

  const addNominee = () => {
    if (formData.nominees.length < 3) {
      setFormData((prev) => ({
        ...prev,
        nominees: [...prev.nominees, { id: Date.now().toString(), name: "", email: "", mobile: "" }]
      }))
    }
  }

  const removeNominee = (index: number) => {
    if (formData.nominees.length > 1) {
      const newNominees = formData.nominees.filter((_, i) => i !== index)
      setFormData((prev) => ({ ...prev, nominees: newNominees }))

      // Clear errors for this nominee
      const newErrors = { ...errors }
      delete newErrors[`nominee_${index}_name`]
      delete newErrors[`nominee_${index}_email`]
      delete newErrors[`nominee_${index}_mobile`]
      setErrors(newErrors)
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        fileUrl: URL.createObjectURL(file),
        fileName: file.name
      }))
      if (errors.fileUrl) {
        setErrors((prev) => ({ ...prev, fileUrl: "" }))
      }
    }
  }

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, fileUrl: "", fileName: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getAcceptedFileTypes = () => {
    switch (formData.assetType) {
      case "Video":
        return "video/*"
      case "Document":
        return ".pdf,.doc,.docx,.txt"
      case "File":
        return "*"
      default:
        return "*"
    }
  }

  const renderAssetTypeFields = () => {
    switch (formData.assetType) {
      case "Document":
      case "File":
        return (
          <div className="space-y-2">
            <Label htmlFor="fileUrl" className="text-foreground font-semibold">
              Upload File <span className="text-destructive">*</span>
            </Label>
            {!formData.fileUrl ? (
              <div
                onClick={handleFileSelect}
                className="flex items-center justify-center border-2 border-dashed border-border rounded-lg p-8 hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="text-center">
                  <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.assetType === "Document" ? "PDF, DOC, DOCX, TXT" : "Any file format"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <FileText className="w-8 h-8 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{formData.fileName}</p>
                  <p className="text-xs text-muted-foreground">File ready for upload</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept={getAcceptedFileTypes()}
              className="hidden"
              onChange={handleFileChange}
            />
            {errors.fileUrl && <p className="text-sm text-destructive">{errors.fileUrl}</p>}
          </div>
        )

      case "Video":
        return (
          <div className="space-y-2">
            <Label htmlFor="fileUrl" className="text-foreground font-semibold">
              Upload Video <span className="text-destructive">*</span>
            </Label>
            {!formData.fileUrl ? (
              <div
                onClick={handleFileSelect}
                className="flex items-center justify-center border-2 border-dashed border-border rounded-lg p-8 hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="text-center">
                  <Video className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload video</p>
                  <p className="text-xs text-muted-foreground mt-1">MP4, AVI, MOV, or other video formats</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <Video className="w-8 h-8 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{formData.fileName}</p>
                  <p className="text-xs text-muted-foreground">Video ready for upload</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept={getAcceptedFileTypes()}
              className="hidden"
              onChange={handleFileChange}
            />
            {errors.fileUrl && <p className="text-sm text-destructive">{errors.fileUrl}</p>}
          </div>
        )

      case "Credentials":
        return (
          <div className="space-y-4 p-4 rounded-lg border border-border/50 bg-muted/30">
            <h4 className="font-semibold text-foreground">Credential Details</h4>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                Username <span className="text-destructive">*</span>
              </Label>
              <Input
                id="username"
                name="username"
                placeholder="Username or login"
                value={formData.username || ""}
                onChange={handleInputChange}
                className="bg-input border-border text-foreground placeholder-muted-foreground focus:ring-ring"
              />
              {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="secret" className="text-foreground">
                Password/Secret <span className="text-destructive">*</span>
              </Label>
              <Input
                id="secret"
                name="secret"
                type="password"
                placeholder="Password or secret key"
                value={formData.secret || ""}
                onChange={handleInputChange}
                className="bg-input border-border text-foreground placeholder-muted-foreground focus:ring-ring"
              />
              {errors.secret && <p className="text-sm text-destructive">{errors.secret}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="credentialNotes" className="text-foreground">
                Additional Notes
              </Label>
              <textarea
                id="credentialNotes"
                name="credentialNotes"
                placeholder="Any additional notes or recovery codes"
                value={formData.credentialNotes || ""}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
              />
            </div>
          </div>
        )

      case "Crypto":
      case "Other":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="secret" className="text-foreground font-semibold">
                Asset Details/Keys <span className="text-destructive">*</span>
              </Label>
              <textarea
                id="secret"
                name="secret"
                placeholder="Enter private keys, seed phrases, or other sensitive information"
                value={formData.secret || ""}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none font-mono text-sm"
              />
              {errors.secret && <p className="text-sm text-destructive">{errors.secret}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUrl" className="text-foreground">
                Optional: Upload Supporting Document
              </Label>
              {!formData.fileUrl ? (
                <div
                  onClick={handleFileSelect}
                  className="flex items-center justify-center border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Upload a file (optional)</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{formData.fileName}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept={getAcceptedFileTypes()}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto p-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Add Digital Asset</h1>
        <p className="text-muted-foreground">Securely store and assign digital assets to up to 3 nominees</p>
      </div>

      <Card className="p-8 border border-border">
        {successMessage && (
          <Alert className="mb-6 bg-green-500/10 border-green-500/50">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-600 dark:text-green-400">{successMessage}</AlertDescription>
          </Alert>
        )}

        {errors.submit && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.submit}</AlertDescription>
          </Alert>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="assetType" className="text-foreground font-semibold">
              Asset Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.assetType}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, assetType: value, fileUrl: "", fileName: "" }))
                if (errors.assetType) setErrors((prev) => ({ ...prev, assetType: "" }))
              }}
            >
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {assetTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.assetType && <p className="text-sm text-destructive">{errors.assetType}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetName" className="text-foreground font-semibold">
              Asset Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="assetName"
              name="assetName"
              placeholder="e.g., Bank Account Password"
              value={formData.assetName}
              onChange={handleInputChange}
              className="bg-input border-border text-foreground placeholder-muted-foreground focus:ring-ring"
            />
            {errors.assetName && <p className="text-sm text-destructive">{errors.assetName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground font-semibold">
              Description
            </Label>
            <textarea
              id="description"
              name="description"
              placeholder="Add any relevant details about this asset"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
            />
          </div>

          {formData.assetType && (
            <div className="p-4 rounded-lg border border-border/50 bg-muted/30">{renderAssetTypeFields()}</div>
          )}

          <div className="space-y-4 p-6 rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Nominee Details <span className="text-destructive">*</span>
                <span className="text-xs font-normal text-muted-foreground ml-2">
                  ({formData.nominees.length} of 3)
                </span>
              </h3>
              {formData.nominees.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addNominee}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Nominee
                </Button>
              )}
            </div>

            <Alert className="bg-blue-500/10 border-blue-500/50">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-600 dark:text-blue-400 text-sm">
                Nominees are registered silently and will be invited for verification only after the inactivity trigger
                is activated. You can add up to 3 nominees.
              </AlertDescription>
            </Alert>

            <div className="space-y-6">
              {formData.nominees.map((nominee, index) => (
                <div key={nominee.id} className="p-4 rounded-lg border border-border bg-card/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">Nominee {index + 1}</h4>
                    {formData.nominees.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNominee(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`nominee-${index}-name`} className="text-foreground">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`nominee-${index}-name`}
                      placeholder="Full name of nominee"
                      value={nominee.name}
                      onChange={(e) => handleNomineeChange(index, "name", e.target.value)}
                      className="bg-input border-border text-foreground placeholder-muted-foreground focus:ring-ring"
                    />
                    {errors[`nominee_${index}_name`] && (
                      <p className="text-sm text-destructive">{errors[`nominee_${index}_name`]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`nominee-${index}-email`} className="text-foreground">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`nominee-${index}-email`}
                      type="email"
                      placeholder="nominee@example.com"
                      value={nominee.email}
                      onChange={(e) => handleNomineeChange(index, "email", e.target.value)}
                      className="bg-input border-border text-foreground placeholder-muted-foreground focus:ring-ring"
                    />
                    {errors[`nominee_${index}_email`] && (
                      <p className="text-sm text-destructive">{errors[`nominee_${index}_email`]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`nominee-${index}-mobile`} className="text-foreground">
                      Mobile Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`nominee-${index}-mobile`}
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={nominee.mobile}
                      onChange={(e) => handleNomineeChange(index, "mobile", e.target.value)}
                      className="bg-input border-border text-foreground placeholder-muted-foreground focus:ring-ring"
                    />
                    {errors[`nominee_${index}_mobile`] && (
                      <p className="text-sm text-destructive">{errors[`nominee_${index}_mobile`]}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inactivityPeriod" className="text-foreground font-semibold">
              Inactivity Trigger Period <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.inactivityPeriod}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, inactivityPeriod: value }))
                if (errors.inactivityPeriod) setErrors((prev) => ({ ...prev, inactivityPeriod: "" }))
              }}
            >
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue placeholder="Select inactivity period" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {inactivityPeriods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.inactivityPeriod && <p className="text-sm text-destructive">{errors.inactivityPeriod}</p>}
            <p className="text-xs text-muted-foreground mt-2">
              If you don't login for the selected period, nominees will be invited for verification.
            </p>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg border border-border/50 bg-muted/30">
            <Checkbox
              id="dataEncryption"
              checked={dataEncryptionConfirmed}
              onCheckedChange={(checked) => {
                setDataEncryptionConfirmed(checked as boolean)
                if (errors.confirmation) {
                  setErrors((prev) => ({ ...prev, confirmation: "" }))
                }
              }}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="dataEncryption" className="text-sm text-foreground cursor-pointer">
                I understand my data is encrypted and cannot be recovered if my credentials are lost.
              </Label>
              {errors.confirmation && <p className="text-sm text-destructive mt-1">{errors.confirmation}</p>}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold py-6 text-base"
          >
            {isLoading ? "Adding Asset..." : "Add Asset Securely"}
          </Button>
        </form>
      </Card>

      <Card className="p-4 border border-border bg-accent/5">
        <h4 className="font-semibold text-foreground mb-2">Security & Privacy</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>✓ All assets are encrypted end-to-end</li>
          <li>✓ Nominees are never notified when added</li>
          <li>✓ Multiple nominees can be assigned for redundancy</li>
          <li>✓ Nominees must verify their identity before receiving assets</li>
          <li>✓ Audit logs track all access and changes</li>
        </ul>
      </Card>
    </div>
  )
}