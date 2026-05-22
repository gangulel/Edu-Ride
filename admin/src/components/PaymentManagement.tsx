import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Select } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { DollarSign, TrendingUp, AlertCircle, Download, Search } from "lucide-react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { toast } from "sonner"
import { apiRequest } from "../lib/api"

type StatusKey = "" | "pending" | "accepted" | "rejected" | "cancelled" | "expired"

function downloadPaymentsCsv(rows: BookingItem[]) {
  if (!rows.length) {
    toast.message("Nothing to export", { description: "Adjust your filters and try again." })
    return
  }
  const escape = (value: unknown) => {
    const str = value === null || value === undefined ? "" : String(value)
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
  }
  const lines = [
    ["Payment ID", "Parent", "Driver", "Route", "Amount", "Date", "Status"].join(","),
    ...rows.map((row) =>
      [
        row._id,
        row.parent?.fullName || "",
        row.driver?.fullName || "",
        row.route?.name || "",
        row.monthlyFee,
        new Date(row.createdAt).toISOString(),
        row.status,
      ]
        .map(escape)
        .join(",")
    ),
  ]
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  toast.success("Export complete", { description: `${rows.length} payments saved as CSV.` })
}

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
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusKey>("")
  const [typeFilter, setTypeFilter] = useState("")
  const [activePayment, setActivePayment] = useState<BookingItem | null>(null)
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

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const created = new Date(payment.createdAt).getTime()
      if (startDate) {
        const start = new Date(startDate).setHours(0, 0, 0, 0)
        if (created < start) return false
      }
      if (endDate) {
        const end = new Date(endDate).setHours(23, 59, 59, 999)
        if (created > end) return false
      }
      if (statusFilter && payment.status !== statusFilter) return false
      // Type filter is purely cosmetic right now (only monthly is supported by backend).
      if (typeFilter && typeFilter !== "monthly") return false
      return true
    })
  }, [payments, startDate, endDate, statusFilter, typeFilter])

  const totals = useMemo(() => {
    const totalRevenue = filteredPayments.reduce((sum, p) => sum + (p.status === "accepted" ? p.monthlyFee : 0), 0)
    const successful = filteredPayments.filter((p) => p.status === "accepted").length
    const failed = filteredPayments.filter((p) => ["rejected", "expired"].includes(p.status)).length
    const pending = filteredPayments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.monthlyFee, 0)

    return {
      totalRevenue,
      successful,
      failed,
      successRate: filteredPayments.length ? Math.round((successful / filteredPayments.length) * 1000) / 10 : 0,
      pending,
      commission: Math.round(totalRevenue * 0.05),
    }
  }, [filteredPayments])

  const monthlyRevenue = useMemo(() => {
    const map = new Map<string, { month: string; revenue: number; commission: number }>()
    for (const item of filteredPayments) {
      const month = new Date(item.createdAt).toLocaleString("en-US", { month: "short" })
      const current = map.get(month) || { month, revenue: 0, commission: 0 }
      if (item.status === "accepted") {
        current.revenue += item.monthlyFee
        current.commission += Math.round(item.monthlyFee * 0.05)
      }
      map.set(month, current)
    }

    return Array.from(map.values())
  }, [filteredPayments])

  const clearFilters = () => {
    setStartDate("")
    setEndDate("")
    setStatusFilter("")
    setTypeFilter("")
  }

  const focusList = (status?: StatusKey) => {
    if (status) setStatusFilter(status)
    if (typeof window !== "undefined") {
      document.getElementById("payment-table")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm" style={{ color: "var(--er-text-muted)" }}>
          Showing {filteredPayments.length} of {payments.length} payments
        </div>
        <Button onClick={() => downloadPaymentsCsv(filteredPayments)}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {shouldShowError ? (
        <div className="er-banner er-banner-warning">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      ) : null}

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
                <CartesianGrid strokeDasharray="4 6" stroke="var(--er-border)" />
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
                <CartesianGrid strokeDasharray="4 6" stroke="var(--er-border)" />
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="text-xs font-medium" style={{ color: "var(--er-text-muted)" }}>Start date</label>
              <Input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium" style={{ color: "var(--er-text-muted)" }}>End date</label>
              <Input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium" style={{ color: "var(--er-text-muted)" }}>Status</label>
              <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusKey)} className="mt-1">
                <option value="">All statuses</option>
                <option value="accepted">Accepted</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium" style={{ color: "var(--er-text-muted)" }}>Type</label>
              <Select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="mt-1">
                <option value="">All types</option>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </Select>
            </div>
            <Button variant="outline" onClick={clearFilters}>
              Reset filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card id="payment-table">
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
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9}>
                    <div className="er-empty-state">No payments match the current filters.</div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
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
                        <Button size="sm" variant="ghost" onClick={() => setActivePayment(payment)}>
                          <Search className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                        {["rejected", "expired"].includes(payment.status) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              toast.message("Retry queued", {
                                description: `Booking ${payment._id.slice(-6)} flagged for retry.`,
                              })
                            }
                          >
                            Retry
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
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
            <p className="text-sm text-gray-500 mt-2">{filteredPayments.filter((p) => p.status === "pending").length} pending transactions</p>
            <Button className="mt-4 w-full" variant="outline" onClick={() => focusList("pending")}>Review Pending</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Failed Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">Rs. {filteredPayments.filter((p) => ["rejected", "expired"].includes(p.status)).reduce((sum, p) => sum + p.monthlyFee, 0).toLocaleString()}</div>
            <p className="text-sm text-gray-500 mt-2">{totals.failed} failed transactions</p>
            <Button className="mt-4 w-full" variant="outline" onClick={() => focusList("rejected")}>Handle Failures</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Refunds & Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">0</div>
            <p className="text-sm text-gray-500 mt-2">Pending resolution</p>
            <Button
              className="mt-4 w-full"
              variant="outline"
              onClick={() =>
                toast.message("No active disputes", {
                  description: "We'll alert you here as soon as one comes in.",
                })
              }
            >
              Manage Disputes
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={Boolean(activePayment)} onOpenChange={(open) => !open && setActivePayment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment details</DialogTitle>
            <DialogDescription>Full transaction breakdown for review.</DialogDescription>
          </DialogHeader>
          {activePayment ? (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p style={{ color: "var(--er-text-muted)" }}>Payment ID</p>
                <p className="font-mono">{activePayment._id}</p>
              </div>
              <div>
                <p style={{ color: "var(--er-text-muted)" }}>Status</p>
                <Badge variant={
                  activePayment.status === 'accepted' ? 'success' :
                    ["rejected", "expired"].includes(activePayment.status) ? 'destructive' : 'warning'
                }>{activePayment.status}</Badge>
              </div>
              <div>
                <p style={{ color: "var(--er-text-muted)" }}>Parent</p>
                <p>{activePayment.parent?.fullName || "—"}</p>
              </div>
              <div>
                <p style={{ color: "var(--er-text-muted)" }}>Driver</p>
                <p>{activePayment.driver?.fullName || "—"}</p>
              </div>
              <div>
                <p style={{ color: "var(--er-text-muted)" }}>Route</p>
                <p>{activePayment.route?.name || "—"}</p>
              </div>
              <div>
                <p style={{ color: "var(--er-text-muted)" }}>Amount</p>
                <p className="font-semibold">Rs. {activePayment.monthlyFee.toLocaleString()}</p>
              </div>
              <div>
                <p style={{ color: "var(--er-text-muted)" }}>Created</p>
                <p>{new Date(activePayment.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActivePayment(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
