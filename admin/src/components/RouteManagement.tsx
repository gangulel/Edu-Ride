import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { MapPin, Navigation, Users, AlertTriangle, Eye } from "lucide-react"

const routes = [
  { id: 1, name: "Route A", driver: "Kumara Silva", vehicle: "Bus-101", towns: ["Colombo", "Dehiwala", "Maharagama"], students: 28, status: "active", schedule: "7:00 AM - 8:30 AM", overlaps: false },
  { id: 2, name: "Route B", driver: "Nimal Perera", vehicle: "Bus-102", towns: ["Nugegoda", "Kotte", "Battaramulla"], students: 34, status: "active", schedule: "7:15 AM - 8:45 AM", overlaps: false },
  { id: 3, name: "Route C", driver: "Chaminda Fernando", vehicle: "Bus-103", towns: ["Moratuwa", "Panadura", "Kalutara"], students: 22, status: "inactive", schedule: "7:00 AM - 8:30 AM", overlaps: false },
  { id: 4, name: "Route D", driver: "Ayesha Jayawardena", vehicle: "Bus-104", towns: ["Colombo", "Mount Lavinia", "Boralesgamuwa"], students: 31, status: "active", schedule: "7:05 AM - 8:35 AM", overlaps: true },
  { id: 5, name: "Route E", driver: "Sunil Bandara", vehicle: "Bus-105", towns: ["Kaduwela", "Malabe", "Athurugiriya"], students: 26, status: "active", schedule: "7:20 AM - 8:50 AM", overlaps: false },
]

export function RouteManagement() {
  const [selectedRoute, setSelectedRoute] = useState<any>(null)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2>Route & Bus Management</h2>
          <p className="text-gray-500 mt-1">Manage bus routes and monitor route efficiency</p>
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
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-gray-500 mt-1">8 routes added this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Active Routes</CardTitle>
            <Navigation className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">142</div>
            <p className="text-xs text-gray-500 mt-1">91% of total routes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Students</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,234</div>
            <p className="text-xs text-gray-500 mt-1">Students across all routes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Route Overlaps</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">7</div>
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
            <Input placeholder="Search routes by name, driver, or town..." />
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
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell>
                    <div className="flex items-center">
                      {route.name}
                      {route.overlaps && (
                        <AlertTriangle className="h-4 w-4 text-yellow-600 ml-2" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{route.driver}</TableCell>
                  <TableCell>{route.vehicle}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {route.towns.slice(0, 2).map((town, idx) => (
                        <Badge key={idx} variant="outline">{town}</Badge>
                      ))}
                      {route.towns.length > 2 && (
                        <Badge variant="secondary">+{route.towns.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{route.students}</TableCell>
                  <TableCell className="text-sm">{route.schedule}</TableCell>
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
                  <p className="font-medium">{selectedRoute.driver}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle</p>
                  <p className="font-medium">{selectedRoute.vehicle}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Schedule</p>
                  <p className="font-medium">{selectedRoute.schedule}</p>
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
                    {selectedRoute.towns.map((town: string, idx: number) => (
                      <Badge key={idx} variant="outline">{town}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Number of Students</p>
                  <p className="font-medium">{selectedRoute.students} students</p>
                </div>
                {selectedRoute.overlaps && (
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
