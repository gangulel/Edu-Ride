import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { MapPin, Navigation, Users, AlertTriangle, Eye, Plus, Map, Power } from "lucide-react"
import { toast } from "sonner"
import { apiRequest } from "../lib/api"

type RouteData = {
  _id: string
  name: string
  driver?: { fullName?: string }
  vehicle?: { licensePlate?: string }
  stops: Array<{ location: string }>
  studentCount: number
  status: "active" | "inactive"
  schoolArrival?: string | null
  schoolDeparture?: string | null
}

export function RouteManagement() {
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null)
  const [routes, setRoutes] = useState<RouteData[]>([])
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [confirmDeactivate, setConfirmDeactivate] = useState<RouteData | null>(null)
  const [mutating, setMutating] = useState(false)
  const [showAddInfo, setShowAddInfo] = useState(false)

  useEffect(() => {
    let mounted = true

    apiRequest<{ routes: RouteData[] }>("/routes?limit=200")
      .then((payload) => {
        if (mounted) {
          setRoutes(payload.routes)
          setError("")
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message)
        }
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const openMap = (route: RouteData) => {
    const stops = route.stops?.map((s) => s.location).filter(Boolean) ?? []
    if (stops.length === 0) {
      toast.message("No stops to map", { description: "This route has no stops yet." })
      return
    }
    const query = encodeURIComponent(stops.join(" / "))
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank", "noopener,noreferrer")
  }

  const handleDeactivate = async (route: RouteData) => {
    setMutating(true)
    try {
      await apiRequest(`/routes/${route._id}`, "DELETE")
      setRoutes((prev) => prev.filter((item) => item._id !== route._id))
      if (selectedRoute?._id === route._id) setSelectedRoute(null)
      setConfirmDeactivate(null)
      toast.success("Route deactivated", { description: `${route.name} has been removed.` })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not deactivate route"
      toast.error("Action failed", { description: message })
    } finally {
      setMutating(false)
    }
  }

  const filteredRoutes = useMemo(
    () => routes.filter((route) => `${route.name} ${route.driver?.fullName || ""} ${route.stops.map((s) => s.location).join(" ")}`.toLowerCase().includes(search.toLowerCase())),
    [routes, search]
  )

  const activeRoutes = routes.filter((route) => route.status === "active").length
  const totalStudents = routes.reduce((sum, route) => sum + (route.studentCount || 0), 0)
  const overlaps = 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--er-text-muted)" }}>
          {loading ? (
            <span className="er-skeleton" style={{ width: 140, height: 14 }} />
          ) : (
            <>
              <span className="er-live-dot" />
              {routes.length} route{routes.length === 1 ? "" : "s"} loaded
            </>
          )}
        </div>
        <Button onClick={() => setShowAddInfo(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Route
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Routes</CardTitle>
            <Navigation className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{routes.length}</div>
            <p className="text-xs text-gray-500 mt-1">Live routes in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Active Routes</CardTitle>
            <Navigation className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeRoutes}</div>
            <p className="text-xs text-gray-500 mt-1">{routes.length ? Math.round((activeRoutes / routes.length) * 100) : 0}% of total routes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Students</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-gray-500 mt-1">Students across all routes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Route Overlaps</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{overlaps}</div>
            <p className="text-xs text-gray-500 mt-1">Detected conflicts</p>
          </CardContent>
        </Card>
      </div>

      {/* Routes Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input placeholder="Search routes by name, driver, or town..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route Name</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Towns Covered</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoutes.map((route) => (
                <TableRow key={route._id}>
                  <TableCell>
                    <div className="flex items-center">
                      {route.name}
                      {false && (
                        <AlertTriangle className="h-4 w-4 text-yellow-600 ml-2" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{route.driver?.fullName || "--"}</TableCell>
                  <TableCell>{route.vehicle?.licensePlate || "--"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {route.stops.slice(0, 2).map((stop, idx) => (
                        <Badge key={idx} variant="outline">{stop.location}</Badge>
                      ))}
                      {route.stops.length > 2 && (
                        <Badge variant="secondary">+{route.stops.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{route.studentCount || 0}</TableCell>
                  <TableCell className="text-sm">{route.schoolArrival || "--"} - {route.schoolDeparture || "--"}</TableCell>
                  <TableCell>
                    <Badge variant={route.status === 'active' ? 'success' : 'secondary'}>
                      {route.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => setSelectedRoute(route)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {error && !loading ? (
        <div className="er-banner er-banner-warning">
          <AlertTriangle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      ) : null}

      {/* Route Details */}
      {selectedRoute && (
        <Card>
          <CardHeader>
            <CardTitle>Route Details: {selectedRoute.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Assigned Driver</p>
                  <p className="font-medium">{selectedRoute.driver?.fullName || "--"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle</p>
                  <p className="font-medium">{selectedRoute.vehicle?.licensePlate || "--"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Schedule</p>
                  <p className="font-medium">{selectedRoute.schoolArrival || "--"} - {selectedRoute.schoolDeparture || "--"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant={selectedRoute.status === 'active' ? 'success' : 'secondary'}>
                    {selectedRoute.status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Towns Covered</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedRoute.stops.map((stop, idx) => (
                      <Badge key={idx} variant="outline">{stop.location}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Number of Students</p>
                  <p className="font-medium">{selectedRoute.studentCount || 0} students</p>
                </div>
                {false && (
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-900">Route Overlap Detected</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          This route overlaps with Route A in the Downtown area
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              <Button
                onClick={() =>
                  toast.message("Edit handled by driver app", {
                    description: "Route updates are scoped to the assigned driver. Coordinate via chat.",
                  })
                }
              >
                Edit Route
              </Button>
              <Button variant="outline" onClick={() => openMap(selectedRoute)}>
                <Map className="h-4 w-4 mr-2" />
                View on Map
              </Button>
              <Button variant="destructive" onClick={() => setConfirmDeactivate(selectedRoute)} disabled={mutating}>
                <Power className="h-4 w-4 mr-2" />
                Deactivate Route
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showAddInfo} onOpenChange={setShowAddInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new route</DialogTitle>
            <DialogDescription>
              Routes are created by drivers from the mobile app — they include the live GPS, vehicle and stops they own.
              From here you can monitor, audit and deactivate routes.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border p-3 text-sm" style={{ borderColor: "var(--er-border)", color: "var(--er-text-muted)" }}>
            Need to invite a driver? Use the User Management screen to verify a pending driver. Once approved they will be able to publish a new route from the mobile app.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddInfo(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(confirmDeactivate)}
        onOpenChange={(open) => {
          if (!open && !mutating) setConfirmDeactivate(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate route?</DialogTitle>
            <DialogDescription>
              This will remove “{confirmDeactivate?.name}” from active routing. Parents will no longer see live tracking for this route.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeactivate(null)} disabled={mutating}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={mutating || !confirmDeactivate}
              onClick={() => confirmDeactivate && handleDeactivate(confirmDeactivate)}
            >
              {mutating ? "Deactivating..." : "Yes, deactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
