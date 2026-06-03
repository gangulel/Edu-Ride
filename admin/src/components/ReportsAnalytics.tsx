import { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Select } from "./ui/select"
import { Download, TrendingUp, Users, DollarSign, Star, RefreshCw, AlertCircle } from "lucide-react"
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts"
import { toast } from "sonner"
import { fetchAdminAnalytics, type AdminAnalyticsPayload } from "../lib/adminContent"

function downloadJsonAsCsv<T extends Record<string, unknown>>(rows: T[], filename: string) {
  if (!rows.length) {
    toast.message("Nothing to export", { description: `No data available for ${filename}.` })
    return
  }
  const headers = Array.from(
    rows.reduce((acc, row) => { Object.keys(row).forEach((key) => acc.add(key)); return acc }, new Set<string>())
  )
  const escape = (value: unknown) => {
    const str = value === null || value === undefined ? "" : String(value)
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
  }
  const lines = [headers.join(","), ...rows.map((row) => headers.map((h) => escape(row[h])).join(","))]
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  toast.success("Export ready", { description: `Downloaded ${filename}.` })
}

function SkeletonCard() {
  return (
    <Card>
      <CardContent className="pt-6">
        <span className="er-skeleton" style={{ height: 32, width: "50%", display: "block" }} />
        <span className="er-skeleton" style={{ height: 14, width: "70%", display: "block", marginTop: 10 }} />
      </CardContent>
    </Card>
  )
}

function SkeletonChart({ height = 300 }: { height?: number }) {
  return (
    <div className="er-skeleton" style={{ height, borderRadius: 8 }} />
  )
}

