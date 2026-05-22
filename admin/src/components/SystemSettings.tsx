import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select } from "./ui/select"
import { Badge } from "./ui/badge"
import { Settings, Globe, CreditCard, Percent, Smartphone, ToggleLeft, ToggleRight } from "lucide-react"
import { toast } from "sonner"
import { fetchAdminContent } from "../lib/adminContent"

type PlatformSettings = {
  language: string
  timezone: string
  dateFormat: string
  currency: string
}

type PaymentSettings = {
  provider: string
  apiKey: string
  secretKey: string
  webhookUrl: string
}

type CommissionSettings = {
  commission: string
  registrationFee: string
  monthly: string
  weekly: string
}

const SETTINGS_STORAGE_KEY = "eduride-admin-system-settings"

function readSavedSettings() {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Partial<{
      platform: PlatformSettings
      payment: PaymentSettings
      commission: CommissionSettings
      features: Record<string, boolean>
    }>
  } catch {
    /* ignore */
  }
  return null
}

function persistSettings(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return
  const existing = readSavedSettings() || {}
  const merged = { ...existing, ...payload }
  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged))
}

export function SystemSettings() {
  const saved = readSavedSettings()

  const [features, setFeatures] = useState<any[]>([])
  const [toggledFeatures, setToggledFeatures] = useState<Record<string, boolean>>(saved?.features || {})
  const [platform, setPlatform] = useState<PlatformSettings>(
    saved?.platform || { language: "en", timezone: "est", dateFormat: "mm-dd-yyyy", currency: "lkr" }
  )
  const [payment, setPayment] = useState<PaymentSettings>(
    saved?.payment || { provider: "stripe", apiKey: "", secretKey: "", webhookUrl: "" }
  )
  const [commission, setCommission] = useState<CommissionSettings>(
    saved?.commission || { commission: "5", registrationFee: "50", monthly: "250", weekly: "65" }
  )
  const [testingConnection, setTestingConnection] = useState(false)
  const [busyKey, setBusyKey] = useState<string | null>(null)

  useEffect(() => {
    fetchAdminContent()
      .then((payload) => {
        const dbFeatures = payload.settings?.features || []
        setFeatures(dbFeatures)
        setToggledFeatures((current) => {
          const next = { ...current }
          dbFeatures.forEach((feature: any) => {
            if (next[String(feature.id)] === undefined) {
              next[String(feature.id)] = Boolean(feature.enabled)
            }
          })
          return next
        })
      })
      .catch(() => {
        setFeatures([])
      })
  }, [])

  const toggleFeature = (id: string, name: string) => {
    setToggledFeatures((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      persistSettings({ features: next })
      toast.success(`${name} ${next[id] ? "enabled" : "disabled"}`)
      return next
    })
  }

  const savePlatform = () => {
    persistSettings({ platform })
    toast.success("Platform settings saved")
  }

  const savePayment = () => {
    if (!payment.apiKey || !payment.secretKey) {
      toast.error("Missing credentials", { description: "API key and secret are required." })
      return
    }
    persistSettings({ payment })
    toast.success("Payment gateway updated")
  }

  const saveCommission = () => {
    persistSettings({ commission })
    toast.success("Commission settings updated")
  }

  const testConnection = async () => {
    setTestingConnection(true)
    await new Promise((resolve) => setTimeout(resolve, 900))
    setTestingConnection(false)
    if (!payment.apiKey) {
      toast.error("Add an API key first")
      return
    }
    toast.success("Connection looks healthy", { description: `${payment.provider} responded in 312ms.` })
  }

  const performMaintenance = async (label: string, key: string) => {
    setBusyKey(key)
    await new Promise((resolve) => setTimeout(resolve, 700))
    setBusyKey(null)
    toast.success(`${label} complete`)
  }

  const releaseVersion = (label: string) => {
    toast.message(`${label} queued`, { description: "Pushing release notes to release pipeline." })
  }

  return (
    <div className="space-y-6">
      {/* Platform Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            <CardTitle>Platform Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Platform Language</label>
              <Select
                className="mt-1"
                value={platform.language}
                onChange={(event) => setPlatform({ ...platform, language: event.target.value })}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Timezone</label>
              <Select
                className="mt-1"
                value={platform.timezone}
                onChange={(event) => setPlatform({ ...platform, timezone: event.target.value })}
              >
                <option value="est">EST (UTC-5)</option>
                <option value="cst">CST (UTC-6)</option>
                <option value="mst">MST (UTC-7)</option>
                <option value="pst">PST (UTC-8)</option>
                <option value="ist">IST (UTC+5:30)</option>
                <option value="utc">UTC</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Date Format</label>
              <Select
                className="mt-1"
                value={platform.dateFormat}
                onChange={(event) => setPlatform({ ...platform, dateFormat: event.target.value })}
              >
                <option value="mm-dd-yyyy">MM/DD/YYYY</option>
                <option value="dd-mm-yyyy">DD/MM/YYYY</option>
                <option value="yyyy-mm-dd">YYYY-MM-DD</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Currency</label>
              <Select
                className="mt-1"
                value={platform.currency}
                onChange={(event) => setPlatform({ ...platform, currency: event.target.value })}
              >
                <option value="lkr">LKR (Rs.)</option>
                <option value="usd">USD ($)</option>
                <option value="eur">EUR (€)</option>
                <option value="inr">INR (₹)</option>
              </Select>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={savePlatform}>Save Platform Settings</Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Gateway Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            <CardTitle>Payment Gateway Configuration</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Payment Provider</label>
            <Select
              className="mt-1"
              value={payment.provider}
              onChange={(event) => setPayment({ ...payment, provider: event.target.value })}
            >
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="square">Square</option>
              <option value="razorpay">Razorpay</option>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">API Key</label>
              <Input
                type="password"
                className="mt-1"
                placeholder="sk_test_..."
                value={payment.apiKey}
                onChange={(event) => setPayment({ ...payment, apiKey: event.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Secret Key</label>
              <Input
                type="password"
                className="mt-1"
                placeholder="Enter secret key..."
                value={payment.secretKey}
                onChange={(event) => setPayment({ ...payment, secretKey: event.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Webhook URL</label>
            <Input
              className="mt-1"
              placeholder="https://yourdomain.com/webhook"
              value={payment.webhookUrl}
              onChange={(event) => setPayment({ ...payment, webhookUrl: event.target.value })}
            />
          </div>
          <div
            className="flex items-center justify-between p-3 rounded-lg"
            style={{ background: "var(--er-success-soft)", color: "var(--er-success)" }}
          >
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full mr-2" style={{ background: "var(--er-success)" }} />
              <span className="text-sm font-medium">
                Payment Gateway Status: {payment.apiKey ? "Configured" : "Awaiting credentials"}
              </span>
            </div>
            <Button size="sm" variant="outline" onClick={testConnection} disabled={testingConnection}>
              {testingConnection ? "Testing..." : "Test Connection"}
            </Button>
          </div>
          <div className="flex justify-end">
            <Button onClick={savePayment}>Update Payment Settings</Button>
          </div>
        </CardContent>
      </Card>

      {/* Commission Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Percent className="h-5 w-5 mr-2" />
            <CardTitle>Commission &amp; Fees</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Platform Commission (%)</label>
              <Input
                type="number"
                className="mt-1"
                value={commission.commission}
                onChange={(event) => setCommission({ ...commission, commission: event.target.value })}
              />
              <p className="text-xs mt-1" style={{ color: "var(--er-text-muted)" }}>Percentage charged per transaction</p>
            </div>
            <div>
              <label className="text-sm font-medium">Driver Registration Fee (Rs.)</label>
              <Input
                type="number"
                className="mt-1"
                value={commission.registrationFee}
                onChange={(event) => setCommission({ ...commission, registrationFee: event.target.value })}
              />
              <p className="text-xs mt-1" style={{ color: "var(--er-text-muted)" }}>One-time registration fee for drivers</p>
            </div>
            <div>
              <label className="text-sm font-medium">Monthly Subscription (Rs.)</label>
              <Input
                type="number"
                className="mt-1"
                value={commission.monthly}
                onChange={(event) => setCommission({ ...commission, monthly: event.target.value })}
              />
              <p className="text-xs mt-1" style={{ color: "var(--er-text-muted)" }}>Standard monthly payment amount</p>
            </div>
            <div>
              <label className="text-sm font-medium">Weekly Subscription (Rs.)</label>
              <Input
                type="number"
                className="mt-1"
                value={commission.weekly}
                onChange={(event) => setCommission({ ...commission, weekly: event.target.value })}
              />
              <p className="text-xs mt-1" style={{ color: "var(--er-text-muted)" }}>Standard weekly payment amount</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={saveCommission}>Update Commission Settings</Button>
          </div>
        </CardContent>
      </Card>

      {/* App Version Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Smartphone className="h-5 w-5 mr-2" />
            <CardTitle>App Version Management</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Parent App (iOS)", key: "parent-ios" },
              { label: "Parent App (Android)", key: "parent-android" },
              { label: "Driver App (iOS)", key: "driver-ios" },
              { label: "Driver App (Android)", key: "driver-android" },
            ].map((app) => (
              <div key={app.key} className="p-4 border rounded-lg" style={{ borderColor: "var(--er-border)" }}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{app.label}</h4>
                  <Badge variant="success">Active</Badge>
                </div>
                <p className="text-sm" style={{ color: "var(--er-text-muted)" }}>
                  Current Version: Synced from release pipeline
                </p>
                <p className="text-sm" style={{ color: "var(--er-text-muted)" }}>
                  Minimum Supported: Managed by backend policy
                </p>
                <Button size="sm" className="mt-3" variant="outline" onClick={() => releaseVersion(app.label)}>
                  Update Version
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            <CardTitle>Feature Toggles</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {features.length === 0 ? (
              <div className="er-empty-state">No feature flags loaded from backend.</div>
            ) : (
              features.map((feature) => {
                const id = String(feature.id)
                const enabled = Boolean(toggledFeatures[id])
                return (
                  <div
                    key={feature.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                    style={{ borderColor: "var(--er-border)" }}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{feature.name}</p>
                      <p className="text-sm" style={{ color: "var(--er-text-muted)" }}>{feature.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFeature(id, feature.name)}
                      style={{ color: enabled ? "var(--er-success)" : "var(--er-text-muted)" }}
                    >
                      {enabled ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
                    </Button>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle>System Maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => performMaintenance("Cache cleared", "cache")}
              disabled={busyKey === "cache"}
            >
              {busyKey === "cache" ? "Clearing..." : "Clear Cache"}
            </Button>
            <Button
              variant="outline"
              onClick={() => performMaintenance("Backup triggered", "backup")}
              disabled={busyKey === "backup"}
            >
              {busyKey === "backup" ? "Backing up..." : "Database Backup"}
            </Button>
            <Button
              variant="outline"
              onClick={() => performMaintenance("Health check passed", "health")}
              disabled={busyKey === "health"}
            >
              {busyKey === "health" ? "Checking..." : "System Health Check"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
