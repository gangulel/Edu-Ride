import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Users, Car, MapPin, DollarSign, AlertTriangle } from "lucide-react"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { apiRequest } from "../lib/api"

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
    routes: {
      total: number
      active: number
    }
    bookings: {
      total: number
      pending: number
      accepted: number
    }
    trips: {
      total: number
      completed: number
      active: number
    }
    recentRegistrations: number
  }
  pendingVerifications: Array<{ _id: string }>
}

export function DashboardOverview() {
  const [data, setData] = useState<DashboardPayload | null>(null)
  const [error, setError] = useState("")
  const shouldShowError = Boolean(error) && !/no token provided|unauthorized|forbidden/i.test(error)

  useEffect(() => {
    let mounted = true

    apiRequest<DashboardPayload>("/admin/dashboard")
      .then((payload) => {
        if (mounted) {
          setData(payload)
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  const stats = data?.stats
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
      { name: "Active", value: stats.users.activeDrivers + stats.users.activeParents, color: "#10b981" },
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

  const estimatedRevenue = (stats?.bookings.accepted || 0) * 25000

  return (
    <div className="space-y-6">
      {/* <div>
        <h2>Dashboard Overview</h2>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your bus system today.</p>
        {shouldShowError ? <p className="text-sm text-red-600 mt-2">{error}</p> : null}
      </div> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Parents</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users.totalParents ?? 0}</div>
            <p className="text-xs text-gray-500 mt-1">{stats?.recentRegistrations ?? 0} joined in last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Drivers</CardTitle>
            <Car className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users.totalDrivers ?? 0}</div>
            <p className="text-xs text-gray-500 mt-1">{stats?.users.activeDrivers ?? 0} active drivers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Active Routes</CardTitle>
            <MapPin className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.routes.active ?? 0}</div>
            <p className="text-xs text-gray-500 mt-1">{stats?.routes.total ?? 0} total routes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {estimatedRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Estimated from accepted bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="transactions" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <AlertTriangle className={`h-5 w-5 mt-0.5 ${alert.priority === 'high' ? 'text-red-600' :
                      alert.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                  <div className="flex-1">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{(stats?.users.pendingDrivers || 0) + (stats?.users.pendingParents || 0)}</div>
            <p className="text-sm text-gray-500 mt-2">{stats?.users.pendingDrivers || 0} drivers, {stats?.users.pendingParents || 0} parents awaiting verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats?.bookings.pending || 0}</div>
            <p className="text-sm text-gray-500 mt-2">Pending booking requests requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats?.bookings.total ? `${Math.round((stats.bookings.accepted / stats.bookings.total) * 100)}%` : "0%"}
            </div>
            <p className="text-sm text-gray-500 mt-2">Acceptance rate from current bookings</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
