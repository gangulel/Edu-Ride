import { useState } from "react"
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
  User
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
              <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500">admin@eduride.com</p>
              </div>
            </div>
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
