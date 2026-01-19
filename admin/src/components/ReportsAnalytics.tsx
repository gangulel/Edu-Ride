import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Select } from "./ui/select"
import { Download, TrendingUp, Users, DollarSign, Star } from "lucide-react"
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const userGrowthData = [
  { month: "Jan", parents: 980, drivers: 298 },
  { month: "Feb", parents: 1045, drivers: 315 },
  { month: "Mar", parents: 1098, drivers: 329 },
  { month: "Apr", parents: 1156, drivers: 345 },
  { month: "May", parents: 1189, drivers: 363 },
  { month: "Jun", parents: 1254, drivers: 381 },
]

const routeUtilizationData = [
  { route: "Route A", utilization: 93, capacity: 30, students: 28 },
  { route: "Route B", utilization: 97, capacity: 35, students: 34 },
  { route: "Route C", utilization: 73, capacity: 30, students: 22 },
  { route: "Route D", utilization: 89, capacity: 35, students: 31 },
  { route: "Route E", utilization: 87, capacity: 30, students: 26 },
]

const paymentTrendData = [
  { month: "Jan", revenue: 13500000, transactions: 4500, avgPerTransaction: 3000 },
  { month: "Feb", revenue: 15600000, transactions: 5200, avgPerTransaction: 3000 },
  { month: "Mar", revenue: 14400000, transactions: 4800, avgPerTransaction: 3000 },
  { month: "Apr", revenue: 18300000, transactions: 6100, avgPerTransaction: 3000 },
  { month: "May", revenue: 17700000, transactions: 5900, avgPerTransaction: 3000 },
  { month: "Jun", revenue: 19500000, transactions: 6500, avgPerTransaction: 3000 },
]

const driverPerformanceData = [
  { driver: "Nimal P.", rating: 4.9, trips: 312, onTime: 98 },
  { driver: "Kumara S.", rating: 4.8, trips: 234, onTime: 96 },
  { driver: "Sunil B.", rating: 4.7, trips: 267, onTime: 94 },
  { driver: "Ayesha J.", rating: 4.5, trips: 198, onTime: 92 },
  { driver: "Chaminda F.", rating: 3.2, trips: 145, onTime: 78 },
]

export function ReportsAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2>Reports & Analytics</h2>
          <p className="text-gray-500 mt-1">Comprehensive insights and data analytics</p>
        </div>
        <div className="flex gap-2">
          <Select className="w-40">
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </Select>
          <Button>
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
            <div className="text-2xl font-bold">1,635</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600">+10.5%</span> growth rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RS 99M</div>
            <p className="text-xs text-gray-500 mt-1">Last 6 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Avg. Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6</div>
            <p className="text-xs text-gray-500 mt-1">System-wide average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">88%</div>
            <p className="text-xs text-gray-500 mt-1">Route utilization</p>
          </CardContent>
        </Card>
      </div>

      {/* User Growth Report */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Growth Report</CardTitle>
          <Button variant="outline" size="sm">
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
            <Button variant="outline" size="sm">
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
            <Button variant="outline" size="sm">
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
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue ($)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Driver Performance Analytics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Driver Performance Analytics</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
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
        <Card>
          <CardHeader>
            <CardTitle>Financial Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Revenue Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Transaction History
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Commission Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Refund Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operational Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Route Efficiency
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Driver Performance
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Trip Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Utilization Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                User Growth
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Parent Activity
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Driver Stats
              </Button>
              <Button variant="outline" className="w-full justify-start">
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
            <div className="text-2xl font-bold">31,500</div>
            <p className="text-sm text-gray-500 mt-1">Total Trips Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">94.2%</div>
            <p className="text-sm text-gray-500 mt-1">On-Time Performance</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">87.5%</div>
            <p className="text-sm text-gray-500 mt-1">Parent Satisfaction</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">156</div>
            <p className="text-sm text-gray-500 mt-1">Active Routes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
