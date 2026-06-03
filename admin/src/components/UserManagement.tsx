import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"
import { Search, Filter, Eye, Ban, Pencil, Trash2, AlertTriangle, Download, CheckCircle, ChevronLeft, ChevronRight, Users } from "lucide-react"
import { toast } from "sonner"
import { apiRequest } from "../lib/api"

// ── Types ────────────────────────────────────────────────────────────────────

type StatusFilter = "all" | "active" | "pending" | "suspended"

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
  childrenCount?: number
  createdAt: string
}

type UserStatsPayload = {
  usersByRole: Array<{
    _id: { role: string; status: string }
    count: number
  }>
}

const emptyRoleStats = { total: 0, active: 0, pending: 0, suspended: 0 }
const authErrorPattern = /no token provided|unauthorized|forbidden|authentication required/i
const PAGE_SIZE = 20

// ── CSV export ────────────────────────────────────────────────────────────────

function exportUsersToCsv(rows: AppUser[], filename: string) {
  if (!rows.length) {
    toast.message("Nothing to export", { description: "There are no users to include." })
    return
  }
  const escape = (value: unknown) => {
    const str = value === null || value === undefined ? "" : String(value)
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
  }
  const headers = ["Full Name", "Email", "Phone", "Role", "Status", "School", "Rating", "Trips", "Children", "Joined"]
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      [
        row.fullName, row.email, row.phone, row.role, row.status,
        row.school || "", row.rating ?? "", row.totalTrips ?? "",
        row.childrenCount ?? "", new Date(row.createdAt).toISOString(),
      ].map(escape).join(",")
    ),
  ]
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url; a.download = filename
  document.body.appendChild(a); a.click()
  document.body.removeChild(a); URL.revokeObjectURL(url)
  toast.success("Export ready", { description: `${rows.length} rows downloaded as CSV.` })
}

// ── Component ────────────────────────────────────────────────────────────────

