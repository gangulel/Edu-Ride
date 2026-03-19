import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Star, Flag, TrendingDown, Award } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { fetchAdminContent } from "../lib/adminContent"

export function RatingsReviews() {
  const [driverRatings, setDriverRatings] = useState<any[]>([])
  const [recentReviews, setRecentReviews] = useState<any[]>([])
  const [routePerformance, setRoutePerformance] = useState<any[]>([])

  useEffect(() => {
    fetchAdminContent()
      .then((payload) => {
        setDriverRatings(payload.ratings?.driverRatings || [])
        setRecentReviews(payload.ratings?.recentReviews || [])
        setRoutePerformance(payload.ratings?.routePerformance || [])
      })
      .catch(() => {
        setDriverRatings([])
        setRecentReviews([])
        setRoutePerformance([])
      })
  }, [])

  const avgRating = useMemo(() => {
    if (!driverRatings.length) return 0
    return Math.round((driverRatings.reduce((sum, d) => sum + Number(d.rating || 0), 0) / driverRatings.length) * 10) / 10
  }, [driverRatings])

  const totalReviews = useMemo(() => driverRatings.reduce((sum, d) => sum + Number(d.reviews || 0), 0), [driverRatings])
  const lowRatedDrivers = useMemo(() => driverRatings.filter((d) => Number(d.rating || 0) < 3.5).length, [driverRatings])
  const flaggedReviews = useMemo(() => recentReviews.filter((r) => Boolean(r.flagged)).length, [recentReviews])

  return (
    <div className="space-y-6">
      {/* <div>
        <h2>Ratings, Reviews & Quality Monitoring</h2>
        <p className="text-gray-500 mt-1">Monitor driver performance and service quality</p>
      </div> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating || "-"}</div>
            <p className="text-xs text-gray-500 mt-1">Across all drivers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Reviews</CardTitle>
            <Award className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              Based on DB data
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Low-Rated Drivers</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowRatedDrivers}</div>
            <p className="text-xs text-gray-500 mt-1">Below 3.5 rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Flagged Reviews</CardTitle>
            <Flag className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{flaggedReviews}</div>
            <p className="text-xs text-gray-500 mt-1">Pending review</p>
          </CardContent>
        </Card>
      </div>

      {/* Route Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by Route</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={routePerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="route" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgRating" fill="#f59e0b" name="Average Rating" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Driver Ratings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Ratings Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Total Reviews</TableHead>
                <TableHead>Low Ratings</TableHead>
                <TableHead>Flagged</TableHead>
                <TableHead>Monthly Avg</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {driverRatings.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell>{driver.driver}</TableCell>
                  <TableCell>{driver.route}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-600 mr-1" />
                      <span className={driver.rating < 3.5 ? 'text-red-600 font-medium' : ''}>
                        {driver.rating}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{driver.reviews}</TableCell>
                  <TableCell>
                    {driver.lowRated > 20 ? (
                      <span className="text-red-600 font-medium">{driver.lowRated}</span>
                    ) : (
                      <span>{driver.lowRated}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {driver.flagged > 0 ? (
                      <Badge variant="warning">{driver.flagged}</Badge>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </TableCell>
                  <TableCell>{driver.avgMonth}</TableCell>
                  <TableCell>
                    {driver.rating < 3.5 ? (
                      <Badge variant="destructive">Needs Attention</Badge>
                    ) : driver.rating >= 4.5 ? (
                      <Badge variant="success">Excellent</Badge>
                    ) : (
                      <Badge variant="outline">Good</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">View</Button>
                      {driver.rating < 3.5 && (
                        <Button size="sm" variant="outline">Review</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div key={review.id} className={`p-4 border rounded-lg ${review.flagged ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{review.parent}</p>
                    <p className="text-sm text-gray-500">Driver: {review.driver}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? 'text-yellow-600 fill-yellow-600' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    {review.flagged && (
                      <Badge variant="destructive">
                        <Flag className="h-3 w-3 mr-1" />
                        Flagged
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm mb-2">{review.comment}</p>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">{review.date}</p>
                  {review.flagged && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Review</Button>
                      <Button size="sm" variant="ghost">Remove Flag</Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quality Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quality Improvement Needed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium">Nuwan Rajapaksa - Route C</p>
                  <p className="text-sm text-gray-500">Rating: 3.2 / 5.0</p>
                </div>
                <Button size="sm">Take Action</Button>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium">Multiple late pickup reports</p>
                  <p className="text-sm text-gray-500">Zone A routes affected</p>
                </div>
                <Button size="sm" variant="outline">Investigate</Button>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium">Communication issues reported</p>
                  <p className="text-sm text-gray-500">5 drivers mentioned</p>
                </div>
                <Button size="sm" variant="outline">Review</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Sanduni Wijesinghe - Route B</p>
                  <p className="text-sm text-gray-500">Rating: 4.9 / 5.0 (312 reviews)</p>
                </div>
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Kasun Bandara - Route A</p>
                  <p className="text-sm text-gray-500">Rating: 4.8 / 5.0 (234 reviews)</p>
                </div>
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Pradeep Kumara - Route E</p>
                  <p className="text-sm text-gray-500">Rating: 4.7 / 5.0 (267 reviews)</p>
                </div>
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
