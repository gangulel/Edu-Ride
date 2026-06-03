import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import {
  AlertTriangle, Bus, CheckCircle, ChevronLeft, ChevronRight,
  Clock, Eye, Filter, Map, Navigation, Power, Search, Users,
} from "lucide-react"
import { toast } from "sonner"
import { apiRequest } from "../lib/api"

// ── Types ─────────────────────────────────────────────────────────────────────

type Stop = {
  _id?: string
  location: string
  pickupTime: string
  dropoffTime?: string | null
  order: number
}

type RouteData = {
  _id: string
  name: string
  school: string
  driver?: { fullName?: string; email?: string; phone?: string; rating?: number }
  vehicle?: { make?: string; model?: string; licensePlate?: string; vehicleType?: string; capacity?: number }
  stops: Stop[]
  daysOfOperation: string[]
  studentCount: number
  status: "active" | "inactive"
  schoolArrival?: string | null
  schoolDeparture?: string | null
}

type VehicleData = {
  _id: string
  make: string
  model: string
  year: string
  color?: string | null
  licensePlate: string
  vin?: string | null
  vehicleType: "van" | "bus" | "mini-bus" | "sedan"
  capacity: number
  registrationExpiry?: string | null
  insuranceProvider?: string | null
  insurancePolicy?: string | null
  insuranceExpiry?: string | null
  isAC: boolean
  driver?: { fullName?: string; email?: string; phone?: string; status?: string; school?: string }
}

type RouteStatusFilter = "all" | "active" | "inactive"
type VehicleTypeFilter = "all" | "van" | "bus" | "mini-bus" | "sedan"
type ExpiryStatus = "expired" | "soon" | "ok" | "unknown"

const PAGE_SIZE = 20

// ── Helpers ───────────────────────────────────────────────────────────────────

function getExpiryStatus(dateStr?: string | null): ExpiryStatus {
  if (!dateStr) return "unknown"
  const daysLeft = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000)
  if (daysLeft < 0) return "expired"
  if (daysLeft <= 30) return "soon"
  return "ok"
}

function ExpiryCell({ date }: { date?: string | null }) {
  const status = getExpiryStatus(date)
  if (status === "unknown") return <span className="text-gray-400">--</span>
  const label = new Date(date!).toLocaleDateString()
  if (status === "expired") return <Badge variant="destructive">{label} Expired</Badge>
  if (status === "soon") return <Badge variant="warning">{label} Soon</Badge>
  return <span className="text-sm text-gray-600">{label}</span>
}

// ── Component ─────────────────────────────────────────────────────────────────

