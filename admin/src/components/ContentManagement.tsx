import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { FileText, HelpCircle, Shield, Save } from "lucide-react"

export function ContentManagement() {
  const [termsContent, setTermsContent] = useState(
    `Terms and Conditions\n\nLast Updated: December 14, 2024\n\n1. Acceptance of Terms\nBy accessing and using this bus tracking service, you accept and agree to be bound by the terms and provision of this agreement.\n\n2. Use License\nPermission is granted to temporarily use this service for personal, non-commercial purposes only.\n\n3. User Responsibilities\n- Maintain accurate account information\n- Protect your login credentials\n- Notify us of any unauthorized access\n\n4. Payment Terms\n- Monthly/weekly subscriptions are due in advance\n- Refunds are processed according to our refund policy\n- Late payments may result in service suspension`
  )

  const [privacyContent, setPrivacyContent] = useState(
    `Privacy Policy\n\nLast Updated: December 14, 2024\n\n1. Information We Collect\nWe collect information that you provide directly to us, including:\n- Name and contact information\n- Payment information\n- Location data (for tracking purposes)\n- Device information\n\n2. How We Use Your Information\n- To provide and maintain our service\n- To process payments\n- To send notifications and updates\n- To improve our service\n\n3. Information Sharing\nWe do not sell your personal information. We may share your information with:\n- Assigned drivers (limited information)\n- Payment processors\n- Legal authorities when required by law\n\n4. Data Security\nWe implement appropriate security measures to protect your personal information.`
  )

  const faqs = [
    { id: 1, question: "How do I register as a parent?", answer: "Download our app from the App Store or Google Play, then follow the registration process.", category: "Getting Started" },
    { id: 2, question: "How do I track my child's bus?", answer: "Open the app and view the real-time location of your assigned bus on the map.", category: "Tracking" },
    { id: 3, question: "What payment methods are accepted?", answer: "We accept credit cards, debit cards, and digital wallets through our secure payment gateway.", category: "Payments" },
    { id: 4, question: "How do I report a problem?", answer: "Use the 'Report Issue' feature in the app or contact our support team directly.", category: "Support" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2>Content & Policy Management</h2>
        <p className="text-gray-500 mt-1">Manage legal documents and help content</p>
      </div>

      <Tabs defaultValue="terms">
        <TabsList>
          <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="faq">FAQ Management</TabsTrigger>
          <TabsTrigger value="help">Help Content</TabsTrigger>
        </TabsList>

        {/* Terms & Conditions */}
        <TabsContent value="terms" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  <CardTitle>Terms & Conditions Editor</CardTitle>
                </div>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Version Information</label>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>Current Version: 2.1</span>
                    <span>Last Updated: December 14, 2024</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={termsContent}
                    onChange={(e) => setTermsContent(e.target.value)}
                    rows={20}
                    className="mt-2 font-mono text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button>Publish</Button>
                  <Button variant="outline">Preview</Button>
                  <Button variant="outline">View History</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Policy */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  <CardTitle>Privacy Policy Editor</CardTitle>
                </div>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Version Information</label>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>Current Version: 3.0</span>
                    <span>Last Updated: December 14, 2024</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={privacyContent}
                    onChange={(e) => setPrivacyContent(e.target.value)}
                    rows={20}
                    className="mt-2 font-mono text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button>Publish</Button>
                  <Button variant="outline">Preview</Button>
                  <Button variant="outline">View History</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Management */}
        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  <CardTitle>FAQ Management</CardTitle>
                </div>
                <Button>Add New FAQ</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{faq.question}</p>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {faq.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{faq.answer}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="ghost">Edit</Button>
                        <Button size="sm" variant="ghost">Delete</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Help Content */}
        <TabsContent value="help" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Help new users understand how to use the platform
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Edit Parent Onboarding
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Edit Driver Onboarding
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Edit Quick Start Guide
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tutorial Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Manage video tutorials and guides
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Upload New Video
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Manage Video Library
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Video Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Create and manage help articles
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Create New Article
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    View All Articles
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Article Categories
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Update support contact details
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Edit Contact Info
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Support Hours
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Emergency Contacts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
