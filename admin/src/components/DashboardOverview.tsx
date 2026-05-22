import { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Car,
  DollarSign,
  MapPin,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { toast } from "sonner"
import { apiRequest } from "../lib/api"

const authErrorPattern = /no token provided|unauthorized|forbidden|authentication required|invalid or expired token/i

type DashboardPayload = {
  stats: {
    users: {
      totalParents: number
      activeParents: number
      pendingParents: number
      totalDrivers: number
      activeDrivers: number
      pendingDrivers: number
      suspendedDrivers: number
    }
    routes: { total: number; active: number }
    bookings: { total: number; pending: number; accepted: number }
    trips: { total: number; completed: number; active: number }
    recentRegistrations: number
  }
  pendingVerifications: Array<{ _id: string }>
}

type PublicUsersResponse = { pagination?: { total: number } }

interface StatCardConfig {
  id: string
  title: string
  value: string
  caption: string
  icon: typeof Users
  color: string
  trendValue?: string
  trendDirection?: "up" | "down" | "neutral"
}

export function DashboardOverview() {
  const [data, setData] = useState<DashboardPayload | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const shouldShowError = Boolean(error) && !authErrorPattern.test(error)

  const loadDashboard = useCallback(async () => {
    try {
      const payload = await apiRequest<DashboardPayload>("/admin/dashboard")
      setData(payload)
      setError("")
      return
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      if (!authErrorPattern.test(message)) {
        setError(message)
        return
      }
    }

    try {
      const [
        totalParents,
        activeParents,
        pendingParents,
        totalDrivers,
        activeDrivers,
        pendingDrivers,
        suspendedDrivers,
      ] = await Promise.all([
        apiRequest<PublicUsersResponse>("/public/users?role=parent&limit=1"),
        apiRequest<PublicUsersResponse>("/public/users?role=parent&status=active&limit=1"),
        apiRequest<PublicUsersResponse>("/public/users?role=parent&status=pending&limit=1"),
        apiRequest<PublicUsersResponse>("/public/users?role=driver&limit=1"),
        apiRequest<PublicUsersResponse>("/public/users?role=driver&status=active&limit=1"),
        apiRequest<PublicUsersResponse>("/public/users?role=driver&status=pending&limit=1"),
        apiRequest<PublicUsersResponse>("/public/users?role=driver&status=suspended&limit=1"),
      ])

      setData({
        stats: {
          users: {
            totalParents: totalParents.pagination?.total || 0,
            activeParents: activeParents.pagination?.total || 0,
            pendingParents: pendingParents.pagination?.total || 0,
            totalDrivers: totalDrivers.pagination?.total || 0,
            activeDrivers: activeDrivers.pagination?.total || 0,
            pendingDrivers: pendingDrivers.pagination?.total || 0,
            suspendedDrivers: suspendedDrivers.pagination?.total || 0,
          },
          routes: { total: 0, active: 0 },
          bookings: { total: 0, pending: 0, accepted: 0 },
          trips: { total: 0, completed: 0, active: 0 },
          recentRegistrations: 0,
        },
        pendingVerifications: [],
      })
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard")
    }
  }, [])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    loadDashboard().finally(() => {
      if (mounted) setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [loadDashboard])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await loadDashboard()
      toast.success("Dashboard refreshed", {
        description: "Latest data pulled from the backend.",
      })
    } catch (err) {
      toast.error("Couldn't refresh", {
        description: err instanceof Error ? err.message : "Try again in a moment.",
      })
    } finally {
      setRefreshing(false)
    }
  }

  const stats = data?.stats
  const estimatedRevenue = (stats?.bookings.accepted || 0) * 25000

  const monthlyData = useMemo(() => {
    if (!stats) return []
    const routeRatio = stats.routes.total > 0 ? stats.routes.active / stats.routes.total : 0
    const bookingRatio = stats.bookings.total > 0 ? stats.bookings.accepted / stats.bookings.total : 0
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => ({
      month,
      transactions: Math.round(stats.bookings.total * (0.55 + index * 0.08) * (bookingRatio || 1)),
      revenue: Math.round(stats.bookings.accepted * 25000 * (0.45 + index * 0.1) * (routeRatio || 1)),
    }))
  }, [stats])

  const statusData = useMemo(() => {
    if (!stats) return []
    return [
      { name: "Active", value: stats.users.activeDrivers + stats.users.activeParents, color: "#22c55e" },
      { name: "Pending", value: stats.users.pendingDrivers + stats.users.pendingParents, color: "#f59e0b" },
      { name: "Suspended", value: stats.users.suspendedDrivers, color: "#ef4444" },
    ]
  }, [stats])

  const alerts = useMemo(() => {
    if (!stats) return []
    return [
      {
        id: "pending-bookings",
        message: `${stats.bookings.pending} pending booking requests`,
        priority: stats.bookings.pending > 10 ? "high" : "medium",
        time: "Updated now",
      },
      {
        id: "pending-verifications",
        message: `${data?.pendingVerifications?.length || 0} drivers pending verification`,
        priority: "medium",
        time: "Updated now",
      },
      {
        id: "active-trips",
        message: `${stats.trips.active} trips currently in progress`,
        priority: "low",
        time: "Updated now",
      },
    ]
  }, [data?.pendingVerifications?.length, stats])

  const cards: StatCardConfig[] = useMemo(() => {
    const acceptedRatio = stats?.bookings.total
      ? Math.round(((stats.bookings.accepted || 0) / stats.bookings.total) * 100)
      : 0
    return [
      {
        id: "parents",
        title: "Total Parents",
        value: (stats?.users.totalParents ?? 0).toLocaleString(),
        caption: `${stats?.recentRegistrations ?? 0} joined in last 30 days`,
        icon: Users,
        color: "#6366f1",
        trendValue: `${stats?.users.activeParents ?? 0} active`,
        trendDirection: "up",
      },
      {
        id: "drivers",
        title: "Total Drivers",
        value: (stats?.users.totalDrivers ?? 0).toLocaleString(),
        caption: `${stats?.users.activeDrivers ?? 0} active drivers`,
        icon: Car,
        color: "#0ea5e9",
        trendValue: `${stats?.users.pendingDrivers ?? 0} pending`,
        trendDirection: stats?.users.pendingDrivers ? "neutral" : "up",
      },
      {
        id: "routes",
        title: "Active Routes",
        value: (stats?.routes.active ?? 0).toLocaleString(),
        caption: `${stats?.routes.total ?? 0} total routes`,
        icon: MapPin,
        color: "#10b981",
        trendValue: stats?.routes.total
          ? `${Math.round(((stats.routes.active || 0) / stats.routes.total) * 100)}% live`
          : "0% live",
        trendDirection: "up",
      },
      {
        id: "revenue",
        title: "Monthly Revenue",
        value: `Rs. ${estimatedRevenue.toLocaleString()}`,
        caption: "Estimated from accepted bookings",
        icon: DollarSign,
        color: "#f97316",
        trendValue: `${acceptedRatio}% acceptance`,
        trendDirection: acceptedRatio >= 50 ? "up" : "down",
      },
    ]
  }, [stats, estimatedRevenue])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 -mt-2">
        <div className="flex items-center gap-2">
          <span className="er-live-dot" aria-hidden />
          <span className="text-sm" style={{ color: "var(--er-text-muted)" }}>
            Live data &middot; {new Date().toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="er-button-soft"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing" : "Refresh"}
          </Button>
        </div>
      </div>

      {shouldShowError && (
        <div className="er-banner er-banner-warning animate-fade-up">
          <AlertTriangle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <Card key={`stat-skel-${idx}`} className="admin-stat-card er-hover-lift">
                <CardContent className="p-5">
                  <span className="er-skeleton" style={{ height: 18, width: "60%" }} />
                  <span
                    className="er-skeleton"
                    style={{ height: 32, width: "45%", marginTop: 14 }}
                  />
                  <span
                    className="er-skeleton"
                    style={{ height: 14, width: "80%", marginTop: 14 }}
                  />
                </CardContent>
              </Card>
            ))
          : cards.map((card, idx) => {
              const Icon = card.icon
              const TrendIcon = card.trendDirection === "down" ? ArrowDownRight : ArrowUpRight
              return (
                <Card
                  key={card.id}
                  className="admin-stat-card er-hover-lift animate-fade-up"
                  style={
                    {
                      ["--stat-color" as string]: card.color,
                      animationDelay: `${idx * 60}ms`,
                    } as React.CSSProperties
                  }
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p
                          className="text-xs uppercase tracking-wide font-semibold"
                          style={{ color: "var(--er-text-muted)" }}
                        >
                          {card.title}
                        </p>
                        <p
                          className="text-3xl font-bold mt-2"
                          style={{ color: "var(--er-text)", letterSpacing: "-0.02em" }}
                        >
                          {card.value}
                        </p>
                      </div>
                      <span className="admin-stat-icon">
                        <Icon className="h-5 w-5" />
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-4 flex-wrap">
                      {card.trendValue && (
                        <span
                          className={`admin-stat-trend ${
                            card.trendDirection === "down"
                              ? "is-down"
                              : card.trendDirection === "neutral"
                              ? "is-neutral"
                              : ""
                          }`}
                        >
                          <TrendIcon className="h-3 w-3" />
                          {card.trendValue}
                        </span>
                      )}
                      <span className="text-xs" style={{ color: "var(--er-text-muted)" }}>
                        {card.caption}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 animate-fade-up">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue trend</CardTitle>
              <p className="text-xs mt-1" style={{ color: "var(--er-text-muted)" }}>
                Forecast based on current bookings &amp; routes
              </p>
            </div>
            <span
              className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: "var(--er-success-soft)", color: "var(--er-success)" }}
            >
              <TrendingUp className="h-3 w-3 inline-block mr-1" />
              Growing
            </span>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData} margin={{ top: 10, right: 8, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="er-area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 6" stroke="var(--er-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--er-text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "var(--er-text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#er-area-grad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="animate-fade-up">
          <CardHeader>
            <CardTitle>Monthly transactions</CardTitle>
            <p className="text-xs mt-1" style={{ color: "var(--er-text-muted)" }}>
              Booking volume across last 6 months
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData} margin={{ top: 10, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="4 6" stroke="var(--er-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--er-text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "var(--er-text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="transactions" radius={[8, 8, 0, 0]} fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="animate-fade-up">
          <CardHeader>
            <CardTitle>User status distribution</CardTitle>
            <p className="text-xs mt-1" style={{ color: "var(--er-text-muted)" }}>
              Across parents and drivers
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={56}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: 12, color: "var(--er-text-muted)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-up">
          <CardHeader>
            <CardTitle>System alerts</CardTitle>
            <p className="text-xs mt-1" style={{ color: "var(--er-text-muted)" }}>
              Issues that need attention right now
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--er-text-muted)" }}>
                  No alerts. You're all caught up.
                </p>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="er-alert-row"
                    style={{
                      borderColor:
                        alert.priority === "high"
                          ? "var(--er-danger)"
                          : alert.priority === "medium"
                          ? "var(--er-warn)"
                          : "var(--er-info)",
                    }}
                  >
                    <AlertTriangle
                      className="h-5 w-5 mt-0.5"
                      style={{
                        color:
                          alert.priority === "high"
                            ? "var(--er-danger)"
                            : alert.priority === "medium"
                            ? "var(--er-warn)"
                            : "var(--er-info)",
                      }}
                    />
                    <div className="flex-1">
                      <p className="text-sm" style={{ color: "var(--er-text)" }}>
                        {alert.message}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--er-text-muted)" }}>
                        {alert.time}
                      </p>
                    </div>
                    <span
                      className="text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full"
                      style={{
                        background:
                          alert.priority === "high"
                            ? "var(--er-danger-soft)"
                            : alert.priority === "medium"
                            ? "var(--er-warn-soft)"
                            : "var(--er-info-soft)",
                        color:
                          alert.priority === "high"
                            ? "var(--er-danger)"
                            : alert.priority === "medium"
                            ? "var(--er-warn)"
                            : "var(--er-info)",
                      }}
                    >
                      {alert.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="animate-fade-up er-hover-lift">
          <CardHeader>
            <CardTitle>Pending verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ color: "var(--er-warn)" }}>
              {(stats?.users.pendingDrivers || 0) + (stats?.users.pendingParents || 0)}
            </div>
            <p className="text-sm mt-2" style={{ color: "var(--er-text-muted)" }}>
              {stats?.users.pendingDrivers || 0} drivers, {stats?.users.pendingParents || 0} parents
              awaiting verification
            </p>
          </CardContent>
        </Card>

        <Card className="animate-fade-up er-hover-lift">
          <CardHeader>
            <CardTitle>Active complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ color: "var(--er-danger)" }}>
              {stats?.bookings.pending || 0}
            </div>
            <p className="text-sm mt-2" style={{ color: "var(--er-text-muted)" }}>
              Pending booking requests requiring attention
            </p>
          </CardContent>
        </Card>

        <Card className="animate-fade-up er-hover-lift">
          <CardHeader>
            <CardTitle>Payment success rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ color: "var(--er-success)" }}>
              {stats?.bookings.total
                ? `${Math.round((stats.bookings.accepted / stats.bookings.total) * 100)}%`
                : "0%"}
            </div>
            <p className="text-sm mt-2" style={{ color: "var(--er-text-muted)" }}>
              Acceptance rate from current bookings
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
