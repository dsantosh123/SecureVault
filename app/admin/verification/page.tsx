"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  FileText,
  User,
  Calendar,
  Download,
  Search,
  Filter,
  X,
  Check,
  RotateCcw
} from "lucide-react"

interface VerificationRequest {
  id: string
  nomineeEmail: string
  nomineeName: string
  nomineePhone: string
  relationship: string
  userId: string
  userRegistration: string
  userLastLogin: string
  userInactivityPeriod: string
  assetId: string
  assetType: string
  assetCount: number
  deathCertificateUrl: string
  legalDeclarationUrl: string
  idProofUrl: string
  status: "pending" | "approved" | "rejected" | "awaiting_docs"
  priority: "high" | "medium" | "low"
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  adminNotes?: string
  rejectionReason?: string
}

export default function VerificationPage() {
  const [requests, setRequests] = useState<VerificationRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<VerificationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected" | "awaiting_docs">("all")
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "medium" | "low">("all")
  const [actionLoading, setActionLoading] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [showDocumentViewer, setShowDocumentViewer] = useState(false)
  const [currentDocument, setCurrentDocument] = useState<string>("")

  useEffect(() => {
    fetchVerificationRequests()
  }, [])

  useEffect(() => {
    filterRequests()
  }, [requests, searchTerm, statusFilter, priorityFilter])

  const fetchVerificationRequests = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockData: VerificationRequest[] = [
        {
          id: "VER-8825",
          nomineeEmail: "john.nominee@example.com",
          nomineeName: "John Doe",
          nomineePhone: "+1 234-567-8900",
          relationship: "Son",
          userId: "U-12345",
          userRegistration: "Jan 15, 2023",
          userLastLogin: "Dec 20, 2024",
          userInactivityPeriod: "180 days",
          assetId: "AST-999",
          assetType: "Digital Will",
          assetCount: 3,
          deathCertificateUrl: "/documents/death-cert-001.pdf",
          legalDeclarationUrl: "/documents/legal-dec-001.pdf",
          idProofUrl: "/documents/id-proof-001.pdf",
          status: "pending",
          priority: "high",
          submittedAt: "5 hours ago"
        },
        {
          id: "VER-8824",
          nomineeEmail: "sarah.nominee@example.com",
          nomineeName: "Sarah Smith",
          nomineePhone: "+1 234-567-8901",
          relationship: "Daughter",
          userId: "U-12346",
          userRegistration: "Mar 10, 2023",
          userLastLogin: "Jan 05, 2025",
          userInactivityPeriod: "180 days",
          assetId: "AST-998",
          assetType: "Crypto Wallet",
          assetCount: 5,
          deathCertificateUrl: "/documents/death-cert-002.pdf",
          legalDeclarationUrl: "/documents/legal-dec-002.pdf",
          idProofUrl: "/documents/id-proof-002.pdf",
          status: "pending",
          priority: "high",
          submittedAt: "8 hours ago"
        },
        {
          id: "VER-8823",
          nomineeEmail: "mike.nominee@example.com",
          nomineeName: "Mike Johnson",
          nomineePhone: "+1 234-567-8902",
          relationship: "Brother",
          userId: "U-12347",
          userRegistration: "Jun 20, 2023",
          userLastLogin: "Jan 10, 2025",
          userInactivityPeriod: "90 days",
          assetId: "AST-997",
          assetType: "Bank Credentials",
          assetCount: 2,
          deathCertificateUrl: "/documents/death-cert-003.pdf",
          legalDeclarationUrl: "",
          idProofUrl: "/documents/id-proof-003.pdf",
          status: "awaiting_docs",
          priority: "medium",
          submittedAt: "1 day ago"
        },
        {
          id: "VER-8822",
          nomineeEmail: "emma.nominee@example.com",
          nomineeName: "Emma Wilson",
          nomineePhone: "+1 234-567-8903",
          relationship: "Wife",
          userId: "U-12348",
          userRegistration: "Feb 5, 2023",
          userLastLogin: "Jan 08, 2025",
          userInactivityPeriod: "180 days",
          assetId: "AST-996",
          assetType: "Digital Will",
          assetCount: 4,
          deathCertificateUrl: "/documents/death-cert-004.pdf",
          legalDeclarationUrl: "/documents/legal-dec-004.pdf",
          idProofUrl: "/documents/id-proof-004.pdf",
          status: "approved",
          priority: "medium",
          submittedAt: "2 days ago",
          reviewedAt: "1 day ago",
          reviewedBy: "admin@securevault-admin.com",
          adminNotes: "All documents verified. Identity confirmed."
        },
        {
          id: "VER-8821",
          nomineeEmail: "alex.nominee@example.com",
          nomineeName: "Alex Brown",
          nomineePhone: "+1 234-567-8904",
          relationship: "Son",
          userId: "U-12349",
          userRegistration: "Apr 12, 2023",
          userLastLogin: "Jan 12, 2025",
          userInactivityPeriod: "180 days",
          assetId: "AST-995",
          assetType: "Password Manager",
          assetCount: 1,
          deathCertificateUrl: "/documents/death-cert-005.pdf",
          legalDeclarationUrl: "/documents/legal-dec-005.pdf",
          idProofUrl: "/documents/id-proof-005.pdf",
          status: "rejected",
          priority: "low",
          submittedAt: "3 days ago",
          reviewedAt: "2 days ago",
          reviewedBy: "admin@securevault-admin.com",
          rejectionReason: "Death certificate appears to be tampered with",
          adminNotes: "Requested re-upload of death certificate"
        }
      ]
      setRequests(mockData)
      setLoading(false)
    }, 1000)
  }

  const filterRequests = () => {
    let filtered = requests

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(req => req.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(req => req.priority === priorityFilter)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(req => 
        req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.nomineeEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.nomineeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.userId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredRequests(filtered)
  }

  const handleApprove = async () => {
    if (!selectedRequest || !adminNotes.trim()) {
      alert("Please add admin notes before approving")
      return
    }

    setActionLoading(true)
    // Simulate API call
    setTimeout(() => {
      // Update request status
      setRequests(prev => prev.map(req => 
        req.id === selectedRequest.id 
          ? { 
              ...req, 
              status: "approved" as const,
              reviewedAt: new Date().toLocaleString(),
              reviewedBy: localStorage.getItem("adminEmail") || "admin",
              adminNotes: adminNotes
            }
          : req
      ))
      
      // Log action
      console.log("AUDIT LOG:", {
        action: "APPROVE_VERIFICATION",
        verificationId: selectedRequest.id,
        adminEmail: localStorage.getItem("adminEmail"),
        timestamp: new Date().toISOString(),
        notes: adminNotes
      })

      setActionLoading(false)
      setShowModal(false)
      setAdminNotes("")
      alert("Verification approved successfully!")
    }, 1500)
  }

  const handleReject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      alert("Please provide a rejection reason")
      return
    }

    setActionLoading(true)
    setTimeout(() => {
      setRequests(prev => prev.map(req => 
        req.id === selectedRequest.id 
          ? { 
              ...req, 
              status: "rejected" as const,
              reviewedAt: new Date().toLocaleString(),
              reviewedBy: localStorage.getItem("adminEmail") || "admin",
              rejectionReason: rejectionReason,
              adminNotes: adminNotes
            }
          : req
      ))
      
      console.log("AUDIT LOG:", {
        action: "REJECT_VERIFICATION",
        verificationId: selectedRequest.id,
        adminEmail: localStorage.getItem("adminEmail"),
        timestamp: new Date().toISOString(),
        reason: rejectionReason,
        notes: adminNotes
      })

      setActionLoading(false)
      setShowModal(false)
      setRejectionReason("")
      setAdminNotes("")
      alert("Verification rejected and nominee notified")
    }, 1500)
  }

  const handleRequestDocs = async () => {
    if (!selectedRequest || !adminNotes.trim()) {
      alert("Please specify which documents are needed")
      return
    }

    setActionLoading(true)
    setTimeout(() => {
      setRequests(prev => prev.map(req => 
        req.id === selectedRequest.id 
          ? { 
              ...req, 
              status: "awaiting_docs" as const,
              adminNotes: adminNotes
            }
          : req
      ))
      
      console.log("AUDIT LOG:", {
        action: "REQUEST_DOCUMENTS",
        verificationId: selectedRequest.id,
        adminEmail: localStorage.getItem("adminEmail"),
        timestamp: new Date().toISOString(),
        notes: adminNotes
      })

      setActionLoading(false)
      setShowModal(false)
      setAdminNotes("")
      alert("Document re-upload request sent to nominee")
    }, 1500)
  }

  const viewDocument = (url: string) => {
    setCurrentDocument(url)
    setShowDocumentViewer(true)
    
    // Log document view
    console.log("AUDIT LOG:", {
      action: "VIEW_DOCUMENT",
      verificationId: selectedRequest?.id,
      documentUrl: url,
      adminEmail: localStorage.getItem("adminEmail"),
      timestamp: new Date().toISOString()
    })
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: <Badge className="bg-yellow-500 text-yellow-950 font-semibold">Pending Review</Badge>,
      approved: <Badge className="bg-green-500 text-green-950 font-semibold">Approved</Badge>,
      rejected: <Badge className="bg-red-500 text-red-950 font-semibold">Rejected</Badge>,
      awaiting_docs: <Badge className="bg-orange-500 text-orange-950 font-semibold">Awaiting Documents</Badge>
    }
    return badges[status as keyof typeof badges]
  }

  const getPriorityBadge = (priority: string) => {
    const badges = {
      high: <Badge className="bg-red-500 text-red-950 font-semibold">High Priority</Badge>,
      medium: <Badge className="bg-yellow-500 text-yellow-950 font-semibold">Medium</Badge>,
      low: <Badge className="bg-blue-500 text-blue-950 font-semibold">Low</Badge>
    }
    return badges[priority as keyof typeof badges]
  }

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    rejected: requests.filter(r => r.status === "rejected").length,
    awaiting: requests.filter(r => r.status === "awaiting_docs").length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Loading verification requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Verification Requests
        </h1>
        <p className="text-muted-foreground mt-1">
          Review and manage nominee verification requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 border-border hover:shadow-lg transition-all">
          <p className="text-xs text-muted-foreground mb-1 font-medium">Total Requests</p>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </Card>
        <Card className="p-4 border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 hover:shadow-lg transition-all">
          <p className="text-xs text-muted-foreground mb-1 font-medium">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
        </Card>
        <Card className="p-4 border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-600/10 hover:shadow-lg transition-all">
          <p className="text-xs text-muted-foreground mb-1 font-medium">Approved</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.approved}</p>
        </Card>
        <Card className="p-4 border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-600/10 hover:shadow-lg transition-all">
          <p className="text-xs text-muted-foreground mb-1 font-medium">Rejected</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
        </Card>
        <Card className="p-4 border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-orange-600/10 hover:shadow-lg transition-all">
          <p className="text-xs text-muted-foreground mb-1 font-medium">Awaiting Docs</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.awaiting}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 border-border">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by ID, email, name, or user ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="awaiting_docs">Awaiting Docs</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </Card>

      {/* Verification Table */}
      <Card className="border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase">Nominee</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase">User ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase">Asset Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase">Submitted</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                    No verification requests found
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-foreground">{request.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{request.nomineeName}</p>
                        <p className="text-xs text-muted-foreground">{request.nomineeEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground font-mono">{request.userId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground">{request.assetType}</p>
                      <p className="text-xs text-muted-foreground">{request.assetCount} files</p>
                    </td>
                    <td className="px-6 py-4">
                      {getPriorityBadge(request.priority)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">{request.submittedAt}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request)
                          setShowModal(true)
                        }}
                        className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Review Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border-border">
            {/* Modal Header */}
            <div className="sticky top-0 bg-card p-6 border-b border-border flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Verification Review</h2>
                <p className="text-sm text-muted-foreground mt-1">{selectedRequest.id}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowModal(false)
                  setAdminNotes("")
                  setRejectionReason("")
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status & Priority */}
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedRequest.status)}
                {getPriorityBadge(selectedRequest.priority)}
              </div>

              {/* Nominee Information */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Nominee Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                    <p className="text-sm font-medium text-foreground">{selectedRequest.nomineeName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-sm font-medium text-foreground">{selectedRequest.nomineeEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Phone</p>
                    <p className="text-sm font-medium text-foreground">{selectedRequest.nomineePhone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Relationship</p>
                    <p className="text-sm font-medium text-foreground">{selectedRequest.relationship}</p>
                  </div>
                </div>
              </div>

              {/* User Information (Deceased) */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  User Information (Deceased)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">User ID</p>
                    <p className="text-sm font-medium text-foreground font-mono">{selectedRequest.userId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Registration Date</p>
                    <p className="text-sm font-medium text-foreground">{selectedRequest.userRegistration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Last Login</p>
                    <p className="text-sm font-medium text-foreground">{selectedRequest.userLastLogin}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Inactivity Period</p>
                    <p className="text-sm font-medium text-foreground">{selectedRequest.userInactivityPeriod}</p>
                  </div>
                </div>
              </div>

              {/* Asset Reference */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Asset Reference
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Asset ID</p>
                    <p className="text-sm font-medium text-foreground font-mono">{selectedRequest.assetId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Asset Type</p>
                    <p className="text-sm font-medium text-foreground">{selectedRequest.assetType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Number of Files</p>
                    <p className="text-sm font-medium text-foreground">{selectedRequest.assetCount} files</p>
                  </div>
                </div>
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    ⚠️ Asset content is encrypted and cannot be viewed by admin
                  </p>
                </div>
              </div>

              {/* Uploaded Documents */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Uploaded Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={() => viewDocument(selectedRequest.deathCertificateUrl)}
                  >
                    <FileText className="w-8 h-8 text-primary" />
                    <span className="text-sm font-medium">Death Certificate</span>
                    <span className="text-xs text-muted-foreground">View Document</span>
                  </Button>
                  <Button
                    variant="outline"
                    className={`h-auto py-4 flex flex-col items-center gap-2 ${!selectedRequest.legalDeclarationUrl ? 'opacity-50' : ''}`}
                    onClick={() => selectedRequest.legalDeclarationUrl && viewDocument(selectedRequest.legalDeclarationUrl)}
                    disabled={!selectedRequest.legalDeclarationUrl}
                  >
                    <FileText className="w-8 h-8 text-primary" />
                    <span className="text-sm font-medium">Legal Declaration</span>
                    <span className="text-xs text-muted-foreground">
                      {selectedRequest.legalDeclarationUrl ? 'View Document' : 'Not Uploaded'}
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={() => viewDocument(selectedRequest.idProofUrl)}
                  >
                    <FileText className="w-8 h-8 text-primary" />
                    <span className="text-sm font-medium">ID Proof</span>
                    <span className="text-xs text-muted-foreground">View Document</span>
                  </Button>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add your review notes here..."
                  className="w-full h-24 px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Rejection Reason (shown only when rejecting) */}
              {rejectionReason !== undefined && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Rejection Reason *</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Specify the reason for rejection..."
                    className="w-full h-20 px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
              )}

              {/* Previous Review Info */}
              {selectedRequest.reviewedAt && (
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-2">Previous Review</p>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium">Reviewed by:</span> {selectedRequest.reviewedBy}</p>
                    <p className="text-sm"><span className="font-medium">Reviewed at:</span> {selectedRequest.reviewedAt}</p>
                    {selectedRequest.adminNotes && (
                      <p className="text-sm"><span className="font-medium">Notes:</span> {selectedRequest.adminNotes}</p>
                    )}
                    {selectedRequest.rejectionReason && (
                      <p className="text-sm"><span className="font-medium">Rejection Reason:</span> {selectedRequest.rejectionReason}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="sticky bottom-0 bg-card p-6 border-t border-border flex flex-wrap gap-3">
              {selectedRequest.status === "pending" || selectedRequest.status === "awaiting_docs" ? (
                <>
                  <Button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {actionLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    ) : (
                      <Check className="w-4 h-4 mr-2" />
                    )}
                    Approve
                  </Button>
                  <Button
                    onClick={() => {
                      if (rejectionReason === "") setRejectionReason(" ")
                      else handleReject()
                    }}
                    disabled={actionLoading}
                    variant="outline"
                    className="flex-1 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    {rejectionReason === "" ? "Reject" : "Confirm Reject"}
                  </Button>
                  <Button
                    onClick={handleRequestDocs}
                    disabled={actionLoading}
                    variant="outline"
                    className="flex-1 border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Request Re-upload
                  </Button>
                </>
              ) : (
                <div className="w-full text-center text-sm text-muted-foreground py-2">
                  This request has already been {selectedRequest.status}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showDocumentViewer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl h-[90vh] border-border flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Document Viewer</h3>
                <p className="text-xs text-muted-foreground mt-1">View-only mode • Screenshot prevention active</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDocumentViewer(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 p-6 bg-muted/20">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">Document Preview</p>
                  <p className="text-xs text-muted-foreground font-mono">{currentDocument}</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-4">
                    ⚠️ In production, this would show a watermarked PDF/image viewer
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}