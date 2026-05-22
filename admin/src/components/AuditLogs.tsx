import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select } from "./ui/select"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Shield, AlertTriangle, User, Activity, Download } from "lucide-react"
import { toast } from "sonner"
import { fetchAdminContent } from "../lib/adminContent"

function downloadCsv<T extends Record<string, any>>(rows: T[], filename: string) {
  if (!rows.length) {
    toast.message("Nothing to export", { description: "No matching log rows." })
    return
  }
  const headers = Array.from(rows.reduce((acc, row) => { Object.keys(row).forEach((k) => acc.add(k)); return acc }, new Set<string>()))
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
  toast.success("Logs exported")
}

export function AuditLogs() {
  const [loginHistory, setLoginHistory] = useState<any[]>([])
  const [adminActions, setAdminActions] = useState<any[]>([])
  const [suspiciousActivity, setSuspiciousActivity] = useState<any[]>([])
  const [loginSearch, setLoginSearch] = useState("")
  const [loginStatusFilter, setLoginStatusFilter] = useState("")
  const [actionSearch, setActionSearch] = useState("")
  const [resolvedAlerts, setResolvedAlerts] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchAdminContent()
      .then((payload) => {
        setLoginHistory(payload.audit?.loginHistory || [])
        setAdminActions(payload.audit?.adminActions || [])
        setSuspiciousActivity(payload.audit?.suspiciousActivity || [])
      })
      .catch(() => {
        setLoginHistory([])
        setAdminActions([])
        setSuspiciousActivity([])
      })
  }, [])

  const failedAttempts = useMemo(() => loginHistory.filter((item) => item.status === "failed").length, [loginHistory])
  const activeAlerts = useMemo(() => suspiciousActivity.filter((item) => item.status === "investigating").length, [suspiciousActivity])
  const recentSecurityEvents = useMemo(() => {
    const suspiciousEvents = suspiciousActivity.map((item) => ({
      id: `s-${item.id || item.timestamp || Math.random()}`,
      message: item.description || item.type || "Suspicious activity detected",
      timestamp: item.timestamp || "Recently",
      level: item.severity === "high" ? "high" : item.severity === "medium" ? "medium" : "low",
    }))

    const adminEvents = adminActions.map((item) => ({
      id: `a-${item.id || item.timestamp || Math.random()}`,
      message: `${item.admin || "Admin"}: ${item.action || "Action performed"}`,
      timestamp: item.timestamp || "Recently",
      level: item.severity === "high" ? "high" : item.severity === "medium" ? "medium" : "low",
    }))

    return [...suspiciousEvents, ...adminEvents].slice(0, 4)
  }, [adminActions, suspiciousActivity])

  const filteredLogins = useMemo(() => {
    const term = loginSearch.trim().toLowerCase()
    return loginHistory.filter((log) => {
      if (loginStatusFilter && log.status !== loginStatusFilter) return false
      if (!term) return true
      return [log.user, log.ip, log.location].filter(Boolean).some((v) => String(v).toLowerCase().includes(term))
    })
  }, [loginHistory, loginSearch, loginStatusFilter])

  const filteredActions = useMemo(() => {
    const term = actionSearch.trim().toLowerCase()
    if (!term) return adminActions
    return adminActions.filter((action) =>
      [action.admin, action.action, action.target, action.details]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term))
    )
  }, [adminActions, actionSearch])

  const isAlertResolved = (id: any) => resolvedAlerts.has(String(id))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm" style={{ color: "var(--er-text-muted)" }}>
          {loginHistory.length + adminActions.length + suspiciousActivity.length} total log entries
        </div>
        <Button
          onClick={() =>
            downloadCsv(
              [
                ...loginHistory.map((row) => ({ kind: "login", ...row })),
                ...adminActions.map((row) => ({ kind: "admin", ...row })),
                ...suspiciousActivity.map((row) => ({ kind: "suspicious", ...row })),
              ],
              "audit-logs.csv"
            )
          }
        >
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Logins</CardTitle>
            <User className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loginHistory.length}</div>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Failed Attempts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{failedAttempts}</div>
            <p className="text-xs text-gray-500 mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Admin Actions</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminActions.length}</div>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Security Alerts</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{activeAlerts}</div>
            <p className="text-xs text-gray-500 mt-1">Active investigations</p>
          </CardContent>
        </Card>
      </div>

      {/* Suspicious Activity Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Suspicious Activity Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {suspiciousActivity.length === 0 ? (
              <div className="er-empty-state">No suspicious activity in the current window. Good news!</div>
            ) : (
              suspiciousActivity.map((activity) => (
                <div
                  key={activity.id}
                  className={`p-4 border rounded-lg ${activity.severity === 'high' ? 'border-red-300 bg-red-50' : 'border-yellow-300 bg-yellow-50'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{activity.type}</p>
                        <Badge variant={activity.severity === 'high' ? 'destructive' : 'warning'}>
                          {activity.severity}
                        </Badge>
                      </div>
                      <p className="text-sm mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
                    <Badge variant={
                      isAlertResolved(activity.id)
                        ? "success"
                        : activity.status === 'blocked'
                        ? 'destructive'
                        : activity.status === 'resolved'
                        ? 'success'
                        : 'warning'
                    }>
                      {isAlertResolved(activity.id) ? "resolved" : activity.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toast.message("Opened investigation", {
                          description: activity.description || activity.type || "Reviewing event",
                        })
                      }
                    >
                      Investigate
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const next = new Set(resolvedAlerts)
                        next.add(String(activity.id))
                        setResolvedAlerts(next)
                        toast.success("Alert dismissed")
                      }}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Login History */}
      <Card>
        <CardHeader>
          <CardTitle>Login History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-3">
            <Input
              placeholder="Search by user or IP..."
              className="max-w-sm"
              value={loginSearch}
              onChange={(event) => setLoginSearch(event.target.value)}
            />
            <Select
              className="w-40"
              value={loginStatusFilter}
              onChange={(event) => setLoginStatusFilter(event.target.value)}
            >
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </Select>
            <Button variant="outline" onClick={() => downloadCsv(filteredLogins, "login-history.csv")}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="er-empty-state">No login attempts match.</div>
                  </TableCell>
                </TableRow>
              ) : null}
              {filteredLogins.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.role}</Badge>
                  </TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                  <TableCell>{log.location}</TableCell>
                  <TableCell className="text-sm">{log.timestamp}</TableCell>
                  <TableCell>
                    <Badge variant={log.status === 'success' ? 'success' : 'destructive'}>
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Admin Actions Log */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Actions Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-3">
            <Input
              placeholder="Search admin actions..."
              value={actionSearch}
              onChange={(event) => setActionSearch(event.target.value)}
              className="flex-1 min-w-[220px]"
            />
            <Button variant="outline" onClick={() => downloadCsv(filteredActions, "admin-actions.csv")}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="er-empty-state">No admin actions match.</div>
                  </TableCell>
                </TableRow>
              ) : null}
              {filteredActions.map((action) => (
                <TableRow key={action.id}>
                  <TableCell className="font-medium">{action.admin}</TableCell>
                  <TableCell>{action.action}</TableCell>
                  <TableCell>{action.target}</TableCell>
                  <TableCell className="text-sm">{action.details}</TableCell>
                  <TableCell className="text-sm">{action.timestamp}</TableCell>
                  <TableCell>
                    <Badge variant={
                      action.severity === 'high' ? 'destructive' :
                        action.severity === 'medium' ? 'warning' : 'secondary'
                    }>
                      {action.severity}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* System Security Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                </div>
                <Badge variant="success">Enabled</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Session Timeout</p>
                  <p className="text-sm text-gray-500">Auto logout after inactivity</p>
                </div>
                <span className="text-sm">30 minutes</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Password Policy</p>
                  <p className="text-sm text-gray-500">Minimum requirements</p>
                </div>
                <Badge variant="success">Strong</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">IP Whitelist</p>
                  <p className="text-sm text-gray-500">Restrict admin access by IP</p>
                </div>
                <Badge variant="secondary">Disabled</Badge>
              </div>
            </div>
            <Button
              className="w-full mt-4"
              onClick={() =>
                toast.message("Security console", {
                  description: "Open System Settings to manage IP whitelist, 2FA and session policies.",
                })
              }
            >
              Configure Security
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Security Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSecurityEvents.length ? recentSecurityEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <div className={`h-2 w-2 rounded-full mt-2 ${event.level === "high" ? "bg-red-600" : event.level === "medium" ? "bg-yellow-600" : "bg-green-600"}`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.message}</p>
                    <p className="text-xs text-gray-500">{event.timestamp}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500">No recent security events from backend.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