export function RouteManagement() {
  // ── Routes state
  const [routes, setRoutes] = useState<RouteData[]>([])
  const [routeSearch, setRouteSearch] = useState("")
  const [routeStatusFilter, setRouteStatusFilter] = useState<RouteStatusFilter>("all")
  const [routeFilterOpen, setRouteFilterOpen] = useState(false)
  const [routePage, setRoutePage] = useState(1)
  const [routesLoading, setRoutesLoading] = useState(true)
  const [routeError, setRouteError] = useState("")
  const routeFilterRef = useRef<HTMLDivElement>(null)

  // ── Fleet state
  const [vehicles, setVehicles] = useState<VehicleData[]>([])
  const [vehicleSearch, setVehicleSearch] = useState("")
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<VehicleTypeFilter>("all")
  const [vehicleFilterOpen, setVehicleFilterOpen] = useState(false)
  const [vehiclePage, setVehiclePage] = useState(1)
  const [vehiclesLoading, setVehiclesLoading] = useState(true)
  const [vehicleError, setVehicleError] = useState("")
  const vehicleFilterRef = useRef<HTMLDivElement>(null)

  // ── Dialog state
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null)
  const [statusCandidate, setStatusCandidate] = useState<{ route: RouteData; newStatus: "active" | "inactive" } | null>(null)
  const [mutating, setMutating] = useState(false)

  // ── Load routes
  useEffect(() => {
    apiRequest<{ routes: RouteData[] }>("/routes?limit=200")
      .then((d) => { setRoutes(d.routes); setRouteError("") })
      .catch((err) => setRouteError(err instanceof Error ? err.message : "Failed to load routes"))
      .finally(() => setRoutesLoading(false))
  }, [])

  // ── Load fleet
  useEffect(() => {
    apiRequest<{ vehicles: VehicleData[] }>("/admin/vehicles")
      .then((d) => { setVehicles(d.vehicles); setVehicleError("") })
      .catch((err) => setVehicleError(err instanceof Error ? err.message : "Failed to load fleet"))
      .finally(() => setVehiclesLoading(false))
  }, [])

  // ── Close filter popovers on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (routeFilterRef.current && !routeFilterRef.current.contains(e.target as Node)) setRouteFilterOpen(false)
      if (vehicleFilterRef.current && !vehicleFilterRef.current.contains(e.target as Node)) setVehicleFilterOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // ── Filtered routes
  const filteredRoutes = useMemo(() =>
    routes
      .filter((r) => routeStatusFilter === "all" || r.status === routeStatusFilter)
      .filter((r) => {
        const q = routeSearch.toLowerCase()
        return !q || `${r.name} ${r.school} ${r.driver?.fullName ?? ""} ${r.stops.map((s) => s.location).join(" ")}`.toLowerCase().includes(q)
      }),
    [routes, routeSearch, routeStatusFilter]
  )

  const routePages = Math.max(1, Math.ceil(filteredRoutes.length / PAGE_SIZE))
  const routeSlice = filteredRoutes.slice((routePage - 1) * PAGE_SIZE, routePage * PAGE_SIZE)
  useEffect(() => setRoutePage(1), [routeSearch, routeStatusFilter])

  // ── Filtered vehicles
  const filteredVehicles = useMemo(() =>
    vehicles
      .filter((v) => vehicleTypeFilter === "all" || v.vehicleType === vehicleTypeFilter)
      .filter((v) => {
        const q = vehicleSearch.toLowerCase()
        return !q || `${v.make} ${v.model} ${v.licensePlate} ${v.driver?.fullName ?? ""}`.toLowerCase().includes(q)
      }),
    [vehicles, vehicleSearch, vehicleTypeFilter]
  )

  const vehiclePages = Math.max(1, Math.ceil(filteredVehicles.length / PAGE_SIZE))
  const vehicleSlice = filteredVehicles.slice((vehiclePage - 1) * PAGE_SIZE, vehiclePage * PAGE_SIZE)
  useEffect(() => setVehiclePage(1), [vehicleSearch, vehicleTypeFilter])

  // ── Route stats
  const routeStats = useMemo(() => ({
    total: routes.length,
    active: routes.filter((r) => r.status === "active").length,
    inactive: routes.filter((r) => r.status === "inactive").length,
    students: routes.reduce((s, r) => s + (r.studentCount || 0), 0),
  }), [routes])

  // ── Fleet stats
  const fleetStats = useMemo(() => {
    const deadline = Date.now() + 30 * 86_400_000
    const expiring = vehicles.filter((v) => {
      const rExp = v.registrationExpiry ? new Date(v.registrationExpiry).getTime() : null
      const iExp = v.insuranceExpiry ? new Date(v.insuranceExpiry).getTime() : null
      return (rExp !== null && rExp <= deadline) || (iExp !== null && iExp <= deadline)
    }).length
    return {
      total: vehicles.length,
      capacity: vehicles.reduce((s, v) => s + v.capacity, 0),
      ac: vehicles.filter((v) => v.isAC).length,
      expiring,
    }
  }, [vehicles])

  // ── Toggle route status
  const handleToggleStatus = useCallback(async () => {
    if (!statusCandidate) return
    const { route, newStatus } = statusCandidate
    setMutating(true)
    try {
      const res = await apiRequest<{ route: RouteData }>(`/admin/routes/${route._id}/status`, "PUT", { status: newStatus })
      setRoutes((prev) => prev.map((r) => r._id === res.route._id ? { ...r, status: res.route.status } : r))
      setStatusCandidate(null)
      toast.success(
        newStatus === "active" ? "Route activated" : "Route deactivated",
        { description: route.name }
      )
    } catch (err) {
      toast.error("Status update failed", { description: err instanceof Error ? err.message : "Unknown error" })
    } finally {
      setMutating(false)
    }
  }, [statusCandidate])

  // ── Sub-components
  const Paginator = ({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) => {
    if (pages <= 1) return null
    return (
      <div className="flex items-center justify-end gap-2 pt-3">
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

  // ── Render
  return (
    <div className="space-y-6">
      <Tabs defaultValue="routes">
        <TabsList>
          <TabsTrigger value="routes">
            <Navigation className="h-4 w-4 mr-2" />
            Routes ({routes.length})
          </TabsTrigger>
          <TabsTrigger value="fleet">
            <Bus className="h-4 w-4 mr-2" />
            Fleet ({vehicles.length})
          </TabsTrigger>
        </TabsList>

        {/* ── Routes tab ─────────────────────────────────────────────────── */}
        <TabsContent value="routes" className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{routeStats.total}</div>
                <p className="text-sm text-gray-500">Total Routes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">{routeStats.active}</div>
                <p className="text-sm text-gray-500">Active</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-500">{routeStats.inactive}</div>
                <p className="text-sm text-gray-500">Inactive</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{routeStats.students}</div>
                <p className="text-sm text-gray-500">Total Students</p>
              </CardContent>
            </Card>
          </div>

          {/* Search + filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, school, driver, stop…"
                value={routeSearch}
                onChange={(e) => setRouteSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="admin-popover-wrap" ref={routeFilterRef}>
              <Button variant="outline" onClick={() => setRouteFilterOpen((v) => !v)}>
                <Filter className="h-4 w-4 mr-2" />
                {routeStatusFilter === "all" ? "Status" : routeStatusFilter.charAt(0).toUpperCase() + routeStatusFilter.slice(1)}
              </Button>
              {routeFilterOpen && (
                <div className="admin-popover" style={{ minWidth: 180 }}>
                  <div className="admin-popover-header">Status</div>
                  {(["all", "active", "inactive"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="admin-popover-item"
                      onClick={() => { setRouteStatusFilter(s); setRouteFilterOpen(false) }}
                    >
                      <span style={{
                        width: 8, height: 8, borderRadius: 999,
                        background: s === "active" ? "var(--er-success)" : s === "inactive" ? "var(--er-text-muted)" : "var(--er-accent)",
                        flexShrink: 0,
                      }} />
                      {s === "all" ? "All statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
                      {routeStatusFilter === s && <span style={{ marginLeft: "auto", color: "var(--er-accent)" }}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Routes table */}
          <Card>
            <CardHeader><CardTitle>All Routes</CardTitle></CardHeader>
            <CardContent>
              {routesLoading ? (
                <div className="flex items-center justify-center py-16 text-gray-400">
                  <Navigation className="h-5 w-5 mr-2 animate-pulse" />Loading routes…
                </div>
              ) : routeError ? (
                <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span>{routeError}</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Route</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Bus</TableHead>
                      <TableHead>Stops</TableHead>
                      <TableHead>Arrival / Dep.</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routeSlice.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center text-gray-400 py-8">No routes found</TableCell>
                      </TableRow>
                    ) : routeSlice.map((route) => (
                      <TableRow key={route._id}>
                        <TableCell className="font-medium">{route.name}</TableCell>
                        <TableCell className="text-sm">{route.school}</TableCell>
                        <TableCell className="text-sm">
                          {route.driver?.fullName ?? <span className="text-gray-400">--</span>}
                        </TableCell>
                        <TableCell className="text-sm font-mono">
                          {route.vehicle?.licensePlate ?? <span className="text-gray-400">--</span>}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {route.stops.slice(0, 2).map((s, i) => (
                              <Badge key={i} variant="outline">{s.location}</Badge>
                            ))}
                            {route.stops.length > 2 && (
                              <Badge variant="secondary">+{route.stops.length - 2}</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {route.schoolArrival ?? "--"} / {route.schoolDeparture ?? "--"}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {route.daysOfOperation.join(", ") || "--"}
                        </TableCell>
                        <TableCell>{route.studentCount || 0}</TableCell>
                        <TableCell>
                          <Badge variant={route.status === "active" ? "success" : "secondary"}>
                            {route.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" title="View details" onClick={() => setSelectedRoute(route)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              title={route.status === "active" ? "Deactivate" : "Activate"}
                              onClick={() => setStatusCandidate({ route, newStatus: route.status === "active" ? "inactive" : "active" })}
                            >
                              {route.status === "active"
                                ? <Power className="h-4 w-4 text-yellow-600" />
                                : <CheckCircle className="h-4 w-4 text-green-600" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <Paginator page={routePage} pages={routePages} onPage={setRoutePage} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Fleet tab ──────────────────────────────────────────────────── */}
        <TabsContent value="fleet" className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{fleetStats.total}</div>
                <p className="text-sm text-gray-500">Total Vehicles</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{fleetStats.capacity}</div>
                <p className="text-sm text-gray-500">Total Capacity</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">{fleetStats.ac}</div>
                <p className="text-sm text-gray-500">AC Vehicles</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className={`text-2xl font-bold ${fleetStats.expiring > 0 ? "text-yellow-600" : "text-green-600"}`}>
                  {fleetStats.expiring}
                </div>
                <p className="text-sm text-gray-500">Expiry Alerts</p>
              </CardContent>
            </Card>
          </div>

          {/* Search + filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by make, model, plate or driver…"
                value={vehicleSearch}
                onChange={(e) => setVehicleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="admin-popover-wrap" ref={vehicleFilterRef}>
              <Button variant="outline" onClick={() => setVehicleFilterOpen((v) => !v)}>
                <Filter className="h-4 w-4 mr-2" />
                {vehicleTypeFilter === "all" ? "Type" : vehicleTypeFilter}
              </Button>
              {vehicleFilterOpen && (
                <div className="admin-popover" style={{ minWidth: 180 }}>
                  <div className="admin-popover-header">Vehicle Type</div>
                  {(["all", "van", "bus", "mini-bus", "sedan"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      className="admin-popover-item"
                      onClick={() => { setVehicleTypeFilter(t); setVehicleFilterOpen(false) }}
                    >
                      {t === "all" ? "All types" : t}
                      {vehicleTypeFilter === t && <span style={{ marginLeft: "auto", color: "var(--er-accent)" }}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Fleet table */}
          <Card>
            <CardHeader><CardTitle>Buses &amp; Vehicles</CardTitle></CardHeader>
            <CardContent>
              {vehiclesLoading ? (
                <div className="flex items-center justify-center py-16 text-gray-400">
                  <Bus className="h-5 w-5 mr-2 animate-pulse" />Loading fleet…
                </div>
              ) : vehicleError ? (
                <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span>{vehicleError}</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plate</TableHead>
                      <TableHead>Make / Model</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Cap.</TableHead>
                      <TableHead>AC</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Reg. Expiry</TableHead>
                      <TableHead>Ins. Expiry</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicleSlice.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center text-gray-400 py-8">No vehicles found</TableCell>
                      </TableRow>
                    ) : vehicleSlice.map((v) => (
                      <TableRow key={v._id}>
                        <TableCell className="font-mono font-medium">{v.licensePlate}</TableCell>
                        <TableCell>{v.make} {v.model}</TableCell>
                        <TableCell>{v.year}</TableCell>
                        <TableCell><Badge variant="outline">{v.vehicleType}</Badge></TableCell>
                        <TableCell>{v.capacity}</TableCell>
                        <TableCell>
                          {v.isAC ? <Badge variant="success">AC</Badge> : <span className="text-gray-400">--</span>}
                        </TableCell>
                        <TableCell className="text-sm">
                          {v.driver?.fullName ?? <span className="text-gray-400">--</span>}
                        </TableCell>
                        <TableCell><ExpiryCell date={v.registrationExpiry} /></TableCell>
                        <TableCell><ExpiryCell date={v.insuranceExpiry} /></TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" title="View details" onClick={() => setSelectedVehicle(v)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <Paginator page={vehiclePage} pages={vehiclePages} onPage={setVehiclePage} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Route detail dialog ─────────────────────────────────────────── */}
      <Dialog open={Boolean(selectedRoute)} onOpenChange={(open) => { if (!open) setSelectedRoute(null) }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedRoute?.name}</DialogTitle>
            <DialogDescription>{selectedRoute?.school}</DialogDescription>
          </DialogHeader>

          {selectedRoute && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Driver</p>
                  <p className="text-sm font-medium">{selectedRoute.driver?.fullName ?? "--"}</p>
                  {(selectedRoute.driver?.rating ?? 0) > 0 && (
                    <p className="text-xs text-gray-400">★ {selectedRoute.driver!.rating!.toFixed(1)}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Vehicle</p>
                  <p className="text-sm font-medium">
                    {selectedRoute.vehicle ? `${selectedRoute.vehicle.make} ${selectedRoute.vehicle.model}` : "--"}
                  </p>
                  <p className="text-xs font-mono text-gray-400">{selectedRoute.vehicle?.licensePlate ?? ""}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">School Arrival</p>
                  <p className="text-sm">{selectedRoute.schoolArrival ?? "--"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">School Departure</p>
                  <p className="text-sm">{selectedRoute.schoolDeparture ?? "--"}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Operating Days</p>
                <div className="flex flex-wrap gap-1">
                  {selectedRoute.daysOfOperation.length > 0
                    ? selectedRoute.daysOfOperation.map((d) => <Badge key={d} variant="outline">{d}</Badge>)
                    : <span className="text-sm text-gray-400">Not set</span>}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Stops ({selectedRoute.stops.length})</p>
                {selectedRoute.stops.length === 0 ? (
                  <p className="text-sm text-gray-400">No stops defined</p>
                ) : (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {[...selectedRoute.stops]
                      .sort((a, b) => a.order - b.order)
                      .map((stop, i) => (
                        <div
                          key={stop._id ?? i}
                          className="flex items-center gap-3 rounded-lg border p-2 text-sm"
                          style={{ borderColor: "var(--er-border)" }}
                        >
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold shrink-0">
                            {i + 1}
                          </span>
                          <span className="font-medium flex-1">{stop.location}</span>
                          <span className="text-gray-400 shrink-0 text-xs">
                            <Clock className="inline h-3 w-3 mr-0.5" />
                            {stop.pickupTime}
                            {stop.dropoffTime && ` / ${stop.dropoffTime}`}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Students</p>
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-gray-400" />
                    {selectedRoute.studentCount || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <Badge variant={selectedRoute.status === "active" ? "success" : "secondary"}>
                    {selectedRoute.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-wrap gap-2">
            <Button variant="outline" onClick={() => setSelectedRoute(null)}>Close</Button>
            {selectedRoute && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    const stops = selectedRoute.stops.map((s) => s.location).filter(Boolean)
                    if (!stops.length) { toast.message("No stops to map"); return }
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stops.join(" / "))}`,
                      "_blank", "noopener,noreferrer"
                    )
                  }}
                >
                  <Map className="h-4 w-4 mr-2" />Map
                </Button>
                <Button
                  variant={selectedRoute.status === "active" ? "destructive" : "secondary"}
                  onClick={() => {
                    setStatusCandidate({ route: selectedRoute, newStatus: selectedRoute.status === "active" ? "inactive" : "active" })
                    setSelectedRoute(null)
                  }}
                >
                  <Power className="h-4 w-4 mr-2" />
                  {selectedRoute.status === "active" ? "Deactivate" : "Activate"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Vehicle detail dialog ───────────────────────────────────────── */}
      <Dialog open={Boolean(selectedVehicle)} onOpenChange={(open) => { if (!open) setSelectedVehicle(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedVehicle?.make} {selectedVehicle?.model} ({selectedVehicle?.year})</DialogTitle>
            <DialogDescription className="font-mono">{selectedVehicle?.licensePlate}</DialogDescription>
          </DialogHeader>

          {selectedVehicle && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Type</p>
                  <Badge variant="outline">{selectedVehicle.vehicleType}</Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Capacity</p>
                  <p className="text-sm font-medium">{selectedVehicle.capacity} seats</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Air Conditioning</p>
                  <p className="text-sm">{selectedVehicle.isAC ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Color</p>
                  <p className="text-sm">{selectedVehicle.color ?? "--"}</p>
                </div>
              </div>

              {selectedVehicle.vin && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">VIN</p>
                  <p className="text-sm font-mono">{selectedVehicle.vin}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-500 mb-1">Assigned Driver</p>
                <p className="text-sm font-medium">{selectedVehicle.driver?.fullName ?? "--"}</p>
                {selectedVehicle.driver?.school && (
                  <p className="text-xs text-gray-400">{selectedVehicle.driver.school}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Registration Expiry</p>
                  <ExpiryCell date={selectedVehicle.registrationExpiry} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Insurance Expiry</p>
                  <ExpiryCell date={selectedVehicle.insuranceExpiry} />
                </div>
              </div>

              {(selectedVehicle.insuranceProvider || selectedVehicle.insurancePolicy) && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Insurance Provider</p>
                    <p className="text-sm">{selectedVehicle.insuranceProvider ?? "--"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Policy No.</p>
                    <p className="text-sm font-mono">{selectedVehicle.insurancePolicy ?? "--"}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedVehicle(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Status toggle confirmation ──────────────────────────────────── */}
      <Dialog open={Boolean(statusCandidate)} onOpenChange={(open) => { if (!open && !mutating) setStatusCandidate(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {statusCandidate?.newStatus === "inactive" ? "Deactivate route?" : "Activate route?"}
            </DialogTitle>
            <DialogDescription>
              {statusCandidate?.newStatus === "inactive"
                ? `Parents will no longer see live tracking for "${statusCandidate.route.name}".`
                : `"${statusCandidate?.route.name}" will be restored to active status.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusCandidate(null)} disabled={mutating}>
              Cancel
            </Button>
            <Button
              variant={statusCandidate?.newStatus === "inactive" ? "destructive" : "secondary"}
              disabled={mutating}
              onClick={handleToggleStatus}
            >
              {mutating ? "Updating…" : statusCandidate?.newStatus === "inactive" ? "Yes, Deactivate" : "Yes, Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
