import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"
import { Search, Filter, Eye, Ban, CheckCircle } from "lucide-react"
import { apiRequest } from "../lib/api"

type AppUser = {
  _id: string
  fullName: string
  email: string
  phone: string
  role: "parent" | "driver" | "admin"
  status: "active" | "pending" | "suspended"
  reviewCount?: number
  rating?: number
  totalTrips?: number
  school?: string | null
  createdAt: string
}

type UserStatsPayload = {
  usersByRole: Array<{
    _id: {
      role: string
      status: string
    }
    count: number
  }>
}

const emptyRoleStats = {
  total: 0,
  active: 0,
  pending: 0,
  suspended: 0,
}

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<(AppUser & { type: "parent" | "driver" }) | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [parents, setParents] = useState<AppUser[]>([])
  const [drivers, setDrivers] = useState<AppUser[]>([])
  const [stats, setStats] = useState<UserStatsPayload | null>(null)
  const [error, setError] = useState("")
  const shouldShowError = Boolean(error) && !/no token provided|unauthorized|forbidden/i.test(error)

  useEffect(() => {
    let mounted = true

    Promise.all([
      apiRequest<{ users: AppUser[] }>("/users?role=parent&limit=100"),
      apiRequest<{ users: AppUser[] }>("/users?role=driver&limit=100"),
      apiRequest<UserStatsPayload>("/admin/users/stats"),
    ])
      .then(([parentData, driverData, statsData]) => {
        if (!mounted) return
        setParents(parentData.users)
        setDrivers(driverData.users)
        setStats(statsData)
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

  const parentFiltered = useMemo(
    () => parents.filter((u) => `${u.fullName} ${u.email} ${u.phone}`.toLowerCase().includes(searchTerm.toLowerCase())),
    [parents, searchTerm]
  )

  const driverFiltered = useMemo(
    () => drivers.filter((u) => `${u.fullName} ${u.email} ${u.phone} ${u.school || ""}`.toLowerCase().includes(searchTerm.toLowerCase())),
    [drivers, searchTerm]
  )

  const roleStats = useMemo(() => {
    if (!stats) {
      return { parent: emptyRoleStats, driver: emptyRoleStats }
    }

    const bucket = {
      parent: { ...emptyRoleStats },
      driver: { ...emptyRoleStats },
    }

    for (const item of stats.usersByRole) {
      const role = item._id.role as "parent" | "driver"
      if (!(role in bucket)) continue
      const status = item._id.status as "active" | "pending" | "suspended"
      if (status in bucket[role]) {
        bucket[role][status] = item.count
        bucket[role].total += item.count
      }
    }

    return bucket
  }, [stats])

  const openUserDetails = (user: AppUser, type: 'parent' | 'driver') => {
    setSelectedUser({ ...user, type })
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2>User Management</h2>
        <p className="text-gray-500 mt-1">Manage parents and drivers in your bus system</p>
        {shouldShowError ? <p className="text-sm text-red-600 mt-2">{error}</p> : null}
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
                <div className="text-2xl font-bold">{roleStats.parent.total}</div>
                <p className="text-sm text-gray-500">Total Parents</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">{roleStats.parent.active}</div>
                <p className="text-sm text-gray-500">Active</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-yellow-600">{roleStats.parent.pending}</div>
                <p className="text-sm text-gray-500">Pending Verification</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-600">{roleStats.parent.suspended}</div>
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
                  {parentFiltered.map((parent) => (
                    <TableRow key={parent._id}>
                      <TableCell>{parent.fullName}</TableCell>
                      <TableCell>{parent.email}</TableCell>
                      <TableCell>{parent.phone}</TableCell>
                      <TableCell>--</TableCell>
                      <TableCell>
                        <Badge variant={
                          parent.status === 'active' ? 'success' :
                            parent.status === 'suspended' ? 'destructive' : 'warning'
                        }>
                          {parent.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-400">--</span>
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
                <div className="text-2xl font-bold">{roleStats.driver.total}</div>
                <p className="text-sm text-gray-500">Total Drivers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">{roleStats.driver.active}</div>
                <p className="text-sm text-gray-500">Active</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-yellow-600">{roleStats.driver.pending}</div>
                <p className="text-sm text-gray-500">Pending Verification</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-600">{roleStats.driver.suspended}</div>
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
                    <TableHead>School</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Trips</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {driverFiltered.map((driver) => (
                    <TableRow key={driver._id}>
                      <TableCell>{driver.fullName}</TableCell>
                      <TableCell>{driver.email}</TableCell>
                      <TableCell>{driver.school || "--"}</TableCell>
                      <TableCell>{new Date(driver.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {(driver.rating || 0) > 0 ? (
                          <div className="flex items-center">
                            <span className="text-yellow-600">★</span>
                            <span className="ml-1">{driver.rating?.toFixed(1)}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>{driver.totalTrips || 0}</TableCell>
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
            <DialogTitle>{selectedUser?.fullName}</DialogTitle>
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
                    <p>--</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">School</p>
                    <p>{selectedUser.school || "--"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rating</p>
                    <p>{(selectedUser.rating || 0) > 0 ? `★ ${selectedUser.rating}` : 'N/A'}</p>
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
