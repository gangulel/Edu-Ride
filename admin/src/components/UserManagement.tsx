import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"
import { Search, Filter, Eye, Ban, CheckCircle, AlertCircle } from "lucide-react"

const parents = [
  { id: 1, name: "Sanduni Wickramasinghe", email: "sanduni.w@email.com", phone: "+94771234567", children: 2, status: "active", joinDate: "2024-01-15", complaints: 0 },
  { id: 2, name: "Rajith Perera", email: "rajith.p@email.com", phone: "+94772234567", children: 1, status: "active", joinDate: "2024-02-20", complaints: 1 },
  { id: 3, name: "Dilini Fernando", email: "dilini.f@email.com", phone: "+94773234567", children: 3, status: "suspended", joinDate: "2023-11-10", complaints: 3 },
  { id: 4, name: "Kasun Jayasuriya", email: "kasun.j@email.com", phone: "+94774234567", children: 1, status: "pending", joinDate: "2024-12-01", complaints: 0 },
]

const drivers = [
  { id: 1, name: "Kumara Silva", email: "kumara.s@email.com", phone: "+94775234567", vehicle: "Bus-101", route: "Route A", status: "active", rating: 4.8, trips: 234 },
  { id: 2, name: "Nimal Perera", email: "nimal.p@email.com", phone: "+94776234567", vehicle: "Bus-102", route: "Route B", status: "active", rating: 4.9, trips: 312 },
  { id: 3, name: "Chaminda Fernando", email: "chaminda.f@email.com", phone: "+94777234567", vehicle: "Bus-103", route: "Route C", status: "pending", rating: 0, trips: 0 },
  { id: 4, name: "Ayesha Jayawardena", email: "ayesha.j@email.com", phone: "+94778234567", vehicle: "Bus-104", route: "Route D", status: "suspended", rating: 3.2, trips: 145 },
]

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const openUserDetails = (user: any, type: 'parent' | 'driver') => {
    setSelectedUser({ ...user, type })
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2>User Management</h2>
        <p className="text-gray-500 mt-1">Manage parents and drivers in your bus system</p>
      </div>

      <Tabs defaultValue="parents">
        <TabsList>
          <TabsTrigger value="parents">Parents</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
        </TabsList>

        <TabsContent value="parents" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search parents by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">1,254</div>
                <p className="text-sm text-gray-500">Total Parents</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">1,187</div>
                <p className="text-sm text-gray-500">Active</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-yellow-600">33</div>
                <p className="text-sm text-gray-500">Pending Verification</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-600">34</div>
                <p className="text-sm text-gray-500">Suspended</p>
              </CardContent>
            </Card>
          </div>

          {/* Parents Table */}
          <Card>
            <CardHeader>
              <CardTitle>Registered Parents</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Children</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Complaints</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parents.map((parent) => (
                    <TableRow key={parent.id}>
                      <TableCell>{parent.name}</TableCell>
                      <TableCell>{parent.email}</TableCell>
                      <TableCell>{parent.phone}</TableCell>
                      <TableCell>{parent.children}</TableCell>
                      <TableCell>
                        <Badge variant={
                          parent.status === 'active' ? 'success' : 
                          parent.status === 'suspended' ? 'destructive' : 'warning'
                        }>
                          {parent.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {parent.complaints > 0 ? (
                          <span className="text-red-600">{parent.complaints}</span>
                        ) : (
                          <span className="text-gray-400">0</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => openUserDetails(parent, 'parent')}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {parent.status === 'active' ? (
                            <Button size="sm" variant="ghost">
                              <Ban className="h-4 w-4 text-red-600" />
                            </Button>
                          ) : (
                            <Button size="sm" variant="ghost">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search drivers by name, email, or vehicle..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">381</div>
                <p className="text-sm text-gray-500">Total Drivers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">324</div>
                <p className="text-sm text-gray-500">Active</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-yellow-600">45</div>
                <p className="text-sm text-gray-500">Pending Verification</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-600">12</div>
                <p className="text-sm text-gray-500">Suspended</p>
              </CardContent>
            </Card>
          </div>

          {/* Drivers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Registered Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Trips</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drivers.map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell>{driver.name}</TableCell>
                      <TableCell>{driver.email}</TableCell>
                      <TableCell>{driver.vehicle}</TableCell>
                      <TableCell>{driver.route}</TableCell>
                      <TableCell>
                        {driver.rating > 0 ? (
                          <div className="flex items-center">
                            <span className="text-yellow-600">★</span>
                            <span className="ml-1">{driver.rating}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>{driver.trips}</TableCell>
                      <TableCell>
                        <Badge variant={
                          driver.status === 'active' ? 'success' : 
                          driver.status === 'suspended' ? 'destructive' : 'warning'
                        }>
                          {driver.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => openUserDetails(driver, 'driver')}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {driver.status === 'pending' && (
                            <Button size="sm" variant="ghost">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          {driver.status === 'active' && (
                            <Button size="sm" variant="ghost">
                              <Ban className="h-4 w-4 text-red-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedUser?.name}</DialogTitle>
            <DialogDescription>
              {selectedUser?.type === 'parent' ? 'Parent Details' : 'Driver Details'}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p>{selectedUser.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge variant={
                  selectedUser.status === 'active' ? 'success' : 
                  selectedUser.status === 'suspended' ? 'destructive' : 'warning'
                }>
                  {selectedUser.status}
                </Badge>
              </div>
              {selectedUser.type === 'driver' && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Vehicle</p>
                    <p>{selectedUser.vehicle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Assigned Route</p>
                    <p>{selectedUser.route}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rating</p>
                    <p>{selectedUser.rating > 0 ? `★ ${selectedUser.rating}` : 'N/A'}</p>
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Close</Button>
            <Button>Edit User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
