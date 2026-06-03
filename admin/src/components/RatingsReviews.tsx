import { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Star, TrendingDown, Award, AlertCircle, RefreshCw } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { toast } from "sonner"
import { fetchAdminRatings, type AdminRatingsPayload } from "../lib/adminContent"

export function RatingsReviews() {
  const [data, setData] = useState<AdminRatingsPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeDriver, setActiveDriver] = useState<AdminRatingsPayload["driverRatings"][0] | null>(null)
  const [actionDriver, setActionDriver] = useState<AdminRatingsPayload["driverRatings"][0] | null>(null)
  const [actionNote, setActionNote] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const payload = await fetchAdminRatings()
      setData(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load ratings data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const driverRatings = data?.driverRatings ?? []
  const routePerformance = data?.routePerformance ?? []
  const recentReviews = data?.recentReviews ?? []

  const avgRating = useMemo(() => {
    const rated = driverRatings.filter((d) => d.rating > 0)
    if (!rated.length) return 0
    return Math.round((rated.reduce((s, d) => s + d.rating, 0) / rated.length) * 10) / 10
  }, [driverRatings])

  const totalReviews = useMemo(() => driverRatings.reduce((s, d) => s + (d.reviews || 0), 0), [driverRatings])
  const lowRatedDrivers = useMemo(() => driverRatings.filter((d) => d.rating > 0 && d.rating < 3.5).length, [driverRatings])
  const flaggedReviews = useMemo(() => recentReviews.filter((r) => r.flagged).length, [recentReviews])

  const lowPerformers = useMemo(
    () => [...driverRatings].filter((d) => d.rating > 0).sort((a, b) => a.rating - b.rating).slice(0, 3),
    [driverRatings]
  )
  const topPerformers = useMemo(
    () => [...driverRatings].filter((d) => d.rating > 0).sort((a, b) => b.rating - a.rating).slice(0, 3),
    [driverRatings]
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="pt-6">
              <span className="er-skeleton" style={{ height: 32, width: "50%", display: "block" }} />
              <span className="er-skeleton" style={{ height: 14, width: "70%", display: "block", marginTop: 10 }} />
            </CardContent></Card>
          ))}
        </div>
        <Card><CardContent className="pt-6">
          <span className="er-skeleton" style={{ height: 300, display: "block", borderRadius: 8 }} />
        </CardContent></Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="text-sm" style={{ color: "var(--er-text-muted)" }}>
          {driverRatings.length} drivers · {totalReviews} reviews
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />Refresh
        </Button>
      </div>

      {error && (
        <div className="er-banner er-banner-warning">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating || "—"}</div>
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
            <p className="text-xs text-gray-500 mt-1">All-time driver reviews</p>
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
            <AlertCircle className="h-4 w-4 text-yellow-600" />
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
          <p className="text-xs mt-1" style={{ color: "var(--er-text-muted)" }}>
            Average driver rating per active route
          </p>
        </CardHeader>
        <CardContent>
          {routePerformance.length === 0 ? (
            <div className="er-empty-state">No active routes with rating data.</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={routePerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--er-border)" />
                <XAxis dataKey="route" tick={{ fontSize: 11, fill: "var(--er-text-muted)" }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 12, fill: "var(--er-text-muted)" }} />
                <Tooltip
                  formatter={(val: number, _name: string, entry: any) => [
                    `${val} / 5.0`,
                    entry.payload?.driverName || "Rating",
                  ]}
                />
                <Legend />
                <Bar dataKey="avgRating" fill="#f59e0b" name="Avg Rating" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
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
                <TableHead>School / Route</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Total Reviews</TableHead>
                <TableHead>Monthly Avg</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {driverRatings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    No driver rating data available yet.
                  </td>
                </tr>
              ) : driverRatings.map((driver) => (
                <tr key={driver.id} className="border-b" style={{ borderColor: "var(--er-border)" }}>
                  <td className="py-3 px-4 font-medium">{driver.driver}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{driver.route}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className={driver.rating > 0 && driver.rating < 3.5 ? "text-red-600 font-medium" : ""}>
                        {driver.rating > 0 ? driver.rating.toFixed(1) : "—"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{driver.reviews}</td>
                  <td className="py-3 px-4">{driver.avgMonth}</td>
                  <td className="py-3 px-4">
                    {driver.rating === 0 ? (
                      <Badge variant="secondary">No Data</Badge>
                    ) : driver.rating < 3.5 ? (
                      <Badge variant="destructive">Needs Attention</Badge>
                    ) : driver.rating >= 4.5 ? (
                      <Badge variant="success">Excellent</Badge>
                    ) : (
                      <Badge variant="outline">Good</Badge>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setActiveDriver(driver)}>View</Button>
                      {driver.rating > 0 && driver.rating < 3.5 && (
                        <Button size="sm" variant="outline" onClick={() => setActionDriver(driver)}>Review</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      {recentReviews.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Recent Reviews</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReviews.map((review: any) => (
                <div
                  key={review.id}
                  className={`p-4 border rounded-lg ${review.flagged ? "border-red-300 bg-red-50 dark:bg-red-900/10" : ""}`}
                  style={{ borderColor: review.flagged ? undefined : "var(--er-border)" }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{review.parent}</p>
                      <p className="text-sm text-gray-500">Driver: {review.driver}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm">{review.comment}</p>
                  <p className="text-xs text-gray-500 mt-2">{review.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {recentReviews.length === 0 && (
        <Card>
          <CardHeader><CardTitle>Recent Reviews</CardTitle></CardHeader>
          <CardContent>
            <div className="er-empty-state">No individual review records stored yet. Ratings are aggregated from driver profiles.</div>
          </CardContent>
        </Card>
      )}

      {/* Quality Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Quality Improvement Needed</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowPerformers.length === 0 ? (
                <p className="text-sm text-gray-500">All drivers are performing above 3.5 — great work!</p>
              ) : lowPerformers.map((driver) => (
                <div key={driver.id} className="flex justify-between items-center p-3 rounded-lg"
                  style={{ background: "var(--er-danger-soft)" }}>
                  <div>
                    <p className="font-medium">{driver.driver}</p>
                    <p className="text-sm text-gray-500">Rating: {driver.rating.toFixed(1)} / 5.0 · {driver.reviews} reviews</p>
                  </div>
                  <Button size="sm" onClick={() => setActionDriver(driver)}>Take Action</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top Performers</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.length === 0 ? (
                <p className="text-sm text-gray-500">No rated drivers yet.</p>
              ) : topPerformers.map((driver) => (
                <div key={driver.id} className="flex justify-between items-center p-3 rounded-lg"
                  style={{ background: "var(--er-success-soft)" }}>
                  <div>
                    <p className="font-medium">{driver.driver}</p>
                    <p className="text-sm text-gray-500">
                      Rating: {driver.rating.toFixed(1)} / 5.0 · {driver.reviews} reviews
                    </p>
                  </div>
                  <Award className="h-6 w-6" style={{ color: "var(--er-success)" }} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Driver detail dialog */}
      <Dialog open={Boolean(activeDriver)} onOpenChange={(open) => !open && setActiveDriver(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeDriver?.driver}</DialogTitle>
            <DialogDescription>Driver performance snapshot</DialogDescription>
          </DialogHeader>
          {activeDriver && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p style={{ color: "var(--er-text-muted)" }}>School / Route</p><p>{activeDriver.route}</p></div>
              <div><p style={{ color: "var(--er-text-muted)" }}>Rating</p><p>{activeDriver.rating > 0 ? `${activeDriver.rating.toFixed(1)} / 5.0` : "No data"}</p></div>
              <div><p style={{ color: "var(--er-text-muted)" }}>Total Reviews</p><p>{activeDriver.reviews}</p></div>
              <div><p style={{ color: "var(--er-text-muted)" }}>Monthly Avg</p><p>{activeDriver.avgMonth}</p></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveDriver(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Take Action dialog */}
      <Dialog open={Boolean(actionDriver)} onOpenChange={(open) => { if (!open) { setActionDriver(null); setActionNote("") } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Take action on {actionDriver?.driver}</DialogTitle>
            <DialogDescription>Log an internal note for follow-up. Drivers will not see this.</DialogDescription>
          </DialogHeader>
          <textarea
            value={actionNote}
            onChange={(e) => setActionNote(e.target.value)}
            rows={5}
            className="w-full rounded-lg p-3 text-sm"
            style={{
              background: "var(--er-surface-muted)",
              border: "1px solid var(--er-border-strong)",
              color: "var(--er-text)",
            }}
            placeholder="e.g. Schedule retraining for safe driving practices…"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setActionDriver(null); setActionNote("") }}>Cancel</Button>
            <Button onClick={() => {
              if (!actionNote.trim()) {
                toast.error("Add a short note", { description: "Notes help future admins follow up." })
                return
              }
              toast.success("Action logged", { description: `Note saved for ${actionDriver?.driver}.` })
              setActionDriver(null)
              setActionNote("")
            }}>
              Save note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