export function ReportsAnalytics() {
  const [data, setData] = useState<AdminAnalyticsPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [period, setPeriod] = useState<"monthly" | "quarterly" | "yearly">("monthly")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const payload = await fetchAdminAnalytics()
      setData(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleRefresh = async () => {
    try {
      await load()
      toast.success("Analytics refreshed")
    } catch {
      toast.error("Refresh failed")
    }
  }

  // Slice data based on period
  const periodSlice = useMemo(() => {
    if (!data) return null
    const count = period === "yearly" ? 12 : period === "quarterly" ? 3 : 6
    return {
      userGrowthData: data.userGrowthData.slice(-count),
      paymentTrendData: data.paymentTrendData.slice(-count),
      routeUtilizationData: data.routeUtilizationData,
      driverPerformanceData: data.driverPerformanceData,
    }
  }, [data, period])

  const exportAll = () => {
    if (!periodSlice) {
      toast.message("Nothing to export", { description: "Load reports first." })
      return
    }
    downloadJsonAsCsv(periodSlice.userGrowthData, `user-growth-${period}.csv`)
    downloadJsonAsCsv(periodSlice.routeUtilizationData, `route-utilization-${period}.csv`)
    downloadJsonAsCsv(periodSlice.paymentTrendData, `payment-trends-${period}.csv`)
    downloadJsonAsCsv(periodSlice.driverPerformanceData, `driver-performance-${period}.csv`)
  }

  // Summary metrics
  const totalUsers = useMemo(() => {
    if (!data?.userGrowthData.length) return 0
    const last = data.userGrowthData[data.userGrowthData.length - 1]
    return (last.parents || 0) + (last.drivers || 0)
  }, [data])

  const totalRevenue = useMemo(
    () => periodSlice?.paymentTrendData.reduce((s, d) => s + (d.revenue || 0), 0) ?? 0,
    [periodSlice]
  )

  const avgRating = useMemo(() => {
    const drivers = data?.driverPerformanceData.filter((d) => d.rating > 0) ?? []
    if (!drivers.length) return 0
    return Math.round((drivers.reduce((s, d) => s + d.rating, 0) / drivers.length) * 10) / 10
  }, [data])

  const avgUtilization = useMemo(() => {
    const routes = data?.routeUtilizationData ?? []
    if (!routes.length) return 0
    return Math.round(routes.reduce((s, r) => s + r.utilization, 0) / routes.length)
  }, [data])

  const totalTrips = useMemo(
    () => data?.driverPerformanceData.reduce((s, d) => s + d.trips, 0) ?? 0,
    [data]
  )

  const avgOnTime = useMemo(() => {
    const drivers = data?.driverPerformanceData ?? []
    if (!drivers.length) return 0
    return Math.round(drivers.reduce((s, d) => s + d.onTime, 0) / drivers.length)
  }, [data])

  const completedTrips = data?.tripSummary.completed ?? 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div />
        <div className="flex gap-2 flex-wrap">
          <Select className="w-40" value={period} onChange={(e) => setPeriod(e.target.value as typeof period)}>
            <option value="monthly">Last 6 Months</option>
            <option value="quarterly">Last Quarter</option>
            <option value="yearly">Last 12 Months</option>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={exportAll} disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {error && (
        <div className="er-banner er-banner-warning">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Total Users</CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">Parents + drivers registered</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rs. {totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {period === "monthly" ? "Last 6 months" : period === "quarterly" ? "Last quarter" : "Last 12 months"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Avg. Rating</CardTitle>
                <Star className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgRating || "—"}</div>
                <p className="text-xs text-gray-500 mt-1">Across all active drivers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Route Efficiency</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{avgUtilization}%</div>
                <p className="text-xs text-gray-500 mt-1">Avg. route utilization</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* User Growth */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Growth</CardTitle>
          <Button variant="outline" size="sm" disabled={loading || !periodSlice}
            onClick={() => periodSlice && downloadJsonAsCsv(periodSlice.userGrowthData, "user-growth.csv")}>
            <Download className="h-4 w-4 mr-2" />Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? <SkeletonChart /> : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={periodSlice?.userGrowthData ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--er-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--er-text-muted)" }} />
                <YAxis tick={{ fontSize: 12, fill: "var(--er-text-muted)" }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="parents" stackId="1" stroke="#3b82f6" fill="#3b82f650" name="Parents" />
                <Area type="monotone" dataKey="drivers" stackId="1" stroke="#10b981" fill="#10b98150" name="Drivers" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Route Utilization + Payment Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Route Utilization</CardTitle>
            <Button variant="outline" size="sm" disabled={loading || !periodSlice}
              onClick={() => periodSlice && downloadJsonAsCsv(periodSlice.routeUtilizationData, "route-utilization.csv")}>
              <Download className="h-4 w-4 mr-2" />Export
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? <SkeletonChart /> : periodSlice?.routeUtilizationData.length === 0 ? (
              <div className="er-empty-state">No active routes with data.</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={periodSlice?.routeUtilizationData ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--er-border)" />
                  <XAxis dataKey="route" tick={{ fontSize: 11, fill: "var(--er-text-muted)" }} />
                  <YAxis unit="%" tick={{ fontSize: 12, fill: "var(--er-text-muted)" }} />
                  <Tooltip formatter={(val: number) => [`${val}%`, "Utilization"]} />
                  <Bar dataKey="utilization" fill="#3b82f6" name="Utilization %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Payment Trends</CardTitle>
            <Button variant="outline" size="sm" disabled={loading || !periodSlice}
              onClick={() => periodSlice && downloadJsonAsCsv(periodSlice.paymentTrendData, "payment-trends.csv")}>
              <Download className="h-4 w-4 mr-2" />Export
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? <SkeletonChart /> : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={periodSlice?.paymentTrendData ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--er-border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--er-text-muted)" }} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--er-text-muted)" }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue (Rs.)" />
                  <Line type="monotone" dataKey="acceptedBookings" stroke="#6366f1" strokeWidth={2} name="Accepted Bookings" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Driver Performance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Driver Performance</CardTitle>
          <Button variant="outline" size="sm" disabled={loading || !periodSlice}
            onClick={() => periodSlice && downloadJsonAsCsv(periodSlice.driverPerformanceData, "driver-performance.csv")}>
            <Download className="h-4 w-4 mr-2" />Export
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? <SkeletonChart height={200} /> : (
            <div className="space-y-3">
              {(periodSlice?.driverPerformanceData ?? []).length === 0 ? (
                <div className="er-empty-state">No driver performance data available.</div>
              ) : (
                (periodSlice?.driverPerformanceData ?? []).map((driver, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: "var(--er-border)" }}>
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="font-medium truncate">{driver.driver}</p>
                      <p className="text-sm text-gray-500">{driver.school} · {driver.trips} trips · {driver.reviews} reviews</p>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Rating</p>
                        <p className={`font-medium ${driver.rating < 3.5 ? "text-red-600" : driver.rating >= 4.5 ? "text-green-600" : ""}`}>
                          ★ {driver.rating.toFixed(1)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">On-Time</p>
                        <p className={`font-medium ${driver.onTime < 85 ? "text-red-600" : driver.onTime >= 95 ? "text-green-600" : ""}`}>
                          {driver.onTime}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Downloads */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="er-hover-lift">
          <CardHeader><CardTitle>Financial Reports</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" disabled={loading}
                onClick={() => periodSlice && downloadJsonAsCsv(periodSlice.paymentTrendData, "revenue-report.csv")}>
                <Download className="h-4 w-4 mr-2" />Revenue Report
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={loading}
                onClick={() => periodSlice && downloadJsonAsCsv(
                  periodSlice.paymentTrendData.map((d) => ({ month: d.month, transactions: d.totalBookings, accepted: d.acceptedBookings })),
                  "transactions.csv"
                )}>
                <Download className="h-4 w-4 mr-2" />Transaction History
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={loading}
                onClick={() => periodSlice && downloadJsonAsCsv(
                  periodSlice.paymentTrendData.map((d) => ({ month: d.month, commission: Math.round((d.revenue || 0) * 0.05) })),
                  "commission-report.csv"
                )}>
                <Download className="h-4 w-4 mr-2" />Commission Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="er-hover-lift">
          <CardHeader><CardTitle>Operational Reports</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" disabled={loading}
                onClick={() => periodSlice && downloadJsonAsCsv(periodSlice.routeUtilizationData, "route-efficiency.csv")}>
                <Download className="h-4 w-4 mr-2" />Route Efficiency
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={loading}
                onClick={() => periodSlice && downloadJsonAsCsv(periodSlice.driverPerformanceData, "driver-performance.csv")}>
                <Download className="h-4 w-4 mr-2" />Driver Performance
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={loading}
                onClick={() => periodSlice && downloadJsonAsCsv(
                  periodSlice.driverPerformanceData.map((d) => ({ driver: d.driver, trips: d.trips, onTime: `${d.onTime}%` })),
                  "trip-analytics.csv"
                )}>
                <Download className="h-4 w-4 mr-2" />Trip Analytics
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="er-hover-lift">
          <CardHeader><CardTitle>User Reports</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" disabled={loading}
                onClick={() => periodSlice && downloadJsonAsCsv(periodSlice.userGrowthData, "user-growth.csv")}>
                <Download className="h-4 w-4 mr-2" />User Growth
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={loading}
                onClick={() => periodSlice && downloadJsonAsCsv(
                  periodSlice.userGrowthData.map((d) => ({ month: d.month, parents: d.parents })),
                  "parent-activity.csv"
                )}>
                <Download className="h-4 w-4 mr-2" />Parent Activity
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={loading}
                onClick={() => periodSlice && downloadJsonAsCsv(periodSlice.driverPerformanceData, "driver-stats.csv")}>
                <Download className="h-4 w-4 mr-2" />Driver Stats
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{completedTrips.toLocaleString()}</div>
                <p className="text-sm text-gray-500 mt-1">Trips Completed (all time)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">{avgOnTime}%</div>
                <p className="text-sm text-gray-500 mt-1">On-Time Performance</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {avgRating ? `${Math.round((avgRating / 5) * 100)}%` : "—"}
                </div>
                <p className="text-sm text-gray-500 mt-1">Parent Satisfaction</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{data?.routeUtilizationData.length ?? 0}</div>
                <p className="text-sm text-gray-500 mt-1">Active Routes Tracked</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
