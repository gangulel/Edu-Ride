import { useEffect, useState } from "react"
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
  Sun,
  Moon,
  Circle,
  Plus,
  Mail,
  Database,
  FolderOpen,
  Ellipsis,
  Search
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
import { adminLogin, hasAdminToken, storeAdminSession } from "./lib/api"

const DEFAULT_ADMIN_EMAIL = "admin@eduride.com"
const DEFAULT_ADMIN_PASSWORD = "Admin@123"

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, section: "main" },
  { id: "users", label: "User Management", icon: Users, section: "main" },
  { id: "routes", label: "Route & Bus", icon: Navigation, section: "main" },
  { id: "payments", label: "Payments", icon: DollarSign, section: "main" },
  { id: "ratings", label: "Ratings & Reviews", icon: Star, section: "main" },
  { id: "communication", label: "Communication", icon: MessageSquare, section: "main" },
  { id: "complaints", label: "Complaints", icon: AlertCircle, section: "main" },
  { id: "reports", label: "Reports", icon: BarChart3, section: "documents" },
  { id: "content", label: "Content Management", icon: FolderOpen, section: "documents" },
  { id: "audit", label: "Audit Logs", icon: FileText, section: "documents" },
  { id: "settings", label: "Settings", icon: Settings, section: "utility" },
]

export default function App() {
  const [activeMenu, setActiveMenu] = useState("dashboard")
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") {
      return true
    }
    return window.innerWidth >= 1024
  })
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") {
      return true
    }
    return window.innerWidth >= 1024
  })
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") {
      return "light"
    }

    const storedTheme = window.localStorage.getItem("adminTheme")
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    window.localStorage.setItem("adminTheme", theme)
  }, [theme])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const handleResize = () => {
      const desktop = window.innerWidth >= 1024
      setIsDesktop(desktop)
      setSidebarOpen(desktop)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (hasAdminToken()) {
      return
    }

    let cancelled = false

    adminLogin(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD)
      .then((response) => {
        if (!cancelled) {
          storeAdminSession(response.token, response.user)
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Admin auto-login failed:", error)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const isDark = theme === "dark"
  const mainItems = menuItems.filter((item) => item.section === "main")
  const documentItems = menuItems.filter((item) => item.section === "documents")
  const utilityItems = menuItems.filter((item) => item.section === "utility")

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

  return (
    <div className="admin-theme min-h-screen transition-colors">
      {/* Header */}
      <header className="admin-header fixed top-0 left-0 right-0 z-10 h-14 border-b transition-colors lg:h-16">
        <div className="flex h-full items-center justify-between px-3 sm:px-4">
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
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold">Edu-Ride Admin</h1>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="admin-icon-btn"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="admin-icon-btn relative hidden sm:inline-flex">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-600 rounded-full"></span>
            </Button>
            <div className="hidden items-center gap-2 md:flex">
              <div className="admin-avatar h-8 w-8 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 admin-muted" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs admin-muted">admin@eduride.com</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`admin-sidebar admin-sidebar-modern fixed top-14 left-0 bottom-0 z-20 w-[88vw] max-w-72 border-r overflow-y-auto transition-transform duration-200 lg:top-16 lg:w-72 ${isDesktop || sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <nav className="flex h-full flex-col p-3">
          <div className="mb-4 px-1">
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4" />
              <p className="text-3 leading-none font-semibold">Edu-Ride Admin</p>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <button className="admin-quick-create flex-1">
              <Plus className="h-4 w-4" />
              <span>Quick Create</span>
            </button>
            <button className="admin-nav-icon-btn" aria-label="Messages">
              <Mail className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1">
            {mainItems.map((item) => {
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
                  className={`admin-nav-item admin-nav-item-modern w-full rounded-lg px-3 py-2 text-left transition-colors ${activeMenu === item.id ? "admin-nav-item-active" : ""
                    }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-5">
            <p className="admin-section-title px-3">Documents</p>
            <div className="mt-2 space-y-1">
              <button
                onClick={() => {
                  setActiveMenu("content")
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false)
                  }
                }}
                className={`admin-nav-item admin-nav-item-modern w-full rounded-lg px-3 py-2 text-left transition-colors ${activeMenu === "content" ? "admin-nav-item-active" : ""
                  }`}
              >
                <span className="flex items-center gap-3">
                  <Database className="h-4 w-4" />
                  <span>Data Library</span>
                </span>
              </button>
              {documentItems.filter((item) => item.id !== "content").map((item) => {
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
                    className={`admin-nav-item admin-nav-item-modern w-full rounded-lg px-3 py-2 text-left transition-colors ${activeMenu === item.id ? "admin-nav-item-active" : ""
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </span>
                  </button>
                )
              })}
              <button className="admin-nav-item admin-nav-item-modern w-full rounded-lg px-3 py-2 text-left transition-colors">
                <span className="flex items-center gap-3">
                  <Ellipsis className="h-4 w-4" />
                  <span>More</span>
                </span>
              </button>
            </div>
          </div>

          <div className="mt-auto pt-4">
            <div className="space-y-1">
              {utilityItems.map((item) => {
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
                    className={`admin-nav-item admin-nav-item-modern w-full rounded-lg px-3 py-2 text-left transition-colors ${activeMenu === item.id ? "admin-nav-item-active" : ""
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </span>
                  </button>
                )
              })}
              <button className="admin-nav-item admin-nav-item-modern w-full rounded-lg px-3 py-2 text-left transition-colors">
                <span className="flex items-center gap-3">
                  <Shield className="h-4 w-4" />
                  <span>Get Help</span>
                </span>
              </button>
              <button className="admin-nav-item admin-nav-item-modern w-full rounded-lg px-3 py-2 text-left transition-colors">
                <span className="flex items-center gap-3">
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </span>
              </button>
            </div>

            <div className="admin-profile-card mt-3">
              <div className="admin-profile-avatar">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">Admin User</p>
                <p className="truncate text-xs admin-muted">admin@eduride.com</p>
              </div>
              <button className="admin-nav-icon-btn" aria-label="Profile options">
                <Ellipsis className="h-4 w-4" />
              </button>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-14 transition-all duration-200 lg:pt-16 ${isDesktop && sidebarOpen ? "lg:pl-72" : ""
          }`}
      >
        <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-4 sm:py-5 lg:p-6">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && !isDesktop && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
