import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select } from "./ui/select"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"
import { Bell, Send, MessageSquare, AlertTriangle, Plus } from "lucide-react"

const notifications = [
  { id: 1, title: "System Maintenance", recipient: "All Users", type: "announcement", date: "2024-12-10", status: "sent" },
  { id: 2, title: "Route A Delay", recipient: "Route A Parents", type: "alert", date: "2024-12-09", status: "sent" },
  { id: 3, title: "Holiday Schedule Update", recipient: "All Parents", type: "announcement", date: "2024-12-08", status: "sent" },
  { id: 4, title: "Driver Performance Review", recipient: "All Drivers", type: "announcement", date: "2024-12-07", status: "scheduled" },
]

const templates = [
  { id: 1, name: "Weather Alert", category: "Emergency", lastUsed: "2024-11-15" },
  { id: 2, name: "Route Delay", category: "Alert", lastUsed: "2024-12-09" },
  { id: 3, name: "Payment Reminder", category: "Payment", lastUsed: "2024-12-01" },
  { id: 4, name: "Holiday Notice", category: "Announcement", lastUsed: "2024-11-20" },
]

export function CommunicationManagement() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2>Communication & Notification Management</h2>
          <p className="text-gray-500 mt-1">Send announcements and manage notifications</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Send className="h-4 w-4 mr-2" />
          Send Notification
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Sent</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Delivery Rate</CardTitle>
            <Send className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98.5%</div>
            <p className="text-xs text-gray-500 mt-1">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Emergency Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500 mt-1">Sent this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Active Templates</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-gray-500 mt-1">Ready to use</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Send Emergency Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Notify all users about urgent situations like weather, strikes, or delays
            </p>
            <Button variant="destructive" className="w-full">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Send Emergency Alert
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Announcement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Share important updates and announcements with all users
            </p>
            <Button className="w-full">
              <Bell className="h-4 w-4 mr-2" />
              Create Announcement
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Targeted Message</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Send specific messages to parents or drivers by route or group
            </p>
            <Button variant="outline" className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Send Targeted Message
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Recipient Group</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date Sent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">{notification.title}</TableCell>
                  <TableCell>{notification.recipient}</TableCell>
                  <TableCell>
                    <Badge variant={
                      notification.type === 'alert' ? 'warning' : 
                      notification.type === 'emergency' ? 'destructive' : 'default'
                    }>
                      {notification.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{notification.date}</TableCell>
                  <TableCell>
                    <Badge variant={notification.status === 'sent' ? 'success' : 'secondary'}>
                      {notification.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Message Templates */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Message Templates</CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{template.category}</Badge>
                  </TableCell>
                  <TableCell>{template.lastUsed}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setSelectedTemplate(template)}>
                        Use
                      </Button>
                      <Button size="sm" variant="ghost">Edit</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Send Notification Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
            <DialogDescription>
              Compose and send a notification to your users
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Recipient Group</label>
              <Select className="mt-1">
                <option value="">Select recipient group...</option>
                <option value="all">All Users</option>
                <option value="parents">All Parents</option>
                <option value="drivers">All Drivers</option>
                <option value="route">Specific Route</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Notification Type</label>
              <Select className="mt-1">
                <option value="announcement">Announcement</option>
                <option value="alert">Alert</option>
                <option value="emergency">Emergency</option>
                <option value="reminder">Reminder</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input className="mt-1" placeholder="Enter notification title..." />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea className="mt-1" placeholder="Enter your message..." rows={6} />
            </div>
            <div>
              <label className="text-sm font-medium">Schedule</label>
              <Select className="mt-1">
                <option value="now">Send Now</option>
                <option value="schedule">Schedule for Later</option>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setDialogOpen(false)}>
              <Send className="h-4 w-4 mr-2" />
              Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
