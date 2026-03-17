import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Select } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { DollarSign, TrendingUp, AlertCircle, Download } from "lucide-react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { apiRequest } from "../lib/api"

type BookingItem = {
  _id: string
  parent?: { fullName?: string }
  driver?: { fullName?: string }
  route?: { name?: string }
  monthlyFee: number
  createdAt: string
  status: "pending" | "accepted" | "rejected" | "cancelled" | "expired"
}

export function PaymentManagement() {
  const [payments, setPayments] = useState<BookingItem[]>([])
  const [error, setError] = useState("")
  const shouldShowError = Boolean(error) && !/no token provided|unauthorized|forbidden/i.test(error)

  useEffect(() => {
    let mounted = true

    apiRequest<{ bookings: BookingItem[] }>("/bookings?limit=100")
      .then((payload) => {
        if (mounted) {
          setPayments(payload.bookings)
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

  const totals = useMemo(() => {
    const totalRevenue = payments.reduce((sum, p) => sum + (p.status === "accepted" ? p.monthlyFee : 0), 0)
    const successful = payments.filter((p) => p.status === "accepted").length
    const failed = payments.filter((p) => ["rejected", "expired"].includes(p.status)).length
    const pending = payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.monthlyFee, 0)

    return {
      totalRevenue,
      successful,
      failed,
      successRate: payments.length ? Math.round((successful / payments.length) * 1000) / 10 : 0,
      pending,
      commission: Math.round(totalRevenue * 0.05),
    }
  }, [payments])

  const monthlyRevenue = useMemo(() => {
    const map = new Map<string, { month: string; revenue: number; commission: number }>()
    for (const item of payments) {
      const month = new Date(item.createdAt).toLocaleString("en-US", { month: "short" })
      const current = map.get(month) || { month, revenue: 0, commission: 0 }
      if (item.status === "accepted") {
        current.revenue += item.monthlyFee
        current.commission += Math.round(item.monthlyFee * 0.05)
      }
      map.set(month, current)
    }

    return Array.from(map.values())
  }, [payments])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2>Payment & Transaction Management</h2>
          <p className="text-gray-500 mt-1">Monitor payments, transactions, and revenue</p>
          {shouldShowError ? <p className="text-sm text-red-600 mt-2">{error}</p> : null}
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
            <div className="text-2xl font-bold">Rs. {totals.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              Accepted booking revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Successful Payments</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totals.successful}</div>
            <p className="text-xs text-gray-500 mt-1">{totals.successRate}% success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Failed Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totals.failed}</div>
            <p className="text-xs text-gray-500 mt-1">Rejected/expired bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Rs. {totals.commission.toLocaleString()}</div>
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
                <TableRow key={payment._id}>
                  <TableCell className="font-mono text-sm">{payment._id.slice(-8).toUpperCase()}</TableCell>
                  <TableCell>{payment.parent?.fullName || "--"}</TableCell>
                  <TableCell>{payment.driver?.fullName || "--"}</TableCell>
                  <TableCell>{payment.route?.name || "--"}</TableCell>
                  <TableCell className="font-medium">Rs. {payment.monthlyFee.toLocaleString()}</TableCell>
                  <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">monthly</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      payment.status === 'accepted' ? 'success' :
                        ["rejected", "expired"].includes(payment.status) ? 'destructive' : 'warning'
                    }>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">View</Button>
                      {["rejected", "expired"].includes(payment.status) && (
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
            <div className="text-3xl font-bold text-yellow-600">Rs. {totals.pending.toLocaleString()}</div>
            <p className="text-sm text-gray-500 mt-2">{payments.filter((p) => p.status === "pending").length} pending transactions</p>
            <Button className="mt-4 w-full" variant="outline">Review Pending</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Failed Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">Rs. {payments.filter((p) => ["rejected", "expired"].includes(p.status)).reduce((sum, p) => sum + p.monthlyFee, 0).toLocaleString()}</div>
            <p className="text-sm text-gray-500 mt-2">{totals.failed} failed transactions</p>
            <Button className="mt-4 w-full" variant="outline">Handle Failures</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Refunds & Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">0</div>
            <p className="text-sm text-gray-500 mt-2">Pending resolution</p>
            <Button className="mt-4 w-full" variant="outline">Manage Disputes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
