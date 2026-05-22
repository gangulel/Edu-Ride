import { useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  BarChart3,
  Bell,
  ChevronDown,
  DollarSign,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  Navigation,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Shield,
  Sparkles,
  Star,
  User,
  Users,
  X,
} from "lucide-react"
import { Toaster } from "./components/ui/sonner"
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
import { LoginScreen } from "./components/LoginScreen"
import { ThemeSwitch } from "./components/ThemeSwitch"
import { ThemeProvider } from "./lib/theme"
import {
  adminLogin,
  clearAdminSession,
  fetchCurrentAdmin,
  getStoredAdminUser,
  hasAdminToken,
  storeAdminSession,
  type AdminAuthUser,
} from "./lib/api"

type MenuGroup = {
  title: string
  items: Array<{
    id: string
    label: string
    description: string
    icon: typeof LayoutDashboard
  }>
}

const menuGroups: MenuGroup[] = [
  {
    title: "Overview",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        description: "Real-time KPIs and alerts",
        icon: LayoutDashboard,
      },
      {
        id: "reports",
        label: "Reports & Analytics",
        description: "Trends and exports",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        id: "users",
        label: "User Management",
        description: "Parents, drivers, access",
        icon: Users,
      },
      {
        id: "routes",
        label: "Routes & Buses",
        description: "Fleet and route planning",
        icon: Navigation,
      },
      {
        id: "payments",
        label: "Payments",
        description: "Transactions & invoicing",
        icon: DollarSign,
      },
    ],
  },
  {
    title: "Engagement",
    items: [
      {
        id: "ratings",
        label: "Ratings & Reviews",
        description: "Service satisfaction",
        icon: Star,
      },
      {
        id: "communication",
        label: "Communication",
        description: "Broadcasts and chat",
        icon: MessageSquare,
      },
      {
        id: "complaints",
        label: "Complaints",
        description: "Resolution workflow",
        icon: AlertCircle,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        id: "content",
        label: "Content",
        description: "App copy & policies",
        icon: FileText,
      },
      {
        id: "settings",
        label: "Settings",
        description: "Platform configuration",
        icon: Settings,
      },
      {
        id: "audit",
        label: "Audit Logs",
        description: "Activity timeline",
        icon: Shield,
      },
    ],
  },
]

const flatMenu = menuGroups.flatMap((group) => group.items)

