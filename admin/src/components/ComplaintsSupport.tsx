import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select } from "./ui/select"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"
import { AlertCircle, MessageSquare, Clock, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { fetchAdminContent } from "../lib/adminContent"

export function ComplaintsSupport() {
  const [complaints, setComplaints] = useState<any[]>([])
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [response, setResponse] = useState("")
  const [statusDraft, setStatusDraft] = useState("")

  useEffect(() => {
    fetchAdminContent()
      .then((payload) => {
        setComplaints(payload.complaints || [])
      })
      .catch(() => {
        setComplaints([])
      })
  }, [])

  const totalComplaints = complaints.length
  const openTickets = useMemo(() => complaints.filter((item) => ["open", "in-progress"].includes(item.status)).length, [complaints])
  const resolvedTickets = useMemo(() => complaints.filter((item) => item.status === "resolved").length, [complaints])
  const highPriority = useMemo(() => complaints.filter((item) => item.priority === "high").length, [complaints])
  const commonIssues = useMemo(() => {
    const bucket = new Map<string, number>()
    for (const complaint of complaints) {
      const category = String(complaint.category || "Uncategorized")
      bucket.set(category, (bucket.get(category) || 0) + 1)
    }
    return Array.from(bucket.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
  }, [complaints])
  const teamPerformance = useMemo(() => {
    const bucket = new Map<string, { total: number; resolved: number }>()
    for (const complaint of complaints) {
      const assignee = String(complaint.assignedTo || "Unassigned")
      if (assignee === "Unassigned") continue
      const current = bucket.get(assignee) || { total: 0, resolved: 0 }
      current.total += 1
      if (complaint.status === "resolved") {
        current.resolved += 1
      }
      bucket.set(assignee, current)
    }
    return Array.from(bucket.entries())
      .map(([name, stats]) => ({
        name,
        rate: stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0,
      }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 3)
  }, [complaints])

  const openComplaintDetails = (complaint: any) => {
    setSelectedComplaint(complaint)
    setResponse(complaint.response || "")
    setStatusDraft(complaint.status || "open")
    setDialogOpen(true)
  }

  const filteredComplaints = useMemo(() => {
    const term = search.trim().toLowerCase()
    return complaints.filter((complaint) => {
      if (categoryFilter && complaint.category !== categoryFilter) return false
      if (priorityFilter && complaint.priority !== priorityFilter) return false
      if (statusFilter && complaint.status !== statusFilter) return false
      if (!term) return true
      return [complaint.id, complaint.user, complaint.category]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    })
  }, [complaints, search, categoryFilter, priorityFilter, statusFilter])

  const saveResponse = () => {
    if (!selectedComplaint) return
    setComplaints((prev) =>
      prev.map((item) =>
        item.id === selectedComplaint.id
          ? { ...item, response, status: statusDraft || item.status }
          : item
      )
    )
    toast.success("Response saved", {
      description: `Ticket ${selectedComplaint.id} updated to ${statusDraft || selectedComplaint.status}.`,
    })
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* <div>
        <h2>Complaints & Support Management</h2>
        <p className="text-gray-500 mt-1">Track and resolve user complaints and support tickets</p>
      </div> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Complaints</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComplaints}</div>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Open Tickets</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{openTickets}</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resolvedTickets}</div>
            <p className="text-xs text-gray-500 mt-1">{totalComplaints ? Math.round((resolvedTickets / totalComplaints) * 1000) / 10 : 0}% resolution rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{highPriority}</div>
            <p className="text-xs text-gray-500 mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <Input
              placeholder="Search by ID or user..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="">All Categories</option>
              <option value="late">Late Pickup</option>
              <option value="safety">Safety Concern</option>
              <option value="payment">Payment Issue</option>
              <option value="route">Route Issue</option>
              <option value="vehicle">Vehicle Problem</option>
            </Select>
            <Select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
            <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("")
                setCategoryFilter("")
                setPriorityFilter("")
                setStatusFilter("")
              }}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Complaints Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>User Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9}>
                    <div className="er-empty-state">No complaints match the current filters.</div>
                  </TableCell>
                </TableRow>
              ) : null}
              {filteredComplaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-mono text-sm">{complaint.id}</TableCell>
                  <TableCell>{complaint.user}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{complaint.type}</Badge>
                  </TableCell>
                  <TableCell>{complaint.category}</TableCell>
                  <TableCell>
                    <Badge variant={
                      complaint.priority === 'high' ? 'destructive' :
                        complaint.priority === 'medium' ? 'warning' : 'secondary'
                    }>
                      {complaint.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      complaint.status === 'resolved' ? 'success' :
                        complaint.status === 'in-progress' ? 'warning' : 'default'
                    }>
                      {complaint.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{complaint.date}</TableCell>
                  <TableCell className="text-sm">
                    {complaint.assignedTo === 'Unassigned' ? (
                      <span className="text-gray-400">{complaint.assignedTo}</span>
                    ) : (
                      complaint.assignedTo
                    )}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => openComplaintDetails(complaint)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalComplaints ? Math.round((resolvedTickets / totalComplaints) * 1000) / 10 : 0}%</div>
            <p className="text-sm text-gray-500 mt-2">Resolved complaints from backend records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Common Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {commonIssues.length ? commonIssues.map(([category, count]) => (
                <div key={category} className="flex justify-between">
                  <span className="text-sm">{category}</span>
                  <span className="text-sm font-medium">{totalComplaints ? Math.round((count / totalComplaints) * 100) : 0}%</span>
                </div>
              )) : (
                <p className="text-sm text-gray-500">No complaint category data available.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {teamPerformance.length ? teamPerformance.map((member) => (
                <div key={member.name} className="flex justify-between">
                  <span className="text-sm">{member.name}</span>
                  <Badge variant={member.rate >= 80 ? "success" : member.rate >= 50 ? "warning" : "secondary"}>{member.rate}%</Badge>
                </div>
              )) : (
                <p className="text-sm text-gray-500">No assigned complaint data available.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Complaint Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complaint Details - {selectedComplaint?.id}</DialogTitle>
            <DialogDescription>
              Review and respond to this complaint
            </DialogDescription>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">User</p>
                  <p className="font-medium">{selectedComplaint.user}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User Type</p>
                  <Badge variant="outline">{selectedComplaint.type}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{selectedComplaint.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Priority</p>
                  <Badge variant={
                    selectedComplaint.priority === 'high' ? 'destructive' :
                      selectedComplaint.priority === 'medium' ? 'warning' : 'secondary'
                  }>
                    {selectedComplaint.priority}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant={
                    selectedComplaint.status === 'resolved' ? 'success' :
                      selectedComplaint.status === 'in-progress' ? 'warning' : 'default'
                  }>
                    {selectedComplaint.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date Submitted</p>
                  <p className="font-medium">{selectedComplaint.date}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Complaint Description</p>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">{selectedComplaint.description || "No description was provided for this complaint."}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Admin Response</p>
                <Textarea
                  placeholder="Enter your response..."
                  rows={4}
                  value={response}
                  onChange={(event) => setResponse(event.target.value)}
                />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Change Status</p>
                <Select value={statusDraft} onChange={(event) => setStatusDraft(event.target.value)}>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveResponse}>
              Save Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
