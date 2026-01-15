import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select } from "./ui/select"
import { Badge } from "./ui/badge"
import { Settings, Globe, CreditCard, Percent, Smartphone, ToggleLeft, ToggleRight } from "lucide-react"

const features = [
  { id: 1, name: "Real-time Tracking", description: "Enable GPS tracking for buses", enabled: true },
  { id: 2, name: "Payment Reminders", description: "Automated payment reminder notifications", enabled: true },
  { id: 3, name: "Emergency Alerts", description: "Emergency broadcast system", enabled: true },
  { id: 4, name: "Driver Chat", description: "In-app messaging between parents and drivers", enabled: false },
  { id: 5, name: "Route Optimization", description: "AI-powered route suggestions", enabled: true },
  { id: 6, name: "Maintenance Alerts", description: "Vehicle maintenance reminders", enabled: false },
]

export function SystemSettings() {
  const [toggledFeatures, setToggledFeatures] = useState(
    features.reduce((acc, f) => ({ ...acc, [f.id]: f.enabled }), {})
  )

  const toggleFeature = (id: number) => {
    setToggledFeatures(prev => ({ ...prev, [id]: !prev[id as keyof typeof prev] }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2>System Configuration & Settings</h2>
        <p className="text-gray-500 mt-1">Manage platform settings and configurations</p>
      </div>

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
              <Select className="mt-1">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Timezone</label>
              <Select className="mt-1">
                <option value="est">EST (UTC-5)</option>
                <option value="cst">CST (UTC-6)</option>
                <option value="mst">MST (UTC-7)</option>
                <option value="pst">PST (UTC-8)</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Date Format</label>
              <Select className="mt-1">
                <option value="mm-dd-yyyy">MM/DD/YYYY</option>
                <option value="dd-mm-yyyy">DD/MM/YYYY</option>
                <option value="yyyy-mm-dd">YYYY-MM-DD</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Currency</label>
              <Select className="mt-1">
                <option value="usd">USD ($)</option>
                <option value="eur">EUR (€)</option>
                <option value="gbp">GBP (£)</option>
              </Select>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button>Save Platform Settings</Button>
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
            <Select className="mt-1">
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="square">Square</option>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">API Key</label>
              <Input type="password" className="mt-1" placeholder="sk_test_..." />
            </div>
            <div>
              <label className="text-sm font-medium">Secret Key</label>
              <Input type="password" className="mt-1" placeholder="Enter secret key..." />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Webhook URL</label>
            <Input className="mt-1" placeholder="https://yourdomain.com/webhook" />
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-600 rounded-full mr-2"></div>
              <span className="text-sm font-medium">Payment Gateway Status: Connected</span>
            </div>
            <Button size="sm" variant="outline">Test Connection</Button>
          </div>
          <div className="flex justify-end">
            <Button>Update Payment Settings</Button>
          </div>
        </CardContent>
      </Card>

      {/* Commission Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Percent className="h-5 w-5 mr-2" />
            <CardTitle>Commission & Fees</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Platform Commission (%)</label>
              <Input type="number" className="mt-1" placeholder="5" defaultValue="5" />
              <p className="text-xs text-gray-500 mt-1">Percentage charged per transaction</p>
            </div>
            <div>
              <label className="text-sm font-medium">Driver Registration Fee ($)</label>
              <Input type="number" className="mt-1" placeholder="50" defaultValue="50" />
              <p className="text-xs text-gray-500 mt-1">One-time registration fee for drivers</p>
            </div>
            <div>
              <label className="text-sm font-medium">Monthly Subscription ($)</label>
              <Input type="number" className="mt-1" placeholder="250" defaultValue="250" />
              <p className="text-xs text-gray-500 mt-1">Standard monthly payment amount</p>
            </div>
            <div>
              <label className="text-sm font-medium">Weekly Subscription ($)</label>
              <Input type="number" className="mt-1" placeholder="65" defaultValue="65" />
              <p className="text-xs text-gray-500 mt-1">Standard weekly payment amount</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Update Commission Settings</Button>
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
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Parent App (iOS)</h4>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-sm text-gray-500">Current Version: 2.3.1</p>
              <p className="text-sm text-gray-500">Minimum Supported: 2.0.0</p>
              <Button size="sm" className="mt-3" variant="outline">Update Version</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Parent App (Android)</h4>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-sm text-gray-500">Current Version: 2.3.0</p>
              <p className="text-sm text-gray-500">Minimum Supported: 2.0.0</p>
              <Button size="sm" className="mt-3" variant="outline">Update Version</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Driver App (iOS)</h4>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-sm text-gray-500">Current Version: 1.8.5</p>
              <p className="text-sm text-gray-500">Minimum Supported: 1.5.0</p>
              <Button size="sm" className="mt-3" variant="outline">Update Version</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Driver App (Android)</h4>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-sm text-gray-500">Current Version: 1.8.4</p>
              <p className="text-sm text-gray-500">Minimum Supported: 1.5.0</p>
              <Button size="sm" className="mt-3" variant="outline">Update Version</Button>
            </div>
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
            {features.map((feature) => (
              <div key={feature.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{feature.name}</p>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFeature(feature.id)}
                  className={toggledFeatures[feature.id as keyof typeof toggledFeatures] ? 'text-green-600' : 'text-gray-400'}
                >
                  {toggledFeatures[feature.id as keyof typeof toggledFeatures] ? (
                    <ToggleRight className="h-8 w-8" />
                  ) : (
                    <ToggleLeft className="h-8 w-8" />
                  )}
                </Button>
              </div>
            ))}
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
            <Button variant="outline">Clear Cache</Button>
            <Button variant="outline">Database Backup</Button>
            <Button variant="outline">System Health Check</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
