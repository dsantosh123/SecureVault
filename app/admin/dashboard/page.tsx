"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Shield,
  FileText,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  ArrowRight,
  Bell,
  Download
} from "lucide-react"
import { useRouter } from "next/navigation"
import { apiGet } from "@/lib/api-client"
import { API_ENDPOINTS } from "@/lib/api-config"

interface SystemStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  totalAssets: number
  pendingVerifications: number
  approvedVerifications: number
  rejectedVerifications: number
  systemUptime: string
}

interface RecentActivity {
  id: string
  action: string
  admin: string
  timestamp: string
  status: "success" | "warning" | "error"
}

interface VerificationRequest {
  id: string
  nomineeEmail: string
  userId: string
  assetType: string
  status: "pending" | "approved" | "rejected" | "awaiting_docs"
  submittedAt: string
  priority: "high" | "medium" | "low"
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalAssets: 0,
    pendingVerifications: 0,
    approvedVerifications: 0,
    rejectedVerifications: 0,
    systemUptime: "99.9%"
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [urgentRequests, setUrgentRequests] = useState<VerificationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState<any>(null)

  useEffect(() => {
    const adminEmail = localStorage.getItem("adminEmail")
    if (adminEmail) {
      setAdmin({ email: adminEmail })
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch real stats
        const statsRes = await apiGet<any>(API_ENDPOINTS.admin.stats);
        if (statsRes.success && statsRes.data) {
          setStats({
            totalUsers: statsRes.data.totalUsers || 0,
            activeUsers: statsRes.data.activeUsers || 0,
            inactiveUsers: (statsRes.data.totalUsers || 0) - (statsRes.data.activeUsers || 0),
            totalAssets: statsRes.data.totalAssets || 0,
            pendingVerifications: statsRes.data.pendingVerifications || 0,
            approvedVerifications: statsRes.data.approvedVerifications || 0,
            rejectedVerifications: statsRes.data.rejectedVerifications || 0,
            systemUptime: statsRes.data.systemUptime || "99.9%"
          });
        }

        // Fetch real verification requests for "Urgent" list
        const verRes = await apiGet<any[]>(API_ENDPOINTS.admin.verificationRequests);
        if (verRes.success && verRes.data) {
          setUrgentRequests(verRes.data.slice(0, 5).map(req => ({
            id: req.id,
            nomineeEmail: `${req.nomineeName} (${req.nomineeEmail})`,
            userId: req.deceasedUserName,
            assetType: "Claim for: " + req.relationship,
            status: (req.status || "pending").toLowerCase().replace("pending_admin_review", "pending") as any,
            submittedAt: new Date(req.submittedAt).toLocaleDateString(),
            priority: "high"
          })));
        }

        // Fetch real activity logs
        const logsRes = await apiGet<any[]>(API_ENDPOINTS.admin.logs);
        if (logsRes.success && logsRes.data) {
          setRecentActivity(logsRes.data.slice(0, 5).map(log => ({
            id: log.id,
            action: log.details,
            admin: log.userName,
            timestamp: new Date(log.timestamp).toLocaleTimeString(),
            status: log.action.includes('SUCCESS') || log.action.includes('UPLOAD') || log.action.includes('LOGIN') ? 'success' : 'warning'
          })));
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [])

  const overviewCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "from-blue-500/20 to-cyan-500/20",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
      trend: "+12%",
      trendPositive: true,
      onClick: () => router.push("/admin/users")
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: Activity,
      color: "from-green-500/20 to-emerald-500/20",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600 dark:text-green-400",
      trend: "+8%",
      trendPositive: true,
      onClick: () => router.push("/admin/users")
    },
    {
      title: "Total Assets",
      value: stats.totalAssets,
      icon: FileText,
      color: "from-purple-500/20 to-pink-500/20",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
      trend: "+15%",
      trendPositive: true
    },
    {
      title: "Pending Verifications",
      value: stats.pendingVerifications,
      icon: Shield,
      color: "from-yellow-500/20 to-orange-500/20",
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      trend: "Needs attention",
      trendPositive: false,
      onClick: () => router.push("/admin/verification")
    }
  ]

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: <Badge className="bg-yellow-500 text-yellow-950 text-xs font-semibold">Pending</Badge>,
      approved: <Badge className="bg-green-500 text-green-950 text-xs font-semibold">Approved</Badge>,
      rejected: <Badge className="bg-red-500 text-red-950 text-xs font-semibold">Rejected</Badge>,
      awaiting_docs: <Badge className="bg-orange-500 text-orange-950 text-xs font-semibold">Awaiting</Badge>
    }
    return badges[status as keyof typeof badges]
  }

  const getPriorityBadge = (priority: string) => {
    const badges = {
      high: <Badge className="bg-red-500 text-red-950 text-xs font-semibold">High</Badge>,
      medium: <Badge className="bg-yellow-500 text-yellow-950 text-xs font-semibold">Medium</Badge>,
      low: <Badge className="bg-blue-500 text-blue-950 text-xs font-semibold">Low</Badge>
    }
    return badges[priority as keyof typeof badges]
  }

  const getActivityIcon = (status: string) => {
    const icons = {
      success: <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
      </div>,
      warning: <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
      </div>,
      error: <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center">
        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
      </div>
    }
    return icons[status as keyof typeof icons]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome Back, Admin
          </h1>
          <p className="text-muted-foreground mt-1">
            {new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening"}! Here's your system overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Bell className="w-4 h-4" />
            Alerts
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {overviewCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <Card
              key={card.title}
              className={`p-6 border border-border hover:border-primary/50 transition-all duration-300 group ${card.onClick ? 'cursor-pointer' : ''} hover:shadow-xl hover:-translate-y-1 relative overflow-hidden`}
              onClick={card.onClick}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{card.title}</p>
                    <p className={`text-4xl font-bold mt-3 ${card.iconColor}`}>
                      {card.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                  <span className={`text-xs font-medium flex items-center gap-1 ${card.trendPositive ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                    {card.trendPositive ? <TrendingUp className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {card.trend}
                  </span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border border-border bg-gradient-to-br from-green-500/10 to-emerald-500/10 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Approved (30d)</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{stats.approvedVerifications}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-600/20 dark:text-green-400/20" />
          </div>
        </Card>
        <Card className="p-6 border border-border bg-gradient-to-br from-red-500/10 to-pink-500/10 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Rejected (30d)</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">{stats.rejectedVerifications}</p>
            </div>
            <XCircle className="w-12 h-12 text-red-600/20 dark:text-red-400/20" />
          </div>
        </Card>
        <Card className="p-6 border border-border bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">System Uptime</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{stats.systemUptime}</p>
            </div>
            <Activity className="w-12 h-12 text-blue-600/20 dark:text-blue-400/20" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Verifications */}
        <div className="lg:col-span-2">
          <Card className="border border-border hover:shadow-xl transition-all duration-300">
            <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Urgent Verifications</h2>
                  <p className="text-sm text-muted-foreground mt-1">Requires immediate attention</p>
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                  onClick={() => router.push("/admin/verification")}
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
            <div className="divide-y divide-border">
              {urgentRequests.map((request) => (
                <div key={request.id} className="p-5 hover:bg-muted/50 transition-colors group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm font-semibold text-foreground">{request.id}</p>
                        {getPriorityBadge(request.priority)}
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{request.nomineeEmail}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {request.assetType}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {request.submittedAt}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border hover:bg-primary/10 hover:text-primary group-hover:border-primary/50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card className="border border-border hover:shadow-xl transition-all duration-300">
            <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
                  <p className="text-sm text-muted-foreground mt-1">Last 24 hours</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="hover:bg-muted"
                  onClick={() => router.push("/admin/logs")}
                >
                  <Clock className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="divide-y divide-border">
              {recentActivity.map((activity, idx) => (
                <div key={activity.id} className="p-5 hover:bg-muted/50 transition-colors" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="flex items-start gap-4">
                    {getActivityIcon(activity.status)}
                    <div className="flex-1">
                      <p className="text-sm text-foreground font-medium leading-relaxed mb-2">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border border-border hover:border-primary/50 transition-all duration-300 group hover:shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">Review Verifications</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Process pending nominee verification requests
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <Button
                className="mt-4 w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-md group/btn"
                onClick={() => router.push("/admin/verification")}
              >
                Start Reviewing
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>

          <Card className="p-6 border border-border hover:border-primary/50 transition-all duration-300 group hover:shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">Manage Users</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Monitor user activity and system usage
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <Button
                variant="outline"
                className="mt-4 w-full border-border hover:bg-muted hover:border-primary/50 transition-all group/btn"
                onClick={() => router.push("/admin/users")}
              >
                View Users
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}