function AppShell() {
  const [activeMenu, setActiveMenu] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [adminUser, setAdminUser] = useState<AdminAuthUser | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [authError, setAuthError] = useState("")
  const [showLogin, setShowLogin] = useState(false)
  const [globalQuery, setGlobalQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  useEffect(() => {
    let active = true

    const restoreSession = async () => {
      try {
        if (hasAdminToken()) {
          const localUser = getStoredAdminUser()
          if (active && localUser) {
            setAdminUser(localUser)
          }

          const user = await fetchCurrentAdmin()
          if (active) {
            setAdminUser(user)
            setShowLogin(false)
            setAuthError("")
          }
        } else {
          if (active) {
            setShowLogin(true)
          }
        }
      } catch (error) {
        clearAdminSession()
        if (active) {
          setAdminUser(null)
          setShowLogin(true)
          setAuthError(error instanceof Error ? error.message : "Session expired")
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

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return
      if (window.innerWidth >= 1024) {
        setMobileOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setSearchOpen((value) => !value)
      }
      if (event.key === "Escape") {
        setSearchOpen(false)
        setProfileOpen(false)
        setNotificationsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  const handleLogin = async (email: string, password: string) => {
    const response = await adminLogin(email, password)
    storeAdminSession(response.token, response.user)
    setAdminUser(response.user)
    setShowLogin(false)
    setAuthError("")
  }

  const handleLogout = () => {
    clearAdminSession()
    setAdminUser(null)
    setShowLogin(true)
    setProfileOpen(false)
  }

  const activeItem = useMemo(
    () => flatMenu.find((item) => item.id === activeMenu) || flatMenu[0],
    [activeMenu]
  )

  const matchedItems = useMemo(() => {
    const query = globalQuery.trim().toLowerCase()
    if (!query) return flatMenu
    return flatMenu.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    )
  }, [globalQuery])

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
      <div className="admin-boot">
        <div className="admin-boot-card">
          <Loader2 className="h-8 w-8 animate-spin admin-boot-icon" />
          <h2>Loading workspace</h2>
          <p>Connecting securely to the Edu-Ride backend</p>
        </div>
      </div>
    )
  }

  if (showLogin || !adminUser) {
    return <LoginScreen onSubmit={handleLogin} externalError={authError} />
  }

  return (
    <div
      className={`admin-app admin-theme ${sidebarOpen ? "" : "sidebar-hidden"} ${
        sidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${mobileOpen ? "is-open" : ""} ${
          sidebarCollapsed ? "is-collapsed" : ""
        }`}
        aria-hidden={!sidebarOpen}
      >
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <div className="admin-brand-mark">
              <Navigation className="h-5 w-5" />
            </div>
            {!sidebarCollapsed && (
              <div className="admin-brand-text">
                <span className="admin-brand-name">Edu-Ride</span>
                <span className="admin-brand-sub">Admin Console</span>
              </div>
            )}
          </div>
          <button
            type="button"
            className="admin-collapse-btn admin-icon-btn"
            onClick={() => setSidebarCollapsed((value) => !value)}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {menuGroups.map((group) => (
            <div key={group.title} className="admin-nav-group">
              {!sidebarCollapsed && (
                <p className="admin-nav-group-title">{group.title}</p>
              )}
              <div className="admin-nav-list">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeMenu === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveMenu(item.id)
                        setMobileOpen(false)
                      }}
                      className={`admin-nav-link ${isActive ? "is-active" : ""}`}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <span className="admin-nav-link-icon">
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      {!sidebarCollapsed && (
                        <span className="admin-nav-link-text">
                          <span className="admin-nav-link-label">{item.label}</span>
                          <span className="admin-nav-link-desc">{item.description}</span>
                        </span>
                      )}
                      {isActive && <span className="admin-nav-link-indicator" />}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {!sidebarCollapsed && (
          <div className="admin-sidebar-footer">
            <div className="admin-upgrade-card">
              <Sparkles className="h-4 w-4" />
              <div>
                <p className="admin-upgrade-title">All systems operational</p>
                <p className="admin-upgrade-sub">Backend uptime 99.98%</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {mobileOpen && (
        <div
          className="admin-mobile-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Topbar */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <button
            type="button"
            className="admin-icon-btn admin-mobile-toggle"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <button
            type="button"
            className="admin-icon-btn admin-desktop-toggle"
            onClick={() => setSidebarOpen((value) => !value)}
            aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeftOpen className="h-5 w-5" />
            )}
          </button>

          <div className="admin-breadcrumb">
            <span className="admin-breadcrumb-section">Admin</span>
            <span className="admin-breadcrumb-sep">/</span>
            <span className="admin-breadcrumb-current">{activeItem.label}</span>
          </div>
        </div>

        <div className="admin-topbar-search">
          <button
            type="button"
            className="admin-search-trigger"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span>Search modules, users, routes...</span>
            <kbd className="admin-kbd">⌘K</kbd>
          </button>
        </div>

        <div className="admin-topbar-right">
          <ThemeSwitch />

          <div className="admin-popover-wrap">
            <button
              type="button"
              className="admin-icon-btn admin-bell"
              onClick={() => {
                setNotificationsOpen((value) => !value)
                setProfileOpen(false)
              }}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="admin-bell-dot" />
            </button>
            {notificationsOpen && (
              <div className="admin-popover admin-notif-popover">
                <div className="admin-popover-header">
                  <span>Notifications</span>
                  <button
                    type="button"
                    className="admin-popover-action"
                    onClick={() => setNotificationsOpen(false)}
                  >
                    Mark all read
                  </button>
                </div>
                <ul className="admin-notif-list">
                  <li>
                    <span className="admin-notif-dot is-info" />
                    <div>
                      <p>3 new bookings awaiting approval</p>
                      <span>Just now</span>
                    </div>
                  </li>
                  <li>
                    <span className="admin-notif-dot is-warn" />
                    <div>
                      <p>Driver verification needs review</p>
                      <span>5 min ago</span>
                    </div>
                  </li>
                  <li>
                    <span className="admin-notif-dot is-ok" />
                    <div>
                      <p>Daily payouts settled successfully</p>
                      <span>1 hr ago</span>
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <button
            type="button"
            className="admin-icon-btn admin-help-btn"
            aria-label="Help"
            title="Help & documentation"
            onClick={() =>
              window.open("https://docs.eduride.example.com", "_blank", "noopener,noreferrer")
            }
          >
            <HelpCircle className="h-5 w-5" />
          </button>

          <div className="admin-popover-wrap">
            <button
              type="button"
              className="admin-profile-trigger"
              onClick={() => {
                setProfileOpen((value) => !value)
                setNotificationsOpen(false)
              }}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
            >
              {adminUser.profilePhoto ? (
                <img
                  src={adminUser.profilePhoto}
                  alt={adminUser.fullName}
                  className="admin-profile-avatar"
                />
              ) : (
                <span className="admin-profile-avatar admin-profile-avatar-fallback">
                  {(adminUser.fullName || "A").slice(0, 1).toUpperCase()}
                </span>
              )}
              <span className="admin-profile-meta">
                <span className="admin-profile-name">{adminUser.fullName || "Admin"}</span>
                <span className="admin-profile-role">{adminUser.email}</span>
              </span>
              <ChevronDown className="h-4 w-4 admin-profile-caret" />
            </button>
            {profileOpen && (
              <div className="admin-popover admin-profile-popover" role="menu">
                <div className="admin-popover-header">
                  <span>Signed in as</span>
                  <span className="admin-profile-mail">{adminUser.email}</span>
                </div>
                <button
                  type="button"
                  className="admin-popover-item"
                  onClick={() => {
                    setProfileOpen(false)
                    setActiveMenu("settings")
                  }}
                >
                  <User className="h-4 w-4" /> Profile &amp; preferences
                </button>
                <button
                  type="button"
                  className="admin-popover-item"
                  onClick={() => {
                    setProfileOpen(false)
                    setActiveMenu("settings")
                  }}
                >
                  <Settings className="h-4 w-4" /> System settings
                </button>
                <div className="admin-popover-divider" />
                <button
                  type="button"
                  className="admin-popover-item is-danger"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-main-header animate-fade-up">
          <div>
            <p className="admin-eyebrow">{activeItem.description}</p>
            <h1 className="admin-page-title">{activeItem.label}</h1>
          </div>
          {authError && (
            <span className="admin-banner-warning">{authError}</span>
          )}
        </div>

        <div key={activeMenu} className="admin-main-content animate-fade-up-delay">
          {renderContent()}
        </div>
      </main>

      {/* Command palette */}
      {searchOpen && (
        <div
          className="admin-command-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSearchOpen(false)
              setGlobalQuery("")
            }
          }}
        >
          <div className="admin-command-panel animate-scale-in">
            <div className="admin-command-input-row">
              <Search className="h-4 w-4" />
              <input
                autoFocus
                value={globalQuery}
                onChange={(event) => setGlobalQuery(event.target.value)}
                placeholder="Jump to module, action or settings..."
              />
              <kbd className="admin-kbd">Esc</kbd>
            </div>
            <ul className="admin-command-list">
              {matchedItems.length === 0 && (
                <li className="admin-command-empty">No matches. Try a different keyword.</li>
              )}
              {matchedItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="admin-command-item"
                      onClick={() => {
                        setActiveMenu(item.id)
                        setSearchOpen(false)
                        setGlobalQuery("")
                      }}
                    >
                      <span className="admin-command-item-icon">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="admin-command-item-label">{item.label}</span>
                        <span className="admin-command-item-desc">{item.description}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}

      <Toaster position="bottom-right" richColors closeButton />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  )
}