export function UserManagement() {
  const [searchTerm, setSearchTerm]           = useState("")
  const [statusFilter, setStatusFilter]       = useState<StatusFilter>("all")
  const [statusFilterOpen, setStatusFilterOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  // dialog state
  const [selectedUser, setSelectedUser]       = useState<(AppUser & { type: "parent" | "driver" }) | null>(null)
  const [dialogOpen, setDialogOpen]           = useState(false)
  const [isEditMode, setIsEditMode]           = useState(false)
  const [isMutating, setIsMutating]           = useState(false)
  const [deleteCandidate, setDeleteCandidate] = useState<AppUser | null>(null)
  const [editForm, setEditForm]               = useState({ fullName: "", phone: "", school: "" })

  // data
  const [parents, setParents]   = useState<AppUser[]>([])
  const [drivers, setDrivers]   = useState<AppUser[]>([])
  const [stats, setStats]       = useState<UserStatsPayload | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState("")

  // pagination (per-tab, client-side over already-loaded list)
  const [parentPage, setParentPage] = useState(1)
  const [driverPage, setDriverPage] = useState(1)

  // close filter popover on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setStatusFilterOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // ── Load users ──────────────────────────────────────────────────────────────

  const buildStatsFromUsers = (parentUsers: AppUser[], driverUsers: AppUser[]): UserStatsPayload => {
    const counters = new Map<string, number>()
    const bump = (role: string, status: string) => {
      const key = `${role}:${status}`
      counters.set(key, (counters.get(key) || 0) + 1)
    }
    parentUsers.forEach((u) => bump("parent", u.status))
    driverUsers.forEach((u) => bump("driver", u.status))
    const usersByRole: UserStatsPayload["usersByRole"] = []
    for (const [key, count] of counters.entries()) {
      const [role, status] = key.split(":")
      usersByRole.push({ _id: { role, status }, count })
    }
    return { usersByRole }
  }

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const [parentData, driverData, statsData] = await Promise.all([
        apiRequest<{ users: AppUser[] }>("/users?role=parent&limit=100"),
        apiRequest<{ users: AppUser[] }>("/users?role=driver&limit=100"),
        apiRequest<UserStatsPayload>("/admin/users/stats"),
      ])
      setParents(parentData.users)
      setDrivers(driverData.users)
      setStats(statsData)
      setError("")
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      if (!authErrorPattern.test(message)) {
        setError(message)
        setLoading(false)
        return
      }
      // Fallback: public endpoint (no auth required)
      try {
        const [parentData, driverData] = await Promise.all([
          apiRequest<{ users: AppUser[] }>("/public/users?role=parent&limit=100"),
          apiRequest<{ users: AppUser[] }>("/public/users?role=driver&limit=100"),
        ])
        setParents(parentData.users)
        setDrivers(driverData.users)
        setStats(buildStatsFromUsers(parentData.users, driverData.users))
        setError("")
      } catch (err2) {
        setError(err2 instanceof Error ? err2.message : "Failed to load users")
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadUsers() }, [loadUsers])

  // ── Filtering & pagination ──────────────────────────────────────────────────

  const parentFiltered = useMemo(() =>
    parents
      .filter((u) => statusFilter === "all" || u.status === statusFilter)
      .filter((u) => `${u.fullName} ${u.email} ${u.phone}`.toLowerCase().includes(searchTerm.toLowerCase())),
    [parents, searchTerm, statusFilter]
  )

  const driverFiltered = useMemo(() =>
    drivers
      .filter((u) => statusFilter === "all" || u.status === statusFilter)
      .filter((u) => `${u.fullName} ${u.email} ${u.phone} ${u.school || ""}`.toLowerCase().includes(searchTerm.toLowerCase())),
    [drivers, searchTerm, statusFilter]
  )

  // Reset to page 1 whenever filter/search changes
  useEffect(() => { setParentPage(1) }, [searchTerm, statusFilter])
  useEffect(() => { setDriverPage(1) }, [searchTerm, statusFilter])

  const parentPages  = Math.max(1, Math.ceil(parentFiltered.length / PAGE_SIZE))
  const driverPages  = Math.max(1, Math.ceil(driverFiltered.length / PAGE_SIZE))
  const parentSlice  = parentFiltered.slice((parentPage - 1) * PAGE_SIZE, parentPage * PAGE_SIZE)
  const driverSlice  = driverFiltered.slice((driverPage - 1) * PAGE_SIZE, driverPage * PAGE_SIZE)

  // ── Stats ───────────────────────────────────────────────────────────────────

  const roleStats = useMemo(() => {
    if (!stats) return { parent: emptyRoleStats, driver: emptyRoleStats }
    const bucket = { parent: { ...emptyRoleStats }, driver: { ...emptyRoleStats } }
    for (const item of stats.usersByRole) {
      const role = item._id.role as "parent" | "driver"
      if (!(role in bucket)) continue
      const status = item._id.status as "active" | "pending" | "suspended"
      if (status in bucket[role]) {
        bucket[role][status] = item.count
        bucket[role].total  += item.count
      }
    }
    return bucket
  }, [stats])

  // ── Dialog helpers ──────────────────────────────────────────────────────────

  const openUserDetails = (user: AppUser, type: "parent" | "driver", editMode = false) => {
    setSelectedUser({ ...user, type })
    setIsEditMode(editMode)
    setEditForm({ fullName: user.fullName, phone: user.phone, school: user.school || "" })
    setDialogOpen(true)
  }

  const syncUpdatedUser = (updatedUser: AppUser) => {
    if (updatedUser.role === "parent") setParents((prev) => prev.map((u) => u._id === updatedUser._id ? updatedUser : u))
    if (updatedUser.role === "driver") setDrivers((prev) => prev.map((u) => u._id === updatedUser._id ? updatedUser : u))
    setSelectedUser((prev) =>
      prev && prev._id === updatedUser._id
        ? { ...updatedUser, type: updatedUser.role === "driver" ? "driver" : "parent" }
        : prev
    )
  }

  // ── Mutations ───────────────────────────────────────────────────────────────

  const handleStatusChange = async (user: AppUser, newStatus: "active" | "suspended") => {
    setIsMutating(true)
    try {
      const res = await apiRequest<{ user: AppUser }>(`/users/${user._id}/status`, "PUT", { status: newStatus })
      syncUpdatedUser(res.user)
      setError("")
      toast.success(
        newStatus === "suspended" ? "User suspended" : "User reactivated",
        { description: `${user.fullName} is now ${newStatus}.` }
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update status"
      setError(message)
      toast.error("Status update failed", { description: message })
    } finally {
      setIsMutating(false)
    }
  }

  const handleDeleteUser = async (user: AppUser) => {
    setIsMutating(true)
    try {
      await apiRequest<{ message: string }>(`/users/${user._id}`, "DELETE")
      if (user.role === "parent") setParents((prev) => prev.filter((u) => u._id !== user._id))
      if (user.role === "driver") setDrivers((prev) => prev.filter((u) => u._id !== user._id))
      if (selectedUser?._id === user._id) setDialogOpen(false)
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
    if (!selectedUser) return
    const payload: Record<string, unknown> = {
      fullName: editForm.fullName.trim(),
      phone: editForm.phone.trim(),
    }
    if (selectedUser.type === "driver") payload.school = editForm.school.trim()

    setIsMutating(true)
    try {
      const res = await apiRequest<{ user: AppUser }>(`/users/${selectedUser._id}`, "PUT", payload)
      syncUpdatedUser(res.user)
      setIsEditMode(false)
      setError("")
      toast.success("Profile updated", { description: `Saved changes for ${res.user.fullName}.` })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update user"
      setError(message)
      toast.error("Update failed", { description: message })
    } finally {
      setIsMutating(false)
    }
  }

  // ── Shared sub-components ───────────────────────────────────────────────────

  const statusOptions: Array<{ value: StatusFilter; label: string }> = [
    { value: "all",       label: "All statuses" },
    { value: "active",    label: "Active" },
    { value: "pending",   label: "Pending" },
    { value: "suspended", label: "Suspended" },
  ]

  const statusDot = (v: StatusFilter) =>
    v === "active" ? "var(--er-success)" : v === "pending" ? "var(--er-warn)" : v === "suspended" ? "var(--er-danger)" : "var(--er-text-muted)"

  const FilterBar = ({ filename, rows }: { filename: string; rows: AppUser[] }) => (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by name, email or phone…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="admin-popover-wrap" ref={filterRef}>
        <Button variant="outline" onClick={() => setStatusFilterOpen((v) => !v)} aria-expanded={statusFilterOpen}>
          <Filter className="h-4 w-4 mr-2" />
          {statusFilter === "all" ? "Filter" : statusOptions.find((o) => o.value === statusFilter)?.label}
        </Button>
        {statusFilterOpen && (
          <div className="admin-popover" style={{ minWidth: 200 }}>
            <div className="admin-popover-header">Status</div>
            {statusOptions.map((opt) => (
              <button key={opt.value} type="button" className="admin-popover-item"
                onClick={() => { setStatusFilter(opt.value); setStatusFilterOpen(false) }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: statusDot(opt.value) }} />
                {opt.label}
                {statusFilter === opt.value && <span style={{ marginLeft: "auto", color: "var(--er-accent)" }}>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
      <Button variant="outline" onClick={() => exportUsersToCsv(rows, filename)}>
        <Download className="h-4 w-4 mr-2" />Export
      </Button>
    </div>
  )

  const StatsCards = ({ role }: { role: "parent" | "driver" }) => {
    const s = roleStats[role]
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: `Total ${role === "parent" ? "Parents" : "Drivers"}`, value: s.total,     color: "" },
          { label: "Active",               value: s.active,    color: "text-green-600" },
          { label: "Pending Verification", value: s.pending,   color: "text-yellow-600" },
          { label: "Suspended",            value: s.suspended, color: "text-red-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <p className="text-sm text-gray-500">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const Paginator = ({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) => {
    if (pages <= 1) return null
    return (
      <div className="flex items-center justify-end gap-2 pt-2">
        <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => onPage(page - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-gray-500">Page {page} of {pages}</span>
        <Button variant="ghost" size="sm" disabled={page === pages} onClick={() => onPage(page + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  const ActionButtons = ({ user, type }: { user: AppUser; type: "parent" | "driver" }) => (
    <div className="flex gap-1">
      <Button size="sm" variant="ghost" title="View details" onClick={() => openUserDetails(user, type, false)}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="ghost" title="Edit user" onClick={() => openUserDetails(user, type, true)}>
        <Pencil className="h-4 w-4 text-blue-500" />
      </Button>
      {user.status === "suspended" ? (
        <Button size="sm" variant="ghost" title="Reactivate user" disabled={isMutating}
          onClick={() => handleStatusChange(user, "active")}>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </Button>
      ) : (
        <Button size="sm" variant="ghost" title="Suspend user" disabled={isMutating}
          onClick={() => handleStatusChange(user, "suspended")}>
          <Ban className="h-4 w-4 text-yellow-600" />
        </Button>
      )}
      <Button size="sm" variant="ghost" title="Delete user" disabled={isMutating}
        onClick={() => setDeleteCandidate(user)}>
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  )

  // ── Render ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <Users className="h-6 w-6 mr-2 animate-pulse" />Loading users…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && !/no token|unauthorized|forbidden/i.test(error) && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <Tabs defaultValue="parents">
        <TabsList>
          <TabsTrigger value="parents">Parents ({parents.length})</TabsTrigger>
          <TabsTrigger value="drivers">Drivers ({drivers.length})</TabsTrigger>
        </TabsList>

        {/* ── Parents tab ──────────────────────────────────────────── */}
        <TabsContent value="parents" className="space-y-4">
          <FilterBar filename="parents.csv" rows={parentFiltered} />
          <StatsCards role="parent" />
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
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parentSlice.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                        No parents found
                      </TableCell>
                    </TableRow>
                  ) : parentSlice.map((parent) => (
                    <TableRow key={parent._id}>
                      <TableCell className="font-medium">{parent.fullName}</TableCell>
                      <TableCell className="text-gray-500">{parent.email}</TableCell>
                      <TableCell>{parent.phone}</TableCell>
                      <TableCell>
                        <span className={parent.childrenCount ? "font-medium" : "text-gray-400"}>
                          {parent.childrenCount ?? 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={parent.status === "active" ? "success" : parent.status === "suspended" ? "destructive" : "warning"}>
                          {parent.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {new Date(parent.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <ActionButtons user={parent} type="parent" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Paginator page={parentPage} pages={parentPages} onPage={setParentPage} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Drivers tab ──────────────────────────────────────────── */}
        <TabsContent value="drivers" className="space-y-4">
          <FilterBar filename="drivers.csv" rows={driverFiltered} />
          <StatsCards role="driver" />
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
                    <TableHead>Rating</TableHead>
                    <TableHead>Trips</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {driverSlice.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-400 py-8">
                        No drivers found
                      </TableCell>
                    </TableRow>
                  ) : driverSlice.map((driver) => (
                    <TableRow key={driver._id}>
                      <TableCell className="font-medium">{driver.fullName}</TableCell>
                      <TableCell className="text-gray-500">{driver.email}</TableCell>
                      <TableCell>{driver.school || <span className="text-gray-400">--</span>}</TableCell>
                      <TableCell>
                        {(driver.rating ?? 0) > 0
                          ? <span className="flex items-center gap-1"><span className="text-yellow-500">★</span>{driver.rating?.toFixed(1)}</span>
                          : <span className="text-gray-400">N/A</span>}
                      </TableCell>
                      <TableCell>{driver.totalTrips ?? 0}</TableCell>
                      <TableCell>
                        <Badge variant={driver.status === "active" ? "success" : driver.status === "suspended" ? "destructive" : "warning"}>
                          {driver.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {new Date(driver.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <ActionButtons user={driver} type="driver" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Paginator page={driverPage} pages={driverPages} onPage={setDriverPage} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── View / Edit Dialog ──────────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open && !isMutating) { setDialogOpen(false); setIsEditMode(false) } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit User" : selectedUser?.fullName}</DialogTitle>
            <DialogDescription>
              {selectedUser?.type === "parent" ? "Parent" : "Driver"} · {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Full Name</p>
                  {isEditMode
                    ? <Input value={editForm.fullName} onChange={(e) => setEditForm((p) => ({ ...p, fullName: e.target.value }))} />
                    : <p className="text-sm font-medium">{selectedUser.fullName}</p>}
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  {isEditMode
                    ? <Input value={editForm.phone} onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))} />
                    : <p className="text-sm">{selectedUser.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <Badge variant={selectedUser.status === "active" ? "success" : selectedUser.status === "suspended" ? "destructive" : "warning"}>
                    {selectedUser.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Joined</p>
                  <p className="text-sm">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedUser.type === "parent" && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Children registered</p>
                  <p className="text-sm font-medium">{selectedUser.childrenCount ?? 0}</p>
                </div>
              )}

              {selectedUser.type === "driver" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">School</p>
                    {isEditMode
                      ? <Input value={editForm.school} onChange={(e) => setEditForm((p) => ({ ...p, school: e.target.value }))} />
                      : <p className="text-sm">{selectedUser.school || "--"}</p>}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Rating</p>
                    <p className="text-sm">{(selectedUser.rating ?? 0) > 0 ? `★ ${selectedUser.rating?.toFixed(1)} (${selectedUser.reviewCount} reviews)` : "No ratings yet"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Trips</p>
                    <p className="text-sm font-medium">{selectedUser.totalTrips ?? 0}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex-wrap gap-2">
            <Button variant="outline" onClick={() => { setDialogOpen(false); setIsEditMode(false) }} disabled={isMutating}>
              {isEditMode ? "Cancel" : "Close"}
            </Button>
            {!isEditMode && (
              <Button variant="secondary" onClick={() => setIsEditMode(true)}>
                <Pencil className="h-4 w-4 mr-1" />Edit
              </Button>
            )}
            {isEditMode && (
              <Button onClick={handleSaveEdit} disabled={isMutating}>
                {isMutating ? "Saving…" : "Save Changes"}
              </Button>
            )}
            {selectedUser && !isEditMode && (
              <>
                {selectedUser.status === "suspended"
                  ? <Button variant="secondary" onClick={() => handleStatusChange(selectedUser, "active")} disabled={isMutating}>
                      <CheckCircle className="h-4 w-4 mr-1" />Reactivate
                    </Button>
                  : <Button variant="secondary" onClick={() => handleStatusChange(selectedUser, "suspended")} disabled={isMutating}>
                      <Ban className="h-4 w-4 mr-1" />Suspend
                    </Button>}
                <Button variant="destructive" onClick={() => setDeleteCandidate(selectedUser)} disabled={isMutating}>
                  <Trash2 className="h-4 w-4 mr-1" />Delete
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Dialog ───────────────────────────────────────── */}
      <Dialog open={Boolean(deleteCandidate)} onOpenChange={(open) => { if (!open && !isMutating) setDeleteCandidate(null) }}>
        <DialogContent className="sm:max-w-md overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-red-500/10 via-transparent to-transparent" />
          <DialogHeader>
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle>Delete User Account?</DialogTitle>
            <DialogDescription>
              {deleteCandidate
                ? `You're about to permanently remove ${deleteCandidate.fullName}. This cannot be undone.`
                : "This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          {deleteCandidate && (
            <div className="rounded-lg border bg-muted/30 p-3 text-sm space-y-1">
              <p><span className="text-muted-foreground">Name: </span>{deleteCandidate.fullName}</p>
              <p><span className="text-muted-foreground">Role: </span>{deleteCandidate.role}</p>
              <p><span className="text-muted-foreground">Email: </span>{deleteCandidate.email}</p>
            </div>
          )}
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setDeleteCandidate(null)} disabled={isMutating}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={isMutating || !deleteCandidate}
              onClick={() => deleteCandidate && handleDeleteUser(deleteCandidate)}>
              {isMutating ? "Deleting…" : "Yes, Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
