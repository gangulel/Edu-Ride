import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select } from "./ui/select"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"
import { Bell, Send, MessageSquare, AlertTriangle, Plus } from "lucide-react"
import { toast } from "sonner"
import { fetchAdminContent } from "../lib/adminContent"

type Notification = {
  id: string
  title: string
  recipient: string
  type: "announcement" | "alert" | "emergency" | "reminder"
  date: string
  status: "sent" | "scheduled" | "draft"
  message?: string
}

type Template = {
  id: string
  name: string
  category: string
  lastUsed: string
  body?: string
}

type ComposeState = {
  recipient: string
  type: Notification["type"]
  title: string
  message: string
  schedule: "now" | "schedule"
}

const emptyCompose: ComposeState = {
  recipient: "",
  type: "announcement",
  title: "",
  message: "",
  schedule: "now",
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}

export function CommunicationManagement() {
  const [remoteNotifications, setRemoteNotifications] = useState<Notification[]>([])
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([])
  const [remoteTemplates, setRemoteTemplates] = useState<Template[]>([])
  const [localTemplates, setLocalTemplates] = useState<Template[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [compose, setCompose] = useState<ComposeState>(emptyCompose)
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null)
  const [templateDialog, setTemplateDialog] = useState<{ mode: "new" | "edit"; template: Template } | null>(null)

  useEffect(() => {
    fetchAdminContent()
      .then((payload) => {
        setRemoteNotifications((payload.communication?.notifications as Notification[]) || [])
        setRemoteTemplates((payload.communication?.templates as Template[]) || [])
      })
      .catch(() => {
        setRemoteNotifications([])
        setRemoteTemplates([])
      })
  }, [])

  const notifications = useMemo(
    () => [...localNotifications, ...remoteNotifications],
    [localNotifications, remoteNotifications]
  )
  const templates = useMemo(() => [...localTemplates, ...remoteTemplates], [localTemplates, remoteTemplates])

  const sentCount = useMemo(() => notifications.filter((item) => item.status === "sent").length, [notifications])
  const emergencyCount = useMemo(
    () => notifications.filter((item) => item.type === "emergency" || item.type === "alert").length,
    [notifications]
  )
  const totalNotifications = notifications.length
  const deliveryRate = totalNotifications ? Math.round((sentCount / totalNotifications) * 1000) / 10 : 0

  const openComposer = (preset: Partial<ComposeState> = {}) => {
    setCompose({ ...emptyCompose, ...preset })
    setDialogOpen(true)
  }

  const sendCompose = () => {
    if (!compose.title.trim() || !compose.message.trim()) {
      toast.error("Missing fields", { description: "Title and message are required." })
      return
    }
    const notification: Notification = {
      id: createId(),
      title: compose.title.trim(),
      recipient: compose.recipient || "All Users",
      type: compose.type,
      date: new Date().toLocaleString(),
      status: compose.schedule === "now" ? "sent" : "scheduled",
      message: compose.message.trim(),
    }
    setLocalNotifications((prev) => [notification, ...prev])
    setDialogOpen(false)
    setCompose(emptyCompose)
    toast.success(
      notification.status === "sent" ? "Notification sent" : "Notification scheduled",
      { description: `${notification.title} → ${notification.recipient}` }
    )
  }

  const useTemplate = (template: Template) => {
    openComposer({
      title: template.name,
      message: template.body || "",
      type: (template.category?.toLowerCase() as Notification["type"]) || "announcement",
    })
  }

  const editTemplate = (template: Template) => {
    setTemplateDialog({ mode: "edit", template: { ...template } })
  }

  const persistTemplate = () => {
    if (!templateDialog) return
    const { template, mode } = templateDialog
    if (!template.name.trim()) {
      toast.error("Template name required")
      return
    }
    setLocalTemplates((prev) => {
      if (mode === "edit" && prev.some((item) => item.id === template.id)) {
        return prev.map((item) => (item.id === template.id ? template : item))
      }
      return [{ ...template, id: template.id || createId(), lastUsed: template.lastUsed || "Just now" }, ...prev]
    })
    toast.success(mode === "new" ? "Template created" : "Template updated")
    setTemplateDialog(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm" style={{ color: "var(--er-text-muted)" }}>
          {notifications.length} notifications · {templates.length} templates
        </div>
        <Button onClick={() => openComposer()}>
          <Send className="h-4 w-4 mr-2" />
          Send Notification
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="animate-fade-up er-hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Sent</CardTitle>
            <MessageSquare className="h-4 w-4" style={{ color: "var(--er-text-muted)" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sentCount}</div>
            <p className="text-xs mt-1" style={{ color: "var(--er-text-muted)" }}>This month</p>
          </CardContent>
        </Card>

        <Card className="animate-fade-up er-hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Delivery Rate</CardTitle>
            <Send className="h-4 w-4" style={{ color: "var(--er-success)" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: "var(--er-success)" }}>{deliveryRate}%</div>
            <p className="text-xs mt-1" style={{ color: "var(--er-text-muted)" }}>Sent vs total notifications</p>
          </CardContent>
        </Card>

        <Card className="animate-fade-up er-hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Emergency Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4" style={{ color: "var(--er-danger)" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emergencyCount}</div>
            <p className="text-xs mt-1" style={{ color: "var(--er-text-muted)" }}>Sent this month</p>
          </CardContent>
        </Card>

        <Card className="animate-fade-up er-hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Active Templates</CardTitle>
            <Bell className="h-4 w-4" style={{ color: "var(--er-info)" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-xs mt-1" style={{ color: "var(--er-text-muted)" }}>Ready to use</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="animate-fade-up er-hover-lift">
          <CardHeader>
            <CardTitle>Send Emergency Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4" style={{ color: "var(--er-text-muted)" }}>
              Notify all users about urgent situations like weather, strikes, or delays
            </p>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() =>
                openComposer({ type: "emergency", recipient: "all", title: "URGENT: " })
              }
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Send Emergency Alert
            </Button>
          </CardContent>
        </Card>

        <Card className="animate-fade-up er-hover-lift">
          <CardHeader>
            <CardTitle>System Announcement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4" style={{ color: "var(--er-text-muted)" }}>
              Share important updates and announcements with all users
            </p>
            <Button className="w-full" onClick={() => openComposer({ type: "announcement", recipient: "all" })}>
              <Bell className="h-4 w-4 mr-2" />
              Create Announcement
            </Button>
          </CardContent>
        </Card>

        <Card className="animate-fade-up er-hover-lift">
          <CardHeader>
            <CardTitle>Targeted Message</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4" style={{ color: "var(--er-text-muted)" }}>
              Send specific messages to parents or drivers by route or group
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => openComposer({ type: "reminder", recipient: "parents" })}
            >
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
              {notifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="er-empty-state">No notifications yet. Start by sending one above.</div>
                  </TableCell>
                </TableRow>
              ) : (
                notifications.map((notification) => (
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
                      <Button size="sm" variant="ghost" onClick={() => setActiveNotification(notification)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Message Templates */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Message Templates</CardTitle>
          <Button
            size="sm"
            onClick={() =>
              setTemplateDialog({
                mode: "new",
                template: { id: createId(), name: "", category: "General", lastUsed: "Just now", body: "" },
              })
            }
          >
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
              {templates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="er-empty-state">No templates yet. Click <b>New Template</b> to create one.</div>
                  </TableCell>
                </TableRow>
              ) : (
                templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{template.category}</Badge>
                    </TableCell>
                    <TableCell>{template.lastUsed}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => useTemplate(template)}>
                          Use
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => editTemplate(template)}>
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
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
              <Select
                className="mt-1"
                value={compose.recipient}
                onChange={(event) => setCompose((prev) => ({ ...prev, recipient: event.target.value }))}
              >
                <option value="">Select recipient group...</option>
                <option value="all">All Users</option>
                <option value="parents">All Parents</option>
                <option value="drivers">All Drivers</option>
                <option value="route">Specific Route</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Notification Type</label>
              <Select
                className="mt-1"
                value={compose.type}
                onChange={(event) =>
                  setCompose((prev) => ({ ...prev, type: event.target.value as Notification["type"] }))
                }
              >
                <option value="announcement">Announcement</option>
                <option value="alert">Alert</option>
                <option value="emergency">Emergency</option>
                <option value="reminder">Reminder</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                className="mt-1"
                placeholder="Enter notification title..."
                value={compose.title}
                onChange={(event) => setCompose((prev) => ({ ...prev, title: event.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea
                className="mt-1"
                placeholder="Enter your message..."
                rows={6}
                value={compose.message}
                onChange={(event) => setCompose((prev) => ({ ...prev, message: event.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Schedule</label>
              <Select
                className="mt-1"
                value={compose.schedule}
                onChange={(event) =>
                  setCompose((prev) => ({ ...prev, schedule: event.target.value as ComposeState["schedule"] }))
                }
              >
                <option value="now">Send Now</option>
                <option value="schedule">Schedule for Later</option>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={sendCompose}>
              <Send className="h-4 w-4 mr-2" />
              {compose.schedule === "now" ? "Send Notification" : "Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(activeNotification)} onOpenChange={(open) => !open && setActiveNotification(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeNotification?.title}</DialogTitle>
            <DialogDescription>
              Sent to <b>{activeNotification?.recipient}</b> · {activeNotification?.date}
            </DialogDescription>
          </DialogHeader>
          <div
            className="rounded-lg p-3 text-sm whitespace-pre-wrap"
            style={{ background: "var(--er-surface-muted)", color: "var(--er-text)" }}
          >
            {activeNotification?.message || "No additional body."}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveNotification(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(templateDialog)} onOpenChange={(open) => !open && setTemplateDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{templateDialog?.mode === "new" ? "New template" : "Edit template"}</DialogTitle>
            <DialogDescription>Reusable copy you can drop into outgoing notifications.</DialogDescription>
          </DialogHeader>
          {templateDialog ? (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={templateDialog.template.name}
                  onChange={(event) =>
                    setTemplateDialog({
                      ...templateDialog,
                      template: { ...templateDialog.template, name: event.target.value },
                    })
                  }
                  placeholder="e.g. Weather delay"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={templateDialog.template.category}
                  onChange={(event) =>
                    setTemplateDialog({
                      ...templateDialog,
                      template: { ...templateDialog.template, category: event.target.value },
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Body</label>
                <Textarea
                  rows={5}
                  value={templateDialog.template.body || ""}
                  onChange={(event) =>
                    setTemplateDialog({
                      ...templateDialog,
                      template: { ...templateDialog.template, body: event.target.value },
                    })
                  }
                />
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateDialog(null)}>Cancel</Button>
            <Button onClick={persistTemplate}>Save template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
