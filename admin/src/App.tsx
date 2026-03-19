import { FormEvent, useEffect, useState } from "react"
import {
  LayoutDashboard,
  Users,
  Navigation,
  DollarSign,
  Star,
  MessageSquare,
  AlertCircle,
  BarChart3,
  Settings,
  Shield,
  FileText,
  Menu,
  X,
  Bell,
  User,
  LogOut,
  ShieldCheck,
  Loader2
} from "lucide-react"
import { DashboardOverview } from "./components/DashboardOverview"
import { UserManagement } from "./components/UserManagement"
import { RouteManagement } from "./components/RouteManagement"
import { PaymentManagement } from "./components/PaymentManagement"
import { RatingsReviews } from "./components/RatingsReviews"
import { CommunicationManagement } from "./components/CommunicationManagement"
import { ComplaintsSupport } from "./components/ComplaintsSupport"
import { ReportsAnalytics } from "./components/ReportsAnalytics"
import { SystemSettings } from "./components/SystemSettings"
import { AuditLogs } from "./components/AuditLogs"
import { ContentManagement } from "./components/ContentManagement"
import { Button } from "./components/ui/button"
import { adminLogin, clearAdminSession, fetchCurrentAdmin, getStoredAdminUser, hasAdminToken, storeAdminSession, type AdminAuthUser } from "./lib/api"

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "User Management", icon: Users },
  { id: "routes", label: "Route & Bus", icon: Navigation },
  { id: "payments", label: "Payments", icon: DollarSign },
  { id: "ratings", label: "Ratings & Reviews", icon: Star },
  { id: "communication", label: "Communication", icon: MessageSquare },
  { id: "complaints", label: "Complaints", icon: AlertCircle },
  { id: "reports", label: "Reports & Analytics", icon: BarChart3 },
  { id: "settings", label: "System Settings", icon: Settings },
  { id: "audit", label: "Audit Logs", icon: Shield },
  { id: "content", label: "Content Management", icon: FileText },
]

export default function App() {
  const [activeMenu, setActiveMenu] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [adminUser, setAdminUser] = useState<AdminAuthUser | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [authError, setAuthError] = useState("")
  const [credentials, setCredentials] = useState({
    email: "admin@eduride.com",
    password: "Admin@123",
  })

  useEffect(() => {
    let active = true

    const restoreSession = async () => {
      if (!hasAdminToken()) {
        if (active) {
          setIsAuthLoading(false)
        }
        return
      }

      const localUser = getStoredAdminUser()
      if (active && localUser) {
        setAdminUser(localUser)
      }

      try {
        const user = await fetchCurrentAdmin()
        if (active) {
          setAdminUser(user)
          setAuthError("")
        }
      } catch {
        clearAdminSession()
        if (active) {
          setAdminUser(null)
          setAuthError("Session expired. Please sign in again.")
        }
      } finally {
        if (active) {
          setIsAuthLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      active = false
    }
  }, [])

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isLoggingIn) {
      return
    }

    setIsLoggingIn(true)
    setAuthError("")

    try {
      const response = await adminLogin(credentials.email.trim(), credentials.password)
      storeAdminSession(response.token, response.user)
      setAdminUser(response.user)
      setActiveMenu("dashboard")
      setSidebarOpen(true)
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Unable to sign in")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = () => {
    clearAdminSession()
    setAdminUser(null)
    setAuthError("")
    setCredentials((prev) => ({ ...prev, password: "" }))
    setActiveMenu("dashboard")
  }

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <DashboardOverview />
      case "users":
        return <UserManagement />
      case "routes":
        return <RouteManagement />
      case "payments":
        return <PaymentManagement />
      case "ratings":
        return <RatingsReviews />
      case "communication":
        return <CommunicationManagement />
      case "complaints":
        return <ComplaintsSupport />
      case "reports":
        return <ReportsAnalytics />
      case "settings":
        return <SystemSettings />
      case "audit":
        return <AuditLogs />
      case "content":
        return <ContentManagement />
      default:
        return <DashboardOverview />
    }
  }

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 max-w-sm w-full text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold">Checking admin session</h2>
          <p className="text-sm text-gray-500 mt-1">Please wait while we connect to the backend.</p>
        </div>
      </div>
    )
  }

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Edu-Ride Admin</h1>
              <p className="text-sm text-gray-500">Sign in to access live backend data</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={credentials.email}
                onChange={(event) => setCredentials((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@eduride.com"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
            </div>

            {authError ? <p className="text-sm text-red-600">{authError}</p> : null}

            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Navigation className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Edu-Ride Admin</h1>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-600 rounded-full"></span>
            </Button>
            <div className="flex items-center gap-2">
              {adminUser.profilePhoto ? (
                <img src={adminUser.profilePhoto} alt={adminUser.fullName} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
              )}
              <div className="hidden md:block">
                <p className="text-sm font-medium">{adminUser.fullName || "Admin User"}</p>
                <p className="text-xs text-gray-500">{adminUser.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-200 z-20 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id)
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false)
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeMenu === item.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-200 ${sidebarOpen ? "lg:pl-64" : ""
          }`}
      >
        <div className="p-6 max-w-[1600px] mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
