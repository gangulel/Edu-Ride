import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Users, Car, MapPin, DollarSign, AlertTriangle, TrendingUp } from "lucide-react"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const monthlyData = [
  { month: "Jan", transactions: 4500, revenue: 13500000 },
  { month: "Feb", transactions: 5200, revenue: 15600000 },
  { month: "Mar", transactions: 4800, revenue: 14400000 },
  { month: "Apr", transactions: 6100, revenue: 18300000 },
  { month: "May", transactions: 5900, revenue: 17700000 },
  { month: "Jun", transactions: 6500, revenue: 19500000 },
]

const statusData = [
  { name: "Active", value: 324, color: "#10b981" },
  { name: "Pending", value: 45, color: "#f59e0b" },
  { name: "Suspended", value: 12, color: "#ef4444" },
]

const alerts = [
  { id: 1, type: "complaint", message: "Parent complaint about late pickup", priority: "high", time: "10 mins ago" },
  { id: 2, type: "payment", message: "5 payment failures detected", priority: "medium", time: "1 hour ago" },
  { id: 3, type: "verification", message: "12 drivers pending verification", priority: "medium", time: "2 hours ago" },
  { id: 4, type: "system", message: "Route overlap detected in Zone A", priority: "low", time: "3 hours ago" },
]

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2>Dashboard Overview</h2>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your bus system today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Parents</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,254</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Drivers</CardTitle>
            <Car className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">381</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Active Routes</CardTitle>
            <MapPin className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-blue-600">8 routes</span> added this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RS 19,500,000</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600">+10.2%</span> from last month
            </p>
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
                  <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                    alert.priority === 'high' ? 'text-red-600' : 
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
            <div className="text-3xl font-bold text-yellow-600">45</div>
            <p className="text-sm text-gray-500 mt-2">12 drivers, 33 parents awaiting verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">18</div>
            <p className="text-sm text-gray-500 mt-2">5 high priority, 13 pending resolution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">96.8%</div>
            <p className="text-sm text-gray-500 mt-2">3.2% failure rate this month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
