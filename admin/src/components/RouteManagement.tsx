import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { MapPin, Navigation, Users, AlertTriangle, Eye } from "lucide-react"
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

  useEffect(() => {
    let mounted = true

    apiRequest<{ routes: RouteData[] }>("/routes?limit=200")
      .then((payload) => {
        if (mounted) {
          setRoutes(payload.routes)
        }
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

  const filteredRoutes = useMemo(
    () => routes.filter((route) => `${route.name} ${route.driver?.fullName || ""} ${route.stops.map((s) => s.location).join(" ")}`.toLowerCase().includes(search.toLowerCase())),
    [routes, search]
  )

  const activeRoutes = routes.filter((route) => route.status === "active").length
  const totalStudents = routes.reduce((sum, route) => sum + (route.studentCount || 0), 0)
  const overlaps = 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          
        </div>
        <Button>
          <MapPin className="h-4 w-4 mr-2" />
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
            <div className="flex gap-2 mt-6">
              <Button>Edit Route</Button>
              <Button variant="outline">View on Map</Button>
              <Button variant="destructive">Deactivate Route</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
