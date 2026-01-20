"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Lock, Users, Clock, Calendar, Zap, TrendingUp, Shield, CheckCircle, AlertCircle, Eye, Download, Bell } from "lucide-react"

interface DashboardOverview {
  totalAssets: number
  activeNominees: number
  pendingTransfers: number
  lastLoginDate: string
  inactivityDaysRemaining: number
  currentPlan: string
  storageUsed: number
  storageLimit: number
}

interface Activity {
  id: string
  type: "asset_added" | "nominee_assigned" | "reminder_sent" | "plan_upgraded"
  description: string
  timestamp: string
  icon: any
}

export default function DashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview>({
    totalAssets: 0,
    activeNominees: 0,
    pendingTransfers: 0,
    lastLoginDate: "",
    inactivityDaysRemaining: 0,
    currentPlan: "plus",
    storageUsed: 2.5,
    storageLimit: 5,
  })
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showSecurityTip, setShowSecurityTip] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Simulate fetching dashboard data
    const timer = setTimeout(() => {
      setOverview({
        totalAssets: 5,
        activeNominees: 3,
        pendingTransfers: 1,
        lastLoginDate: new Date().toLocaleDateString(),
        inactivityDaysRemaining: 180,
        currentPlan: "plus",
        storageUsed: 2.5,
        storageLimit: 5,
      })

      setActivities([
        {
          id: "1",
          type: "asset_added",
          description: "Digital Will document added",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(),
          icon: Lock,
        },
        {
          id: "2",
          type: "nominee_assigned",
          description: "Nominee John Doe assigned to Digital Will",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toLocaleString(),
          icon: Users,
        },
        {
          id: "3",
          type: "plan_upgraded",
          description: "Plan upgraded from Free to Plus",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString(),
          icon: Zap,
        },
        {
          id: "4",
          type: "reminder_sent",
          description: "Monthly security reminder sent",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString(),
          icon: Clock,
        },
      ])

      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const planConfig: any = {
    free: { name: "Free", color: "bg-gray-600", assetLimit: 3, videoMessage: false },
    plus: { name: "Plus", color: "bg-primary", assetLimit: 20, videoMessage: true },
    premium: { name: "Premium", color: "bg-purple-600", assetLimit: "Unlimited", videoMessage: true },
  }

  const currentPlanConfig = planConfig[overview.currentPlan]
  const storagePercent = (overview.storageUsed / overview.storageLimit) * 100
  const inactivityPercent = ((365 - overview.inactivityDaysRemaining) / 365) * 100

  const overviewCards = [
    {
      title: "Digital Assets",
      value: overview.totalAssets,
      icon: Lock,
      color: "from-blue-500/20 to-cyan-500/20",
      textColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
      limit: currentPlanConfig.assetLimit,
      change: "+2 this month",
      changePositive: true,
    },
    {
      title: "Active Nominees",
      value: overview.activeNominees,
      icon: Users,
      color: "from-purple-500/20 to-pink-500/20",
      textColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
      change: "All verified",
      changePositive: true,
    },
    {
      title: "Pending Approvals",
      value: overview.pendingTransfers,
      icon: Clock,
      color: "from-orange-500/20 to-red-500/20",
      textColor: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-500/10",
      change: "Needs attention",
      changePositive: false,
    },
  ]

  const securityScore = Math.min(100, (overview.totalAssets * 15) + (overview.activeNominees * 20) + 25)

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header with greeting */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome Back, {user?.fullName?.split(" ")[0] || "User"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening"}! Here's your vault overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
          </div>
        </div>
      </div>

      {/* Security Score Card */}
      {showSecurityTip && (
        <Card className="p-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 relative overflow-hidden group hover:border-primary/40 transition-all duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <button 
            onClick={() => setShowSecurityTip(false)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            ×
          </button>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-foreground">Security Score</h3>
                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {securityScore}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-muted/50 overflow-hidden backdrop-blur-sm">
                <div 
                  className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all duration-1000 animate-pulse"
                  style={{ width: `${securityScore}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {securityScore >= 80 ? "Excellent! Your vault is well-protected." : securityScore >= 60 ? "Good progress! Consider adding more nominees." : "Add more assets and nominees to improve security."}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Plan Card - Enhanced */}
      <Card className={`p-6 border-2 ${currentPlanConfig.color.includes("primary") ? "border-primary/50 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10" : "border-border"} relative overflow-hidden group hover:shadow-lg transition-all duration-300`}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`${currentPlanConfig.color} text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-md`}>
                <Zap className="w-4 h-4" />
                {currentPlanConfig.name} Plan
              </span>
              {currentPlanConfig.videoMessage && (
                <span className="bg-green-500/10 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-green-500/20">
                  <CheckCircle className="w-3 h-3" />
                  Video Messages Enabled
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground text-lg">
                  {typeof currentPlanConfig.assetLimit === "number"
                    ? currentPlanConfig.assetLimit - overview.totalAssets
                    : "Unlimited"}
                </strong>{" "}
                asset slots remaining
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="w-4 h-4 text-primary" />
              {overview.totalAssets} of {currentPlanConfig.assetLimit} slots used
            </div>
          </div>
          {overview.currentPlan !== "premium" && (
            <Link href="/pricing">
              <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all group/btn">
                Upgrade Plan 
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          )}
        </div>
      </Card>

      {/* Overview Cards - Enhanced with animations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {overviewCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <Card
              key={card.title}
              className="p-6 border border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, ${card.bgColor} 0%, transparent 100%)` }} />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{card.title}</p>
                    <p className={`text-4xl font-bold mt-3 ${card.textColor}`}>
                      {loading ? (
                        <span className="animate-pulse">-</span>
                      ) : (
                        card.value
                      )}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <Icon className={`w-6 h-6 ${card.textColor}`} />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                  {card.limit && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      {card.limit} limit
                    </p>
                  )}
                  <span className={`text-xs font-medium flex items-center gap-1 ${card.changePositive ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                    {card.changePositive ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {card.change}
                  </span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Last Login & Inactivity Info - Enhanced */}
      <Card className="p-6 border border-border bg-gradient-to-r from-primary/5 via-transparent to-accent/5 hover:shadow-lg transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3 group">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Last Login</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{loading ? "-" : overview.lastLoginDate}</p>
            <p className="text-xs text-muted-foreground">Keep logging in regularly to maintain access</p>
          </div>
          
          <div className="space-y-3 group">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Inactivity Countdown</p>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {loading ? "-" : `${overview.inactivityDaysRemaining} days`}
            </p>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Before nominee verification begins</p>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-yellow-500 transition-all duration-1000"
                  style={{ width: `${inactivityPercent}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-3 group">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Storage Used</p>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {loading ? "-" : `${overview.storageUsed}GB`}
            </p>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">of {overview.storageLimit}GB total capacity</p>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                  style={{ width: `${storagePercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions - Enhanced */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 border border-border hover:border-primary/50 transition-all duration-300 group hover:shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">Add Digital Asset</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload and secure a new digital asset with nominee assignment
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 group-hover:scale-110 transition-transform">
                  <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <Link href="/dashboard/add-asset">
                <Button className="mt-4 w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-md hover:shadow-lg transition-all group/btn">
                  Add Asset 
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 border border-border hover:border-primary/50 transition-all duration-300 group hover:shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">View All Assets</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Manage, edit, or delete your existing digital assets
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:scale-110 transition-transform">
                  <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <Link href="/dashboard/assets">
                <Button variant="outline" className="mt-4 w-full border-border hover:bg-muted bg-transparent hover:border-primary/50 transition-all group/btn">
                  View Assets 
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Activity Timeline - Enhanced */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Clock className="w-6 h-6 text-primary" />
          Activity Timeline
        </h2>
        <Card className="p-6 border border-border hover:shadow-lg transition-all duration-300">
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-muted-foreground mt-4">Loading activity...</p>
              </div>
            ) : activities.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No activities yet</p>
            ) : (
              activities.map((activity, idx) => {
                const ActivityIcon = activity.icon
                return (
                  <div 
                    key={activity.id} 
                    className="flex gap-4 group hover:bg-muted/30 p-3 rounded-lg transition-all duration-300"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                        <ActivityIcon className="w-5 h-5 text-primary" />
                      </div>
                      {idx < activities.length - 1 && (
                        <div className="w-0.5 h-14 bg-gradient-to-b from-border to-transparent my-2" />
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}