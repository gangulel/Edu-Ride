import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"
import { Search, Filter, Eye, Ban, Pencil, Trash2, AlertTriangle, Download } from "lucide-react"
import { toast } from "sonner"
import { apiRequest } from "../lib/api"

type StatusFilter = "all" | "active" | "pending" | "suspended"

function exportUsersToCsv(rows: AppUser[], filename: string) {
  if (!rows.length) {
    toast.message("Nothing to export", { description: "There are no users to include." })
    return
  }
  const escape = (value: unknown) => {
    const str = value === null || value === undefined ? "" : String(value)
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
  }
  const headers = ["Full Name", "Email", "Phone", "Role", "Status", "School", "Rating", "Trips", "Joined"]
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      [
        row.fullName,
        row.email,
        row.phone,
        row.role,
        row.status,
        row.school || "",
        row.rating ?? "",
        row.totalTrips ?? "",
        new Date(row.createdAt).toISOString(),
      ]
        .map(escape)
        .join(",")
    ),
  ]
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  toast.success("Export ready", { description: `${rows.length} rows downloaded as CSV.` })
}

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

const authErrorPattern = /no token provided|unauthorized|forbidden|authentication required|session expired/i

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [statusFilterOpen, setStatusFilterOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<(AppUser & { type: "parent" | "driver" }) | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isMutating, setIsMutating] = useState(false)
  const [deleteCandidate, setDeleteCandidate] = useState<AppUser | null>(null)
  const [editForm, setEditForm] = useState({ fullName: "", phone: "", school: "" })
  const [parents, setParents] = useState<AppUser[]>([])
  const [drivers, setDrivers] = useState<AppUser[]>([])
  const [stats, setStats] = useState<UserStatsPayload | null>(null)
  const [error, setError] = useState("")
  const shouldShowError = Boolean(error) && !/no token provided|unauthorized|forbidden/i.test(error)

  useEffect(() => {
    let mounted = true

    const buildStatsFromUsers = (parentUsers: AppUser[], driverUsers: AppUser[]): UserStatsPayload => {
      const counters = new Map<string, number>()

      const bump = (role: string, status: string) => {
        const key = `${role}:${status}`
        counters.set(key, (counters.get(key) || 0) + 1)
      }

      parentUsers.forEach((user) => bump("parent", user.status))
      driverUsers.forEach((user) => bump("driver", user.status))

      const usersByRole: UserStatsPayload["usersByRole"] = []
      for (const [key, count] of counters.entries()) {
        const [role, status] = key.split(":")
        usersByRole.push({ _id: { role, status }, count })
      }

      return { usersByRole }
    }

    const loadUsers = async () => {
      try {
        const [parentData, driverData, statsData] = await Promise.all([
          apiRequest<{ users: AppUser[] }>("/users?role=parent&limit=100"),
          apiRequest<{ users: AppUser[] }>("/users?role=driver&limit=100"),
          apiRequest<UserStatsPayload>("/admin/users/stats"),
        ])

        if (!mounted) return
        setParents(parentData.users)
        setDrivers(driverData.users)
        setStats(statsData)
        setError("")
        return
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)

        if (!authErrorPattern.test(message)) {
          if (mounted) {
            setError(message)
          }
          return
        }
      }

      try {
        const [parentData, driverData] = await Promise.all([
          apiRequest<{ users: AppUser[] }>("/public/users?role=parent&limit=100"),
          apiRequest<{ users: AppUser[] }>("/public/users?role=driver&limit=100"),
        ])

        if (!mounted) return
        setParents(parentData.users)
        setDrivers(driverData.users)
        setStats(buildStatsFromUsers(parentData.users, driverData.users))
        setError("")
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load users")
        }
      }
    }

    loadUsers()

    return () => {
      mounted = false
    }
  }, [])

  const parentFiltered = useMemo(
    () =>
      parents
        .filter((u) => statusFilter === "all" || u.status === statusFilter)
        .filter((u) => `${u.fullName} ${u.email} ${u.phone}`.toLowerCase().includes(searchTerm.toLowerCase())),
    [parents, searchTerm, statusFilter]
  )

  const driverFiltered = useMemo(
    () =>
      drivers
        .filter((u) => statusFilter === "all" || u.status === statusFilter)
        .filter((u) =>
          `${u.fullName} ${u.email} ${u.phone} ${u.school || ""}`.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    [drivers, searchTerm, statusFilter]
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
    setIsEditMode(false)
    setEditForm({
      fullName: user.fullName,
      phone: user.phone,
      school: user.school || "",
    })
    setDialogOpen(true)
  }

  const syncUpdatedUser = (updatedUser: AppUser) => {
    if (updatedUser.role === "parent") {
      setParents((prev) => prev.map((user) => (user._id === updatedUser._id ? updatedUser : user)))
    }

    if (updatedUser.role === "driver") {
      setDrivers((prev) => prev.map((user) => (user._id === updatedUser._id ? updatedUser : user)))
    }

    setSelectedUser((prev) => {
      if (!prev || prev._id !== updatedUser._id) {
        return prev
      }

      return {
        ...updatedUser,
        type: updatedUser.role === "driver" ? "driver" : "parent",
      }
    })
  }

  const handleHoldUser = async (user: AppUser) => {
    if (user.status === "suspended") {
      return
    }

    setIsMutating(true)
    try {
      const response = await apiRequest<{ user: AppUser }>(`/users/${user._id}/status`, "PUT", { status: "suspended" })
      syncUpdatedUser(response.user)
      setError("")
      toast.success("User suspended", { description: `${user.fullName} has been placed on hold.` })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to hold user"
      setError(message)
      toast.error("Could not suspend user", { description: message })
    } finally {
      setIsMutating(false)
    }
  }

  const handleActivateUser = async (user: AppUser) => {
    setIsMutating(true)
    try {
      const response = await apiRequest<{ user: AppUser }>(`/users/${user._id}/status`, "PUT", { status: "active" })
      syncUpdatedUser(response.user)
      setError("")
      toast.success("User reactivated", { description: `${user.fullName} is now active.` })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to activate user"
      setError(message)
      toast.error("Could not activate user", { description: message })
    } finally {
      setIsMutating(false)
    }
  }

  const requestDeleteUser = (user: AppUser) => {
    setDeleteCandidate(user)
  }

  const handleDeleteUser = async (user: AppUser) => {
    setIsMutating(true)
    try {
      await apiRequest<{ message: string }>(`/users/${user._id}`, "DELETE")
      if (user.role === "parent") {
        setParents((prev) => prev.filter((item) => item._id !== user._id))
      }
      if (user.role === "driver") {
        setDrivers((prev) => prev.filter((item) => item._id !== user._id))
      }
      if (selectedUser?._id === user._id) {
        setDialogOpen(false)
      }
      setDeleteCandidate(null)
      setError("")
      toast.success("User deleted", { description: `${user.fullName} has been removed.` })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete user"
      setError(message)
      toast.error("Delete failed", { description: message })
    } finally {
      setIsMutating(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedUser) {
      return
    }

    const payload: Record<string, unknown> = {
      fullName: editForm.fullName.trim(),
      phone: editForm.phone.trim(),
    }

    if (selectedUser.type === "driver") {
      payload.school = editForm.school.trim()
    }

    setIsMutating(true)
    try {
      const response = await apiRequest<{ user: AppUser }>(`/users/${selectedUser._id}`, "PUT", payload)
      syncUpdatedUser(response.user)
      setIsEditMode(false)
      setError("")
      toast.success("Profile updated", { description: `Saved changes for ${response.user.fullName}.` })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update user"
      setError(message)
      toast.error("Update failed", { description: message })
    } finally {
      setIsMutating(false)
    }
  }

  const statusOptions: Array<{ value: StatusFilter; label: string }> = [
    { value: "all", label: "All statuses" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "suspended", label: "Suspended" },
  ]

  return (
    <div className="space-y-6">
      {/* <div>
        <h2>User Management</h2>
        <p className="text-gray-500 mt-1">Manage parents and drivers in your bus system</p>
        {shouldShowError ? <p className="text-sm text-red-600 mt-2">{error}</p> : null}
      </div> */}

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
            <div className="admin-popover-wrap">
              <Button
                variant="outline"
                onClick={() => setStatusFilterOpen((value) => !value)}
                aria-expanded={statusFilterOpen}
              >
                <Filter className="h-4 w-4 mr-2" />
                {statusFilter === "all" ? "Filter" : statusOptions.find((opt) => opt.value === statusFilter)?.label}
              </Button>
              {statusFilterOpen ? (
                <div className="admin-popover" style={{ minWidth: 200 }}>
                  <div className="admin-popover-header">Status</div>
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className="admin-popover-item"
                      onClick={() => {
                        setStatusFilter(opt.value)
                        setStatusFilterOpen(false)
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 999,
                          background:
                            opt.value === "active"
                              ? "var(--er-success)"
                              : opt.value === "pending"
                              ? "var(--er-warn)"
                              : opt.value === "suspended"
                              ? "var(--er-danger)"
                              : "var(--er-text-muted)",
                        }}
                      />
                      {opt.label}
                      {statusFilter === opt.value ? (
                        <span style={{ marginLeft: "auto", color: "var(--er-accent)" }}>✓</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <Button variant="outline" onClick={() => exportUsersToCsv(parentFiltered, "parents.csv")}>
              <Download className="h-4 w-4 mr-2" />
              Export
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
                  {parentFiltered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                        No parents found
                      </TableCell>
                    </TableRow>
                  )}
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
                          <Button size="sm" variant="ghost" onClick={() => openUserDetails(parent, 'parent')} title="Edit user">
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleHoldUser(parent)}
                            title="Hold user"
                            disabled={isMutating || parent.status === "suspended"}
                          >
                            <Ban className="h-4 w-4 text-yellow-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => requestDeleteUser(parent)}
                            title="Delete user"
                            disabled={isMutating}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
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
            <div className="admin-popover-wrap">
              <Button
                variant="outline"
                onClick={() => setStatusFilterOpen((value) => !value)}
                aria-expanded={statusFilterOpen}
              >
                <Filter className="h-4 w-4 mr-2" />
                {statusFilter === "all" ? "Filter" : statusOptions.find((opt) => opt.value === statusFilter)?.label}
              </Button>
              {statusFilterOpen ? (
                <div className="admin-popover" style={{ minWidth: 200 }}>
                  <div className="admin-popover-header">Status</div>
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className="admin-popover-item"
                      onClick={() => {
                        setStatusFilter(opt.value)
                        setStatusFilterOpen(false)
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 999,
                          background:
                            opt.value === "active"
                              ? "var(--er-success)"
                              : opt.value === "pending"
                              ? "var(--er-warn)"
                              : opt.value === "suspended"
                              ? "var(--er-danger)"
                              : "var(--er-text-muted)",
                        }}
                      />
                      {opt.label}
                      {statusFilter === opt.value ? (
                        <span style={{ marginLeft: "auto", color: "var(--er-accent)" }}>✓</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <Button variant="outline" onClick={() => exportUsersToCsv(driverFiltered, "drivers.csv")}>
              <Download className="h-4 w-4 mr-2" />
              Export
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
                  {driverFiltered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-400 py-8">
                        No drivers found
                      </TableCell>
                    </TableRow>
                  )}
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
                          <Button size="sm" variant="ghost" onClick={() => openUserDetails(driver, 'driver')} title="Edit user">
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleHoldUser(driver)}
                            title="Hold user"
                            disabled={isMutating || driver.status === "suspended"}
                          >
                            <Ban className="h-4 w-4 text-yellow-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => requestDeleteUser(driver)}
                            title="Delete user"
                            disabled={isMutating}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
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
                {isEditMode ? (
                  <Input
                    value={editForm.phone}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                ) : (
                  <p>{selectedUser.phone}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                {isEditMode ? (
                  <Input
                    value={editForm.fullName}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  />
                ) : (
                  <p>{selectedUser.fullName}</p>
                )}
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
                    {isEditMode ? (
                      <Input
                        value={editForm.school}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, school: e.target.value }))}
                      />
                    ) : (
                      <p>{selectedUser.school || "--"}</p>
                    )}
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
            {selectedUser ? (
              <>
                {isEditMode ? (
                  <Button onClick={handleSaveEdit} disabled={isMutating}>Save</Button>
                ) : (
                  <Button onClick={() => setIsEditMode(true)}>Edit</Button>
                )}
                {selectedUser.status === "suspended" ? (
                  <Button
                    variant="secondary"
                    onClick={() => handleActivateUser(selectedUser)}
                    disabled={isMutating}
                  >
                    Reactivate
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => handleHoldUser(selectedUser)}
                    disabled={isMutating}
                  >
                    Hold
                  </Button>
                )}
                <Button variant="destructive" onClick={() => requestDeleteUser(selectedUser)} disabled={isMutating}>
                  Delete
                </Button>
              </>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(deleteCandidate)}
        onOpenChange={(open) => {
          if (!open && !isMutating) {
            setDeleteCandidate(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-md overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-red-500/10 via-transparent to-transparent" />
          <DialogHeader>
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle>Delete User Account?</DialogTitle>
            <DialogDescription>
              {deleteCandidate
                ? `You're about to permanently remove ${deleteCandidate.fullName}. This action cannot be undone.`
                : "This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>

          {deleteCandidate ? (
            <div className="rounded-lg border bg-muted/30 p-3 text-sm space-y-1">
              <p><span className="text-muted-foreground">Name:</span> {deleteCandidate.fullName}</p>
              <p><span className="text-muted-foreground">Role:</span> {deleteCandidate.role}</p>
              <p><span className="text-muted-foreground">Email:</span> {deleteCandidate.email}</p>
            </div>
          ) : null}

          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              onClick={() => setDeleteCandidate(null)}
              disabled={isMutating}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteCandidate && handleDeleteUser(deleteCandidate)}
              disabled={isMutating || !deleteCandidate}
            >
              {isMutating ? "Deleting..." : "Yes, Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
