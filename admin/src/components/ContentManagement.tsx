import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { FileText, HelpCircle, Plus, Save, Shield, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"
import { fetchAdminContent } from "../lib/adminContent"

type Faq = { id: string; question: string; answer: string; category: string }
type DraftKey = "terms" | "privacy"

const DRAFT_STORAGE_KEY = "eduride-admin-content-drafts"
const FAQ_STORAGE_KEY = "eduride-admin-faqs"

function readDrafts(): Record<DraftKey, Array<{ savedAt: string; content: string }>> {
  if (typeof window === "undefined") {
    return { terms: [], privacy: [] }
  }
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return { terms: [], privacy: [] }
}

function persistDrafts(drafts: Record<DraftKey, Array<{ savedAt: string; content: string }>>) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts))
}

function persistFaqs(faqs: Faq[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(faqs))
}

function readPersistedFaqs(): Faq[] | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(FAQ_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Faq[]) : null
  } catch {
    return null
  }
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}

export function ContentManagement() {
  const [termsContent, setTermsContent] = useState("")
  const [privacyContent, setPrivacyContent] = useState("")
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [drafts, setDrafts] = useState(readDrafts)
  const [previewKind, setPreviewKind] = useState<DraftKey | null>(null)
  const [historyKind, setHistoryKind] = useState<DraftKey | null>(null)
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null)
  const [faqDialogOpen, setFaqDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminContent()
      .then((payload) => {
        setTermsContent(payload.content?.termsContent || "")
        setPrivacyContent(payload.content?.privacyContent || "")
        const persistedFaqs = readPersistedFaqs()
        setFaqs(persistedFaqs ?? payload.content?.faqs ?? [])
      })
      .catch(() => {
        setTermsContent("")
        setPrivacyContent("")
        setFaqs(readPersistedFaqs() ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  const previewContent = previewKind === "terms" ? termsContent : privacyContent

  const sortedFaqs = useMemo(() => [...faqs].sort((a, b) => a.question.localeCompare(b.question)), [faqs])

  const saveDraft = (kind: DraftKey) => {
    const content = kind === "terms" ? termsContent : privacyContent
    if (!content.trim()) {
      toast.message("Nothing to save", { description: "Document is empty." })
      return
    }
    const next = { ...drafts, [kind]: [{ savedAt: new Date().toISOString(), content }, ...drafts[kind]].slice(0, 8) }
    setDrafts(next)
    persistDrafts(next)
    toast.success("Draft saved", { description: `Stored ${kind === "terms" ? "Terms" : "Privacy"} draft locally.` })
  }

  const publishDocument = (kind: DraftKey) => {
    saveDraft(kind)
    toast.success("Published", {
      description: `${kind === "terms" ? "Terms" : "Privacy"} document marked for publish (backend sync pending).`,
    })
  }

  const restoreDraft = (kind: DraftKey, content: string) => {
    if (kind === "terms") setTermsContent(content)
    else setPrivacyContent(content)
    setHistoryKind(null)
    toast.message("Draft restored", { description: "Editor updated with previous version." })
  }

  const openFaqEditor = (faq?: Faq) => {
    setEditingFaq(
      faq
        ? { ...faq }
        : { id: createId(), question: "", answer: "", category: "General" }
    )
    setFaqDialogOpen(true)
  }

  const saveFaq = () => {
    if (!editingFaq) return
    if (!editingFaq.question.trim() || !editingFaq.answer.trim()) {
      toast.error("Missing fields", { description: "Question and answer are required." })
      return
    }
    const existing = faqs.some((item) => item.id === editingFaq.id)
    const next = existing
      ? faqs.map((item) => (item.id === editingFaq.id ? editingFaq : item))
      : [...faqs, editingFaq]
    setFaqs(next)
    persistFaqs(next)
    setFaqDialogOpen(false)
    setEditingFaq(null)
    toast.success(existing ? "FAQ updated" : "FAQ added", {
      description: `Saved “${editingFaq.question.slice(0, 60)}”.`,
    })
  }

  const deleteFaq = (faq: Faq) => {
    const next = faqs.filter((item) => item.id !== faq.id)
    setFaqs(next)
    persistFaqs(next)
    toast.success("FAQ removed")
  }

  const handleHelpAction = (label: string) => {
    toast.message(label, {
      description: "Editor will open when content service is connected.",
    })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="terms">
        <TabsList>
          <TabsTrigger value="terms">Terms &amp; Conditions</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="faq">FAQ Management</TabsTrigger>
          <TabsTrigger value="help">Help Content</TabsTrigger>
        </TabsList>

        {/* Terms & Conditions */}
        <TabsContent value="terms" className="space-y-4">
          <Card className="animate-fade-up">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  <CardTitle>Terms &amp; Conditions Editor</CardTitle>
                </div>
                <Button onClick={() => saveDraft("terms")} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Version Information</label>
                  <div className="flex gap-4 mt-2 text-sm" style={{ color: "var(--er-text-muted)" }}>
                    <span>Saved drafts: {drafts.terms.length}</span>
                    <span>
                      Last saved:{" "}
                      {drafts.terms[0] ? new Date(drafts.terms[0].savedAt).toLocaleString() : "never"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={termsContent}
                    onChange={(event) => setTermsContent(event.target.value)}
                    rows={20}
                    className="mt-2 font-mono text-sm"
                    placeholder="Markdown or plain text..."
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => publishDocument("terms")} disabled={loading}>
                    Publish
                  </Button>
                  <Button variant="outline" onClick={() => setPreviewKind("terms")} disabled={!termsContent}>
                    Preview
                  </Button>
                  <Button variant="outline" onClick={() => setHistoryKind("terms")}>
                    View History
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Policy */}
        <TabsContent value="privacy" className="space-y-4">
          <Card className="animate-fade-up">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  <CardTitle>Privacy Policy Editor</CardTitle>
                </div>
                <Button onClick={() => saveDraft("privacy")} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Version Information</label>
                  <div className="flex gap-4 mt-2 text-sm" style={{ color: "var(--er-text-muted)" }}>
                    <span>Saved drafts: {drafts.privacy.length}</span>
                    <span>
                      Last saved:{" "}
                      {drafts.privacy[0] ? new Date(drafts.privacy[0].savedAt).toLocaleString() : "never"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={privacyContent}
                    onChange={(event) => setPrivacyContent(event.target.value)}
                    rows={20}
                    className="mt-2 font-mono text-sm"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => publishDocument("privacy")} disabled={loading}>
                    Publish
                  </Button>
                  <Button variant="outline" onClick={() => setPreviewKind("privacy")} disabled={!privacyContent}>
                    Preview
                  </Button>
                  <Button variant="outline" onClick={() => setHistoryKind("privacy")}>
                    View History
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Management */}
        <TabsContent value="faq" className="space-y-4">
          <Card className="animate-fade-up">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  <CardTitle>FAQ Management</CardTitle>
                </div>
                <Button onClick={() => openFaqEditor()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New FAQ
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedFaqs.length === 0 ? (
                  <div className="er-empty-state">
                    <p>No FAQs yet. Click <b>Add New FAQ</b> to create one.</p>
                  </div>
                ) : (
                  sortedFaqs.map((faq) => (
                    <div key={faq.id} className="p-4 border rounded-lg er-hover-lift" style={{ borderColor: "var(--er-border)" }}>
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="font-medium">{faq.question}</p>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ background: "var(--er-accent-soft)", color: "var(--er-accent)" }}
                            >
                              {faq.category}
                            </span>
                          </div>
                          <p className="text-sm" style={{ color: "var(--er-text-muted)" }}>
                            {faq.answer}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="ghost" onClick={() => openFaqEditor(faq)}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteFaq(faq)}
                            style={{ color: "var(--er-danger)" }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Help Content */}
        <TabsContent value="help" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="animate-fade-up er-hover-lift">
              <CardHeader>
                <CardTitle>Getting Started Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4" style={{ color: "var(--er-text-muted)" }}>
                  Help new users understand how to use the platform
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleHelpAction("Edit Parent Onboarding")}>
                    Edit Parent Onboarding
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleHelpAction("Edit Driver Onboarding")}>
                    Edit Driver Onboarding
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleHelpAction("Edit Quick Start Guide")}>
                    Edit Quick Start Guide
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-up er-hover-lift">
              <CardHeader>
                <CardTitle>Tutorial Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4" style={{ color: "var(--er-text-muted)" }}>
                  Manage video tutorials and guides
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleHelpAction("Upload New Video")}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Video
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleHelpAction("Manage Video Library")}>
                    Manage Video Library
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleHelpAction("Video Analytics")}>
                    Video Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-up er-hover-lift">
              <CardHeader>
                <CardTitle>Support Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4" style={{ color: "var(--er-text-muted)" }}>
                  Create and manage help articles
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleHelpAction("Create New Article")}>
                    Create New Article
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleHelpAction("View All Articles")}>
                    View All Articles
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleHelpAction("Article Categories")}>
                    Article Categories
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-up er-hover-lift">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4" style={{ color: "var(--er-text-muted)" }}>
                  Update support contact details
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleHelpAction("Edit Contact Info")}>
                    Edit Contact Info
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleHelpAction("Support Hours")}>
                    Support Hours
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleHelpAction("Emergency Contacts")}>
                    Emergency Contacts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={Boolean(previewKind)} onOpenChange={(open) => !open && setPreviewKind(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewKind === "terms" ? "Terms preview" : "Privacy preview"}</DialogTitle>
            <DialogDescription>How this content will appear to end users.</DialogDescription>
          </DialogHeader>
          <div
            className="rounded-lg border p-4 max-h-[55vh] overflow-y-auto whitespace-pre-wrap text-sm"
            style={{ background: "var(--er-surface-muted)", borderColor: "var(--er-border)", color: "var(--er-text)" }}
          >
            {previewContent || "Document is empty."}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewKind(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(historyKind)} onOpenChange={(open) => !open && setHistoryKind(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Draft history</DialogTitle>
            <DialogDescription>Restore an earlier version stored locally.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-[55vh] overflow-y-auto">
            {historyKind && drafts[historyKind].length === 0 ? (
              <p className="text-sm" style={{ color: "var(--er-text-muted)" }}>
                No drafts saved yet. Save a draft to see it here.
              </p>
            ) : (
              historyKind &&
              drafts[historyKind].map((entry, idx) => (
                <div
                  key={`${entry.savedAt}-${idx}`}
                  className="flex items-start justify-between gap-3 p-3 rounded-lg border"
                  style={{ borderColor: "var(--er-border)" }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {new Date(entry.savedAt).toLocaleString()}
                    </p>
                    <p
                      className="text-xs mt-1 truncate"
                      style={{ color: "var(--er-text-muted)" }}
                    >
                      {entry.content.slice(0, 80)}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => restoreDraft(historyKind, entry.content)}>
                    Restore
                  </Button>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryKind(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={faqDialogOpen} onOpenChange={setFaqDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFaq && faqs.some((f) => f.id === editingFaq.id) ? "Edit FAQ" : "New FAQ"}</DialogTitle>
            <DialogDescription>Saved locally — sync with backend when content API is wired.</DialogDescription>
          </DialogHeader>
          {editingFaq ? (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Question</label>
                <Input
                  value={editingFaq.question}
                  onChange={(event) =>
                    setEditingFaq((prev) => (prev ? { ...prev, question: event.target.value } : prev))
                  }
                  placeholder="e.g. How do I reset my password?"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={editingFaq.category}
                  onChange={(event) =>
                    setEditingFaq((prev) => (prev ? { ...prev, category: event.target.value } : prev))
                  }
                  placeholder="General"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Answer</label>
                <Textarea
                  rows={5}
                  value={editingFaq.answer}
                  onChange={(event) =>
                    setEditingFaq((prev) => (prev ? { ...prev, answer: event.target.value } : prev))
                  }
                  placeholder="Write a clear, concise answer..."
                />
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setFaqDialogOpen(false)}>
              Cancel
            </Button>
            {editingFaq && faqs.some((f) => f.id === editingFaq.id) ? (
              <Button
                variant="destructive"
                onClick={() => {
                  deleteFaq(editingFaq)
                  setFaqDialogOpen(false)
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            ) : null}
            <Button onClick={saveFaq}>Save FAQ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
