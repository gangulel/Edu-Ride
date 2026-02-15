import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select } from "./ui/select"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"
import { AlertCircle, MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react"

const complaints = [
  { id: "COMP-001", user: "Nimalka Perera", type: "parent", category: "Late Pickup", priority: "high", status: "open", date: "2024-12-10", assignedTo: "Admin Team" },
  { id: "COMP-002", user: "Kasun Bandara", type: "driver", category: "Route Issue", priority: "medium", status: "in-progress", date: "2024-12-09", assignedTo: "Sunil Admin" },
  { id: "COMP-003", user: "Dilini Fernando", type: "parent", category: "Safety Concern", priority: "high", status: "open", date: "2024-12-08", assignedTo: "Unassigned" },
  { id: "COMP-004", user: "Chaminda Silva", type: "parent", category: "Payment Issue", priority: "low", status: "resolved", date: "2024-12-07", assignedTo: "Amali Admin" },
  { id: "COMP-005", user: "Sanduni Wijesinghe", type: "driver", category: "Vehicle Problem", priority: "medium", status: "in-progress", date: "2024-12-06", assignedTo: "Admin Team" },
]

export function ComplaintsSupport() {
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const openComplaintDetails = (complaint: any) => {
    setSelectedComplaint(complaint)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2>Complaints & Support Management</h2>
        <p className="text-gray-500 mt-1">Track and resolve user complaints and support tickets</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Complaints</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Open Tickets</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">42</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">198</div>
            <p className="text-xs text-gray-500 mt-1">79.8% resolution rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">8</div>
            <p className="text-xs text-gray-500 mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Search by ID or user..." />
            <Select>
              <option value="">All Categories</option>
              <option value="late">Late Pickup</option>
              <option value="safety">Safety Concern</option>
              <option value="payment">Payment Issue</option>
              <option value="route">Route Issue</option>
              <option value="vehicle">Vehicle Problem</option>
            </Select>
            <Select>
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
            <Select>
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </Select>
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
              {complaints.map((complaint) => (
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
            <CardTitle>Average Resolution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2.4 days</div>
            <p className="text-sm text-gray-500 mt-2">
              <span className="text-green-600">-0.6 days</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Common Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Late Pickup</span>
                <span className="text-sm font-medium">34%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Safety Concerns</span>
                <span className="text-sm font-medium">22%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Payment Issues</span>
                <span className="text-sm font-medium">18%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Sunil Admin</span>
                <Badge variant="success">98%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Amali Admin</span>
                <Badge variant="success">95%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Admin Team</span>
                <Badge variant="success">92%</Badge>
              </div>
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
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Driver was consistently late for pickup, causing inconvenience. This has happened multiple times over the past week.
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Admin Response</p>
                <Textarea placeholder="Enter your response..." rows={4} />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Change Status</p>
                <Select>
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
            <Button onClick={() => setDialogOpen(false)}>
              Save Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
