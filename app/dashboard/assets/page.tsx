"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Trash2, Users, Lock, Search, Filter, Clock, Shield, FileText, Video, Key, Coins, FolderOpen, LayoutGrid, List, TrendingUp, Eye } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { API_ENDPOINTS, getAuthToken } from "@/lib/api-config"
import { apiGet, apiDelete, apiPut } from "@/lib/api-client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface NomineeInfo {
  id: string
  name: string
  email: string
  relationship: string
}

interface Asset {
  id: string
  name: string
  type: string
  nominees: NomineeInfo[]
  createdAt: string
  status: "ACTIVE" | "PENDING_VERIFICATION" | "RELEASED"
  description?: string
}

interface UserProfile {
  inactivityDays: number
  lastLoginAt: string
}

export default function ViewAssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  // Edit state — ONLY description (no nominee editing)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [editDescription, setEditDescription] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const fetchAssets = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        const response = await apiGet<any[]>(API_ENDPOINTS.assets.list);
        if (response.success) {
          const data = response.data || [];
          const mappedAssets: Asset[] = data.map((item: any) => ({
            id: item.id,
            name: item.fileName,
            type: item.fileType || "File",
            nominees: (item.nominees || []).map((n: any) => ({
              id: n.id,
              name: n.name,
              email: n.email,
              relationship: n.relationship || ""
            })),
            status: (item.isReleased ? "RELEASED" : "ACTIVE") as "ACTIVE" | "PENDING_VERIFICATION" | "RELEASED",
            createdAt: new Date(item.uploadedAt).toLocaleDateString(),
            description: item.description
          }));
          setAssets(mappedAssets);
          setFilteredAssets(mappedAssets);
        }
      } catch (error) {
        console.error("Error loading assets:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const response = await apiGet<any>(API_ENDPOINTS.users.profile);
        if (response.success && response.data) {
          setUserProfile({
            inactivityDays: response.data.inactivityDays || 180,
            lastLoginAt: response.data.lastLoginAt
          });
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    };

    fetchAssets();
    fetchUserProfile();
  }, []);

  // Calculate remaining inactivity days dynamically from user profile
  const calculateRemainingDays = (): number => {
    if (!userProfile || !userProfile.lastLoginAt) return 0;
    const lastLogin = new Date(userProfile.lastLoginAt);
    const now = new Date();
    const daysSinceLogin = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
    const remaining = (userProfile.inactivityDays || 180) - daysSinceLogin;
    return Math.max(0, remaining);
  };

  const inactivityDaysRemaining = calculateRemainingDays();
  const inactivityPeriod = userProfile ? `${userProfile.inactivityDays} days` : "—";

  // Filter and search logic
  useEffect(() => {
    let filtered = [...assets]

    if (searchQuery) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.nominees.some(n => n.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (filterType !== "all") {
      filtered = filtered.filter(asset => asset.type === filterType)
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(asset => asset.status === filterStatus)
    }

    setFilteredAssets(filtered)
  }, [searchQuery, filterType, filterStatus, assets])

  // Edit — ONLY description
  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setEditDescription(asset.description || "");
    setIsEditModalOpen(true);
  }

  const handleUpdate = async () => {
    if (!editingAsset) return;
    setIsUpdating(true);
    try {
      const url = `${API_ENDPOINTS.assets.update(editingAsset.id)}?description=${encodeURIComponent(editDescription)}`;
      const response = await apiPut(url, {});

      if (response.success) {
        setAssets(assets.map(a => a.id === editingAsset.id ? {
          ...a,
          description: editDescription
        } : a));
        setIsEditModalOpen(false);
      } else {
        alert(response.error || "Failed to update asset");
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsUpdating(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this asset?")) {
      try {
        const response = await apiDelete(API_ENDPOINTS.assets.delete(id));
        if (response.success) {
          setAssets(assets.filter((asset) => asset.id !== id))
        } else {
          alert(response.error || "Failed to delete asset");
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30"
      case "PENDING_VERIFICATION":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30"
      case "RELEASED":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, " ")
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Credentials":
        return <Key className="w-5 h-5" />
      case "Document":
        return <FileText className="w-5 h-5" />
      case "Video":
        return <Video className="w-5 h-5" />
      case "Crypto":
        return <Coins className="w-5 h-5" />
      case "File":
        return <FolderOpen className="w-5 h-5" />
      default:
        return <Lock className="w-5 h-5" />
    }
  }

  const getUrgencyLevel = (days: number) => {
    if (days <= 7) return { color: "text-red-600 dark:text-red-400", label: "Urgent" }
    if (days <= 30) return { color: "text-orange-600 dark:text-orange-400", label: "Soon" }
    if (days <= 90) return { color: "text-yellow-600 dark:text-yellow-400", label: "Moderate" }
    return { color: "text-green-600 dark:text-green-400", label: "Healthy" }
  }

  // Format nominees for display
  const getNomineeDisplay = (nominees: NomineeInfo[]) => {
    if (!nominees || nominees.length === 0) return "Not Assigned";
    return nominees.map(n => n.name).join(", ");
  }

  // Statistics
  const allNominees = new Set(assets.flatMap(a => a.nominees.map(n => n.id)));
  const stats = {
    total: assets.length,
    active: assets.filter(a => a.status === "ACTIVE").length,
    pending: assets.filter(a => a.status === "PENDING_VERIFICATION").length,
    nominees: allNominees.size
  }

  const urgency = getUrgencyLevel(inactivityDaysRemaining)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Your Digital Assets</h1>
          <p className="text-muted-foreground">Manage all your secured digital assets. Nominee assignment is handled from <Link href="/dashboard/nominees" className="text-primary hover:underline font-medium">Manage Nominees</Link>.</p>
        </div>
        <Link href="/dashboard/add-asset">
          <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground w-full md:w-auto shadow-lg hover:shadow-xl transition-all">
            <Plus className="w-4 h-4 mr-2" />
            Add New Asset
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      {!loading && assets.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 border-l-4 border-l-primary bg-gradient-to-br from-primary/5 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
              </div>
              <Shield className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-green-500 bg-gradient-to-br from-green-500/5 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.active}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-yellow-500 bg-gradient-to-br from-yellow-500/5 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-500/5 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nominees</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.nominees}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500 opacity-20" />
            </div>
          </Card>
        </div>
      )}

      {/* Inactivity Info Banner */}
      {!loading && assets.length > 0 && userProfile && (
        <Card className="p-4 border border-border bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Inactivity Period</p>
                <p className="text-lg font-bold text-foreground">{inactivityPeriod}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-border hidden md:block" />
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Days Remaining</p>
                <p className={`text-lg font-bold ${urgency.color}`}>
                  {inactivityDaysRemaining} days
                  <span className={`text-xs ml-2 px-2 py-0.5 rounded-full border ${urgency.color}`}>{urgency.label}</span>
                </p>
              </div>
            </div>
            <div className="h-8 w-px bg-border hidden md:block" />
            <p className="text-xs text-muted-foreground flex-1">
              This is user-level. If you don't login for {inactivityPeriod}, your nominees will be notified for verification. Login regularly to reset the countdown.
            </p>
          </div>
        </Card>
      )}

      {/* Search and Filters */}
      {!loading && assets.length > 0 && (
        <Card className="p-4 border border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search assets by name, type, or nominee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Asset Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Credentials">Credentials</SelectItem>
                <SelectItem value="Document">Document</SelectItem>
                <SelectItem value="Video">Video</SelectItem>
                <SelectItem value="Crypto">Crypto</SelectItem>
                <SelectItem value="File">File</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PENDING_VERIFICATION">Pending</SelectItem>
                <SelectItem value="RELEASED">Released</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {(searchQuery || filterType !== "all" || filterStatus !== "all") && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">Active filters:</p>
              {searchQuery && (
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  Search: "{searchQuery}"
                </span>
              )}
              {filterType !== "all" && (
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  Type: {filterType}
                </span>
              )}
              {filterStatus !== "all" && (
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  Status: {filterStatus.replace(/_/g, " ")}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery("")
                  setFilterType("all")
                  setFilterStatus("all")
                }}
                className="text-xs text-primary hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
        </Card>
      )}

      {/* Assets List/Grid */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading assets...</p>
          </div>
        ) : filteredAssets.length === 0 && assets.length === 0 ? (
          <Card className="col-span-full p-12 text-center border border-border">
            <Lock className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Assets Yet</h3>
            <p className="text-muted-foreground mb-6">Start by adding your first digital asset with a nominee</p>
            <Link href="/dashboard/add-asset">
              <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Asset
              </Button>
            </Link>
          </Card>
        ) : filteredAssets.length === 0 ? (
          <Card className="col-span-full p-12 text-center border border-border">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Results Found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setFilterType("all")
                setFilterStatus("all")
              }}
            >
              Clear Filters
            </Button>
          </Card>
        ) : (
          filteredAssets.map((asset) => {
            return viewMode === "grid" ? (
              // Grid View
              <Card
                key={asset.id}
                className="p-5 border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      {getTypeIcon(asset.type)}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(asset.status)}`}>
                      {getStatusLabel(asset.status)}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground truncate mb-1">{asset.name}</h3>
                    <p className="text-sm text-muted-foreground">{asset.type}</p>
                    {asset.description && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{asset.description}</p>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Nominees:</span>
                      <span className="font-medium flex items-center gap-1 truncate max-w-[140px]" title={getNomineeDisplay(asset.nominees)}>
                        <Users className="w-3 h-3 flex-shrink-0" />
                        {asset.nominees.length > 0 ? `${asset.nominees.length} assigned` : "None"}
                      </span>
                    </div>
                    {asset.nominees.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {asset.nominees.map(n => (
                          <span key={n.id} className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                            {n.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(asset)}>
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(asset.id)}
                      className="hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              // List View
              <Card
                key={asset.id}
                className="p-6 border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0 mt-1">
                        {getTypeIcon(asset.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{asset.name}</h3>
                        <p className="text-sm text-muted-foreground">{asset.type}</p>
                        {asset.description && (
                          <p className="text-xs text-muted-foreground mt-1">{asset.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Assigned Nominees</p>
                        {asset.nominees.length > 0 ? (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {asset.nominees.map(n => (
                              <span key={n.id} className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 font-medium">
                                {n.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-foreground flex items-center gap-1 mt-1 font-medium text-muted-foreground">
                            <Users className="w-4 h-4" />
                            Not Assigned
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Inactivity Period</p>
                        <p className="text-foreground font-medium mt-1">{inactivityPeriod}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Days Remaining</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className={`font-medium ${urgency.color}`}>
                            {inactivityDaysRemaining}
                          </p>
                          <span className={`text-xs px-1.5 py-0.5 rounded border ${urgency.color}`}>
                            {urgency.label}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Added</p>
                        <p className="text-foreground font-medium mt-1">{asset.createdAt}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(asset.status)}`}>
                        ● {getStatusLabel(asset.status)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 md:flex-col">
                    <Link href="/dashboard/nominees">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 md:flex-none border-border hover:bg-muted bg-transparent"
                      >
                        <Users className="w-4 h-4 md:mr-2" />
                        <span className="hidden md:inline">Manage Nominees</span>
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(asset)}
                      className="flex-1 md:flex-none border-border hover:bg-muted bg-transparent"
                    >
                      <Edit2 className="w-4 h-4 md:mr-2" />
                      <span className="hidden md:inline">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(asset.id)}
                      className="flex-1 md:flex-none border-border hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-4 h-4 md:mr-2" />
                      <span className="hidden md:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Info Card */}
      {assets.length > 0 && (
        <Card className="p-6 border border-border bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Asset Security Information</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All assets are encrypted and stored securely using military-grade encryption. Nominees will be invited for verification after the inactivity period is triggered. They must complete identity verification and approve access before receiving assets. You can manage multiple nominees per asset from the <Link href="/dashboard/nominees" className="text-primary hover:underline font-medium">Manage Nominees</Link> section.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Edit Asset Modal — ONLY description editing */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Asset Description</DialogTitle>
            <DialogDescription>
              Update the description for this asset. To manage nominees, use the <strong>Manage Nominees</strong> section.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label>Asset Name</Label>
              <p className="text-sm text-foreground font-medium bg-muted/50 px-3 py-2 rounded-md">{editingAsset?.name}</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter asset description..."
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {editingAsset && editingAsset.nominees.length > 0 && (
              <div className="grid gap-2">
                <Label>Current Nominees</Label>
                <div className="flex flex-wrap gap-2">
                  {editingAsset.nominees.map(n => (
                    <span key={n.id} className="text-xs px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 font-medium">
                      {n.name} ({n.email})
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  To change nominees, go to <Link href="/dashboard/nominees" className="text-primary hover:underline">Manage Nominees</Link>.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}