import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Select } from "./ui/select"
import { Download, TrendingUp, Users, DollarSign, Star } from "lucide-react"
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { toast } from "sonner"
import { fetchAdminContent } from "../lib/adminContent"

function downloadJsonAsCsv<T extends Record<string, any>>(rows: T[], filename: string) {
  if (!rows.length) {
    toast.message("Nothing to export", { description: `No data available for ${filename}.` })
    return
  }
  const headers = Array.from(
    rows.reduce((acc, row) => {
      Object.keys(row).forEach((key) => acc.add(key))
      return acc
    }, new Set<string>())
  )
  const escape = (value: unknown) => {
    const str = value === null || value === undefined ? "" : String(value)
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
  }
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(",")),
  ]
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

export function ReportsAnalytics() {
  const [userGrowthData, setUserGrowthData] = useState<any[]>([])
  const [routeUtilizationData, setRouteUtilizationData] = useState<any[]>([])
  const [paymentTrendData, setPaymentTrendData] = useState<any[]>([])
  const [driverPerformanceData, setDriverPerformanceData] = useState<any[]>([])
  const [period, setPeriod] = useState<"monthly" | "quarterly" | "yearly">("monthly")

  const exportAll = () => {
    const datasets: Array<{ name: string; rows: any[] }> = [
      { name: "user-growth", rows: userGrowthData },
      { name: "route-utilization", rows: routeUtilizationData },
      { name: "payment-trends", rows: paymentTrendData },
      { name: "driver-performance", rows: driverPerformanceData },
    ]
    const populated = datasets.filter((d) => d.rows.length > 0)
    if (!populated.length) {
      toast.message("Nothing to export", { description: "Load reports first." })
      return
    }
    populated.forEach((dataset) => downloadJsonAsCsv(dataset.rows, `${dataset.name}-${period}.csv`))
  }

  useEffect(() => {
    fetchAdminContent()
      .then((payload) => {
        setUserGrowthData(payload.reports?.userGrowthData || [])
        setRouteUtilizationData(payload.reports?.routeUtilizationData || [])
        setPaymentTrendData(payload.reports?.paymentTrendData || [])
        setDriverPerformanceData(payload.reports?.driverPerformanceData || [])
      })
      .catch(() => {
        setUserGrowthData([])
        setRouteUtilizationData([])
        setPaymentTrendData([])
        setDriverPerformanceData([])
      })
  }, [])

  const totalUsers = useMemo(
    () => userGrowthData.length ? Number(userGrowthData[userGrowthData.length - 1].parents || 0) + Number(userGrowthData[userGrowthData.length - 1].drivers || 0) : 0,
    [userGrowthData]
  )
  const totalRevenue = useMemo(() => paymentTrendData.reduce((sum, item) => sum + Number(item.revenue || 0), 0), [paymentTrendData])
  const avgRating = useMemo(() => {
    if (!driverPerformanceData.length) return 0
    return Math.round((driverPerformanceData.reduce((sum, item) => sum + Number(item.rating || 0), 0) / driverPerformanceData.length) * 10) / 10
  }, [driverPerformanceData])
  const avgUtilization = useMemo(() => {
    if (!routeUtilizationData.length) return 0
    return Math.round(routeUtilizationData.reduce((sum, item) => sum + Number(item.utilization || 0), 0) / routeUtilizationData.length)
  }, [routeUtilizationData])
  const totalTrips = useMemo(
    () => driverPerformanceData.reduce((sum, item) => sum + Number(item.trips || 0), 0),
    [driverPerformanceData]
  )
  const avgOnTime = useMemo(() => {
    if (!driverPerformanceData.length) return 0
    return Math.round((driverPerformanceData.reduce((sum, item) => sum + Number(item.onTime || 0), 0) / driverPerformanceData.length) * 10) / 10
  }, [driverPerformanceData])
  const parentSatisfaction = useMemo(() => {
    if (!avgRating) return 0
    return Math.round((avgRating / 5) * 1000) / 10
  }, [avgRating])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          
        </div>
        <div className="flex gap-2">
          <Select
            className="w-40"
            value={period}
            onChange={(event) => setPeriod(event.target.value as typeof period)}
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </Select>
          <Button onClick={exportAll}>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Users</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              Latest backend snapshot
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Last 6 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Avg. Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating || "-"}</div>
            <p className="text-xs text-gray-500 mt-1">System-wide average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{avgUtilization}%</div>
            <p className="text-xs text-gray-500 mt-1">Route utilization</p>
          </CardContent>
        </Card>
      </div>

      {/* User Growth Report */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Growth Report</CardTitle>
          <Button variant="outline" size="sm" onClick={() => downloadJsonAsCsv(userGrowthData, "user-growth.csv")}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="parents" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Parents" />
              <Area type="monotone" dataKey="drivers" stackId="1" stroke="#10b981" fill="#10b981" name="Drivers" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Route Utilization and Payment Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Route Utilization Report</CardTitle>
            <Button variant="outline" size="sm" onClick={() => downloadJsonAsCsv(routeUtilizationData, "route-utilization.csv")}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={routeUtilizationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="route" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="utilization" fill="#3b82f6" name="Utilization %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Payment Trends</CardTitle>
            <Button variant="outline" size="sm" onClick={() => downloadJsonAsCsv(paymentTrendData, "payment-trends.csv")}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={paymentTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue (Rs.)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Driver Performance Analytics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Driver Performance Analytics</CardTitle>
          <Button variant="outline" size="sm" onClick={() => downloadJsonAsCsv(driverPerformanceData, "driver-performance.csv")}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {driverPerformanceData.map((driver, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{driver.driver}</p>
                  <p className="text-sm text-gray-500">Total Trips: {driver.trips}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Rating</p>
                    <p className={`font-medium ${driver.rating < 3.5 ? 'text-red-600' : 'text-gray-900'}`}>
                      ★ {driver.rating}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">On-Time %</p>
                    <p className={`font-medium ${driver.onTime < 85 ? 'text-red-600' : driver.onTime >= 95 ? 'text-green-600' : 'text-gray-900'}`}>
                      {driver.onTime}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="er-hover-lift">
          <CardHeader>
            <CardTitle>Financial Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => downloadJsonAsCsv(paymentTrendData, "revenue-report.csv")}>
                <Download className="h-4 w-4 mr-2" />
                Revenue Report
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => downloadJsonAsCsv(paymentTrendData.map((d) => ({ ...d, type: "transaction" })), "transactions.csv")}
              >
                <Download className="h-4 w-4 mr-2" />
                Transaction History
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  downloadJsonAsCsv(
                    paymentTrendData.map((d) => ({ month: d.month, commission: Math.round((d.revenue || 0) * 0.05) })),
                    "commission-report.csv"
                  )
                }
              >
                <Download className="h-4 w-4 mr-2" />
                Commission Report
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => toast.message("No refunds recorded", { description: "Refund pipeline is empty for the current period." })}
              >
                <Download className="h-4 w-4 mr-2" />
                Refund Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="er-hover-lift">
          <CardHeader>
            <CardTitle>Operational Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => downloadJsonAsCsv(routeUtilizationData, "route-efficiency.csv")}>
                <Download className="h-4 w-4 mr-2" />
                Route Efficiency
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => downloadJsonAsCsv(driverPerformanceData, "driver-performance.csv")}>
                <Download className="h-4 w-4 mr-2" />
                Driver Performance
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  downloadJsonAsCsv(
                    driverPerformanceData.map((d) => ({ driver: d.driver, trips: d.trips, onTime: d.onTime })),
                    "trip-analytics.csv"
                  )
                }
              >
                <Download className="h-4 w-4 mr-2" />
                Trip Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => downloadJsonAsCsv(routeUtilizationData, "utilization.csv")}>
                <Download className="h-4 w-4 mr-2" />
                Utilization Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="er-hover-lift">
          <CardHeader>
            <CardTitle>User Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => downloadJsonAsCsv(userGrowthData, "user-growth.csv")}>
                <Download className="h-4 w-4 mr-2" />
                User Growth
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => downloadJsonAsCsv(userGrowthData.map((d) => ({ month: d.month, parents: d.parents })), "parent-activity.csv")}
              >
                <Download className="h-4 w-4 mr-2" />
                Parent Activity
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => downloadJsonAsCsv(driverPerformanceData, "driver-stats.csv")}>
                <Download className="h-4 w-4 mr-2" />
                Driver Stats
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  downloadJsonAsCsv(
                    driverPerformanceData.map((d) => ({ driver: d.driver, satisfaction: Math.round(((d.rating || 0) / 5) * 100) })),
                    "satisfaction-survey.csv"
                  )
                }
              >
                <Download className="h-4 w-4 mr-2" />
                Satisfaction Survey
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalTrips.toLocaleString()}</div>
            <p className="text-sm text-gray-500 mt-1">Total Trips Completed</p>
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
            <div className="text-2xl font-bold">{parentSatisfaction}%</div>
            <p className="text-sm text-gray-500 mt-1">Parent Satisfaction (from rating data)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{routeUtilizationData.length}</div>
            <p className="text-sm text-gray-500 mt-1">Routes in analytics dataset</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
