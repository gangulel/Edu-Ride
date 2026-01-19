import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Select } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { DollarSign, TrendingUp, AlertCircle, Download, Filter } from "lucide-react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const payments = [
  { id: "PAY-001", parent: "Sanduni Wickramasinghe", driver: "Kumara Silva", route: "Route A", amount: 75000, date: "2024-12-10", status: "paid", type: "monthly" },
  { id: "PAY-002", parent: "Rajith Perera", driver: "Nimal Perera", route: "Route B", amount: 75000, date: "2024-12-09", status: "paid", type: "monthly" },
  { id: "PAY-003", parent: "Dilini Fernando", driver: "Chaminda Fernando", route: "Route C", amount: 20000, date: "2024-12-08", status: "failed", type: "weekly" },
  { id: "PAY-004", parent: "Kasun Jayasuriya", driver: "Kumara Silva", route: "Route A", amount: 75000, date: "2024-12-07", status: "pending", type: "monthly" },
  { id: "PAY-005", parent: "Nimali Seneviratne", driver: "Ayesha Jayawardena", route: "Route D", amount: 20000, date: "2024-12-06", status: "paid", type: "weekly" },
]

const monthlyRevenue = [
  { month: "Jul", revenue: 17400000, commission: 870000 },
  { month: "Aug", revenue: 18300000, commission: 915000 },
  { month: "Sep", revenue: 17700000, commission: 885000 },
  { month: "Oct", revenue: 19200000, commission: 960000 },
  { month: "Nov", revenue: 18600000, commission: 930000 },
  { month: "Dec", revenue: 19500000, commission: 975000 },
]

export function PaymentManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2>Payment & Transaction Management</h2>
          <p className="text-gray-500 mt-1">Monitor payments, transactions, and revenue</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RS 19,500,000</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600">+10.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Successful Payments</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">5,842</div>
            <p className="text-xs text-gray-500 mt-1">96.8% success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Failed Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">193</div>
            <p className="text-xs text-gray-500 mt-1">3.2% failure rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">RS 975,000</div>
            <p className="text-xs text-gray-500 mt-1">5% of total revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commission Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="commission" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input type="date" placeholder="Start Date" />
            <Input type="date" placeholder="End Date" />
            <Select>
              <option value="">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </Select>
            <Select>
              <option value="">All Types</option>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                  <TableCell>{payment.parent}</TableCell>
                  <TableCell>{payment.driver}</TableCell>
                  <TableCell>{payment.route}</TableCell>
                  <TableCell className="font-medium">RS {payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      payment.status === 'paid' ? 'success' : 
                      payment.status === 'failed' ? 'destructive' : 'warning'
                    }>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">View</Button>
                      {payment.status === 'failed' && (
                        <Button size="sm" variant="outline">Retry</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">RS 3,735,000</div>
            <p className="text-sm text-gray-500 mt-2">49 pending transactions</p>
            <Button className="mt-4 w-full" variant="outline">Review Pending</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Failed Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">RS 1,447,500</div>
            <p className="text-sm text-gray-500 mt-2">193 failed transactions</p>
            <Button className="mt-4 w-full" variant="outline">Handle Failures</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Refunds & Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">8</div>
            <p className="text-sm text-gray-500 mt-2">Pending resolution</p>
            <Button className="mt-4 w-full" variant="outline">Manage Disputes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
