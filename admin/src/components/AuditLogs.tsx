import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select } from "./ui/select"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Shield, AlertTriangle, User, Activity, Download } from "lucide-react"

const loginHistory = [
  { id: 1, user: "admin@eduride.lk", role: "Super Admin", action: "Login", ip: "192.168.1.10", location: "Colombo, LK", timestamp: "2024-12-14 09:15:23", status: "success" },
  { id: 2, user: "sunil.admin@eduride.lk", role: "Admin", action: "Login", ip: "192.168.1.45", location: "Kandy, LK", timestamp: "2024-12-14 08:42:15", status: "success" },
  { id: 3, user: "unknown@email.com", role: "Unknown", action: "Failed Login", ip: "45.123.67.89", location: "Unknown", timestamp: "2024-12-14 07:30:11", status: "failed" },
  { id: 4, user: "amali.admin@eduride.lk", role: "Admin", action: "Login", ip: "192.168.1.78", location: "Galle, LK", timestamp: "2024-12-13 16:22:45", status: "success" },
]

const adminActions = [
  { id: 1, admin: "Sunil Admin", action: "Suspended Driver", target: "Nuwan Rajapaksa", details: "Low rating suspension", timestamp: "2024-12-14 10:30:00", severity: "high" },
  { id: 2, admin: "Amali Admin", action: "Updated Payment Settings", target: "Commission Rate", details: "Changed from 4% to 5%", timestamp: "2024-12-14 09:15:00", severity: "medium" },
  { id: 3, admin: "Admin Team", action: "Sent Notification", target: "All Parents", details: "Holiday schedule announcement", timestamp: "2024-12-13 14:20:00", severity: "low" },
  { id: 4, admin: "Sunil Admin", action: "Approved Driver", target: "Thilini Gunasekara", details: "Verified documents", timestamp: "2024-12-13 11:45:00", severity: "medium" },
  { id: 5, admin: "Super Admin", action: "Created Admin User", target: "pradeep.admin@eduride.lk", details: "New admin account created", timestamp: "2024-12-12 15:30:00", severity: "high" },
]

const suspiciousActivity = [
  { id: 1, type: "Multiple Failed Logins", description: "5 failed login attempts from IP 45.123.67.89", severity: "high", timestamp: "2024-12-14 07:30:11", status: "investigating" },
  { id: 2, type: "Unusual Payment Pattern", description: "Large number of refund requests from same parent", severity: "medium", timestamp: "2024-12-13 18:45:00", status: "resolved" },
  { id: 3, type: "Rapid Account Creation", description: "10 parent accounts created from same IP", severity: "high", timestamp: "2024-12-12 22:15:00", status: "blocked" },
]

export function AuditLogs() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2>Audit Logs & Security Monitoring</h2>
          <p className="text-gray-500 mt-1">Monitor system activity and security events</p>
        </div>
        <Button>
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
            <div className="text-2xl font-bold">1,842</div>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Failed Attempts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">23</div>
            <p className="text-xs text-gray-500 mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Admin Actions</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">387</div>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Security Alerts</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">5</div>
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
            {suspiciousActivity.map((activity) => (
              <div key={activity.id} className={`p-4 border rounded-lg ${activity.severity === 'high' ? 'border-red-300 bg-red-50' : 'border-yellow-300 bg-yellow-50'
                }`}>
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
                    activity.status === 'blocked' ? 'destructive' :
                      activity.status === 'resolved' ? 'success' : 'warning'
                  }>
                    {activity.status}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">Investigate</Button>
                  <Button size="sm" variant="ghost">Dismiss</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Login History */}
      <Card>
        <CardHeader>
          <CardTitle>Login History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <Input placeholder="Search by user or IP..." className="max-w-sm" />
            <Select className="w-40">
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </Select>
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
              {loginHistory.map((log) => (
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
          <div className="mb-4">
            <Input placeholder="Search admin actions..." />
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
              {adminActions.map((action) => (
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
            <Button className="w-full mt-4">Configure Security</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Security Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-red-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Multiple failed logins detected</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-green-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Security patch applied</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-yellow-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Unusual traffic pattern detected</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-green-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Database backup completed</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
