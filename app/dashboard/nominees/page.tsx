"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Trash2, Plus, Shield, Search, Link2, Unlink, Mail, Phone, UserCheck, ChevronDown, ChevronUp, FileText, Edit2 } from "lucide-react"
import { API_ENDPOINTS, getAuthToken } from "@/lib/api-config"
import { apiGet, apiDelete, apiPost, apiPut } from "@/lib/api-client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NomineeInfo {
    id: string
    name: string
    email: string
    relationship: string
}

interface Nominee {
    id: string
    name: string
    email: string
    relationship: string
    phoneNumber: string
    identityConfirmed: boolean
}

interface AssetSummary {
    id: string
    name: string
    type: string
    nominees: NomineeInfo[]
}

export default function ManageNomineesPage() {
    const [nominees, setNominees] = useState<Nominee[]>([])
    const [assets, setAssets] = useState<AssetSummary[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    // Assign modal state
    const [isAssignOpen, setIsAssignOpen] = useState(false)
    const [assignNomineeId, setAssignNomineeId] = useState("")
    const [assignAssetId, setAssignAssetId] = useState("")
    const [isAssigning, setIsAssigning] = useState(false)

    // Add nominee modal
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newName, setNewName] = useState("")
    const [newEmail, setNewEmail] = useState("")
    const [newRelationship, setNewRelationship] = useState("")
    const [newPhone, setNewPhone] = useState("")
    const [isAdding, setIsAdding] = useState(false)

    // Edit nominee modal
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingNominee, setEditingNominee] = useState<Nominee | null>(null)
    const [editName, setEditName] = useState("")
    const [editEmail, setEditEmail] = useState("")
    const [editRelationship, setEditRelationship] = useState("")
    const [editPhone, setEditPhone] = useState("")
    const [isEditing, setIsEditing] = useState(false)

    // Expanded nominee cards
    const [expandedNominee, setExpandedNominee] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        const token = getAuthToken()
        if (!token) return

        try {
            const [nomRes, assetRes] = await Promise.all([
                apiGet<any[]>(API_ENDPOINTS.nominees.list),
                apiGet<any[]>(API_ENDPOINTS.assets.list)
            ])

            if (nomRes.success) {
                setNominees((nomRes.data || []).map((n: any) => ({
                    id: n.id,
                    name: n.name,
                    email: n.email,
                    relationship: n.relationship || "",
                    phoneNumber: n.phoneNumber || "",
                    identityConfirmed: n.identityConfirmed || false,
                })))
            }

            if (assetRes.success) {
                setAssets((assetRes.data || []).map((a: any) => ({
                    id: a.id,
                    name: a.fileName,
                    type: a.fileType || "File",
                    nominees: (a.nominees || []).map((n: any) => ({
                        id: n.id,
                        name: n.name,
                        email: n.email,
                        relationship: n.relationship || ""
                    }))
                })))
            }
        } catch (error) {
            console.error("Error loading data:", error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchData() }, [fetchData])

    // Add nominee
    const handleAddNominee = async () => {
        if (!newName.trim() || !newEmail.trim()) return
        setIsAdding(true)
        try {
            const response = await apiPost<any>(API_ENDPOINTS.nominees.add, {
                name: newName,
                email: newEmail,
                relationship: newRelationship,
                phoneNumber: newPhone,
            })
            if (response.success) {
                await fetchData()
                setIsAddOpen(false)
                setNewName("")
                setNewEmail("")
                setNewRelationship("")
                setNewPhone("")
            } else {
                alert(response.error || "Failed to add nominee")
            }
        } catch (error) {
            console.error("Add error:", error)
        } finally {
            setIsAdding(false)
        }
    }

    // Edit nominee
    const openEditModal = (nominee: Nominee) => {
        setEditingNominee(nominee)
        setEditName(nominee.name)
        setEditEmail(nominee.email)
        setEditRelationship(nominee.relationship)
        setEditPhone(nominee.phoneNumber)
        setIsEditOpen(true)
    }

    const handleEditNominee = async () => {
        if (!editingNominee || !editName.trim() || !editEmail.trim()) return
        setIsEditing(true)
        try {
            const response = await apiPut(API_ENDPOINTS.nominees.update(editingNominee.id), {
                name: editName,
                email: editEmail,
                relationship: editRelationship,
                phoneNumber: editPhone,
            })
            if (response.success) {
                await fetchData()
                setIsEditOpen(false)
            } else {
                alert(response.error || "Failed to update nominee")
            }
        } catch (error) {
            console.error("Edit error:", error)
        } finally {
            setIsEditing(false)
        }
    }

    // Delete nominee
    const handleDeleteNominee = async (nomineeId: string) => {
        const nominee = nominees.find(n => n.id === nomineeId)
        const assignedAssets = assets.filter(a => a.nominees.some(n => n.id === nomineeId))

        const msg = assignedAssets.length > 0
            ? `This nominee (${nominee?.name}) is assigned to ${assignedAssets.length} asset(s). Deleting will also remove them from those assets. Continue?`
            : `Are you sure you want to delete nominee "${nominee?.name}"?`

        if (!confirm(msg)) return

        try {
            const response = await apiDelete(API_ENDPOINTS.nominees.remove(nomineeId))
            if (response.success) {
                await fetchData()
            } else {
                alert(response.error || "Failed to delete nominee")
            }
        } catch (error) {
            console.error("Delete error:", error)
        }
    }

    // Assign nominee to asset
    const handleAssignNominee = async () => {
        if (!assignNomineeId || !assignAssetId) return
        setIsAssigning(true)
        try {
            const response = await apiPost(API_ENDPOINTS.nominees.assignToAsset(assignNomineeId, assignAssetId), {})
            if (response.success) {
                await fetchData()
                setIsAssignOpen(false)
                setAssignNomineeId("")
                setAssignAssetId("")
            } else {
                alert(response.error || "Failed to assign nominee")
            }
        } catch (error) {
            console.error("Assign error:", error)
        } finally {
            setIsAssigning(false)
        }
    }

    // Remove nominee from asset
    const handleRemoveFromAsset = async (nomineeId: string, assetId: string) => {
        const nominee = nominees.find(n => n.id === nomineeId)
        const asset = assets.find(a => a.id === assetId)
        if (!confirm(`Remove "${nominee?.name}" from asset "${asset?.name}"? The nominee will not be deleted.`)) return

        try {
            const response = await apiDelete(API_ENDPOINTS.nominees.unassignFromAsset(nomineeId, assetId))
            if (response.success) {
                await fetchData()
            } else {
                alert(response.error || "Failed to remove nominee from asset")
            }
        } catch (error) {
            console.error("Unassign error:", error)
        }
    }

    // Get assets assigned to a specific nominee
    const getAssetsForNominee = (nomineeId: string) => {
        return assets.filter(a => a.nominees.some(n => n.id === nomineeId))
    }

    // Get unassigned assets for a nominee (not already assigned)
    const getUnassignedAssets = (nomineeId: string) => {
        return assets.filter(a => !a.nominees.some(n => n.id === nomineeId))
    }

    const filteredNominees = nominees.filter(n =>
        n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.relationship.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">Manage Nominees</h1>
                    <p className="text-muted-foreground">Add, edit, delete nominees and assign them to your digital assets</p>
                </div>
                <Button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground w-full md:w-auto shadow-lg hover:shadow-xl transition-all"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Nominee
                </Button>
            </div>

            {/* Stats */}
            {!loading && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Card className="p-4 border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-500/5 to-transparent">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Nominees</p>
                                <p className="text-2xl font-bold text-foreground mt-1">{nominees.length}</p>
                            </div>
                            <Users className="w-8 h-8 text-purple-500 opacity-20" />
                        </div>
                    </Card>
                    <Card className="p-4 border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-500/5 to-transparent">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Assets</p>
                                <p className="text-2xl font-bold text-foreground mt-1">{assets.length}</p>
                            </div>
                            <Shield className="w-8 h-8 text-blue-500 opacity-20" />
                        </div>
                    </Card>
                    <Card className="p-4 border-l-4 border-l-green-500 bg-gradient-to-br from-green-500/5 to-transparent">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Verified</p>
                                <p className="text-2xl font-bold text-foreground mt-1">{nominees.filter(n => n.identityConfirmed).length}</p>
                            </div>
                            <UserCheck className="w-8 h-8 text-green-500 opacity-20" />
                        </div>
                    </Card>
                </div>
            )}

            {/* Search & Assign */}
            {!loading && nominees.length > 0 && (
                <Card className="p-4 border border-border">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search nominees by name, email, or relationship..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-background"
                            />
                        </div>
                        <Button variant="outline" onClick={() => { setIsAssignOpen(true); setAssignNomineeId(""); setAssignAssetId("") }}>
                            <Link2 className="w-4 h-4 mr-2" />
                            Assign to Asset
                        </Button>
                    </div>
                </Card>
            )}

            {/* Nominees List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Loading nominees...</p>
                </div>
            ) : nominees.length === 0 ? (
                <Card className="p-12 text-center border border-border">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Nominees Yet</h3>
                    <p className="text-muted-foreground mb-6">Add a nominee to get started with asset assignment</p>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Nominee
                    </Button>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredNominees.map((nominee) => {
                        const assignedAssets = getAssetsForNominee(nominee.id)
                        const isExpanded = expandedNominee === nominee.id

                        return (
                            <Card key={nominee.id} className="border border-border hover:border-primary/30 transition-all duration-300">
                                {/* Nominee Header */}
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                {nominee.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-foreground text-lg">{nominee.name}</h3>
                                                    {nominee.identityConfirmed && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20">
                                                            ✓ Verified
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {nominee.email}
                                                    </span>
                                                    {nominee.phoneNumber && (
                                                        <span className="flex items-center gap-1">
                                                            <Phone className="w-3 h-3" />
                                                            {nominee.phoneNumber}
                                                        </span>
                                                    )}
                                                    {nominee.relationship && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                                                            {nominee.relationship}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setExpandedNominee(isExpanded ? null : nominee.id)}
                                                className="border-border hover:bg-muted bg-transparent gap-1"
                                            >
                                                <FileText className="w-4 h-4" />
                                                <span className="text-xs">{assignedAssets.length} asset{assignedAssets.length !== 1 ? "s" : ""}</span>
                                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEditModal(nominee)}
                                                className="border-border hover:bg-muted bg-transparent"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteNominee(nominee.id)}
                                                className="border-border hover:bg-destructive hover:text-destructive-foreground"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded — Show assigned assets */}
                                {isExpanded && (
                                    <div className="px-6 pb-6 border-t border-border pt-4">
                                        <p className="text-sm font-medium text-foreground mb-3">Assigned Assets:</p>
                                        {assignedAssets.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">No assets assigned yet.</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {assignedAssets.map(asset => (
                                                    <div key={asset.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                                                        <div className="flex items-center gap-3">
                                                            <Shield className="w-4 h-4 text-primary" />
                                                            <div>
                                                                <p className="text-sm font-medium text-foreground">{asset.name}</p>
                                                                <p className="text-xs text-muted-foreground">{asset.type}</p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleRemoveFromAsset(nominee.id, asset.id)}
                                                            className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
                                                        >
                                                            <Unlink className="w-3 h-3" />
                                                            <span className="text-xs">Remove</span>
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-3 border-dashed border-primary/50 text-primary hover:bg-primary/5"
                                            onClick={() => {
                                                setAssignNomineeId(nominee.id)
                                                setAssignAssetId("")
                                                setIsAssignOpen(true)
                                            }}
                                        >
                                            <Plus className="w-3 h-3 mr-1" />
                                            Assign to another asset
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Info Card */}
            {nominees.length > 0 && (
                <Card className="p-6 border border-border bg-gradient-to-br from-primary/5 to-accent/5">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                            <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground mb-2">Nominee Management</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Each asset can have multiple nominees assigned to it. Nominees are notified when the inactivity period triggers.
                                Deleting a nominee will automatically remove them from all assigned assets.
                                Removing a nominee from one asset does not affect their assignment to other assets.
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Add Nominee Modal */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New Nominee</DialogTitle>
                        <DialogDescription>
                            Create a new nominee who can be assigned to one or more assets.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="add-name">Full Name *</Label>
                            <Input id="add-name" placeholder="John Doe" value={newName} onChange={(e) => setNewName(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="add-email">Email Address *</Label>
                            <Input id="add-email" type="email" placeholder="john@example.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="add-relationship">Relationship</Label>
                            <Input id="add-relationship" placeholder="e.g. Spouse, Sibling, Friend" value={newRelationship} onChange={(e) => setNewRelationship(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="add-phone">Phone Number</Label>
                            <Input id="add-phone" placeholder="+1 555 123 4567" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddNominee} disabled={isAdding || !newName.trim() || !newEmail.trim()} className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                            {isAdding ? "Adding..." : "Add Nominee"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Nominee Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Nominee</DialogTitle>
                        <DialogDescription>
                            Update nominee details.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Full Name *</Label>
                            <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-email">Email Address *</Label>
                            <Input id="edit-email" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-relationship">Relationship</Label>
                            <Input id="edit-relationship" value={editRelationship} onChange={(e) => setEditRelationship(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-phone">Phone Number</Label>
                            <Input id="edit-phone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleEditNominee} disabled={isEditing || !editName.trim() || !editEmail.trim()} className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                            {isEditing ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Assign Nominee to Asset Modal */}
            <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Assign Nominee to Asset</DialogTitle>
                        <DialogDescription>
                            Select a nominee and an asset to create the assignment.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Nominee</Label>
                            <Select value={assignNomineeId} onValueChange={setAssignNomineeId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a nominee" />
                                </SelectTrigger>
                                <SelectContent>
                                    {nominees.map(n => (
                                        <SelectItem key={n.id} value={n.id}>
                                            {n.name} ({n.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Asset</Label>
                            <Select value={assignAssetId} onValueChange={setAssignAssetId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an asset" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(assignNomineeId ? getUnassignedAssets(assignNomineeId) : assets).map(a => (
                                        <SelectItem key={a.id} value={a.id}>
                                            {a.name} ({a.type})
                                        </SelectItem>
                                    ))}
                                    {assignNomineeId && getUnassignedAssets(assignNomineeId).length === 0 && (
                                        <SelectItem value="none" disabled>All assets already assigned</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
                        <Button onClick={handleAssignNominee} disabled={isAssigning || !assignNomineeId || !assignAssetId} className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                            {isAssigning ? "Assigning..." : "Assign Nominee"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
