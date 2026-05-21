import { useState, type FormEvent } from "react"
import { Eye, EyeOff, Loader2, Navigation, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeSwitch } from "./ThemeSwitch"

interface LoginScreenProps {
  onSubmit: (email: string, password: string) => Promise<void>
  defaultEmail?: string
  defaultPassword?: string
  externalError?: string
}

export function LoginScreen({
  onSubmit,
  defaultEmail = "admin@eduride.com",
  defaultPassword = "Admin@123",
  externalError,
}: LoginScreenProps) {
  const [email, setEmail] = useState(defaultEmail)
  const [password, setPassword] = useState(defaultPassword)
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (submitting) return

    setError("")
    setSubmitting(true)
    try {
      await onSubmit(email.trim(), password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const fillDemo = () => {
    setEmail(defaultEmail)
    setPassword(defaultPassword)
  }

  return (
    <div className="admin-login">
      <div className="admin-login-grid">
        {/* Marketing panel */}
        <aside className="admin-login-hero">
          <div className="admin-login-hero-glow" aria-hidden />
          <div className="admin-login-hero-inner">
            <div className="admin-login-brand">
              <div className="admin-login-brand-mark">
                <Navigation className="h-5 w-5" />
              </div>
              <div>
                <p className="admin-login-brand-name">Edu-Ride</p>
                <p className="admin-login-brand-sub">Operations Console</p>
              </div>
            </div>

            <div className="admin-login-hero-copy">
              <span className="admin-login-tag">
                <Sparkles className="h-3.5 w-3.5" /> Premium dashboard
              </span>
              <h1 className="admin-login-title">
                Manage every ride,<br />
                from morning bell to dusk.
              </h1>
              <p className="admin-login-subtitle">
                Real-time tracking, driver workflows, parent communication and finance — all
                from a single, beautifully crafted control room.
              </p>
            </div>

            <ul className="admin-login-feature-list">
              <li>
                <ShieldCheck className="h-4 w-4" />
                <span>Role-based access &amp; audit trails</span>
              </li>
              <li>
                <ShieldCheck className="h-4 w-4" />
                <span>Live driver, route &amp; trip monitoring</span>
              </li>
              <li>
                <ShieldCheck className="h-4 w-4" />
                <span>Payments, ratings and complaints in one place</span>
              </li>
            </ul>

            <p className="admin-login-footer-note">
              © {new Date().getFullYear()} Edu-Ride — Crafted for school transport teams.
            </p>
          </div>
        </aside>

        {/* Form panel */}
        <section className="admin-login-form-wrap">
          <div className="admin-login-toolbar">
            <ThemeSwitch />
          </div>

          <form className="admin-login-card" onSubmit={submit}>
            <header className="admin-login-card-header">
              <h2 className="admin-login-card-title">Welcome back</h2>
              <p className="admin-login-card-sub">Sign in to the Edu-Ride admin console</p>
            </header>

            <div className="admin-login-field">
              <label htmlFor="admin-email">Email address</label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@eduride.com"
              />
            </div>

            <div className="admin-login-field">
              <label htmlFor="admin-password">Password</label>
              <div className="admin-login-password">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="admin-login-password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="admin-login-row">
              <label className="admin-login-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                />
                <span>Keep me signed in</span>
              </label>
              <button type="button" className="admin-login-link" onClick={fillDemo}>
                Use demo credentials
              </button>
            </div>

            {(error || externalError) && (
              <div className="admin-login-error" role="alert">
                {error || externalError}
              </div>
            )}

            <Button type="submit" className="admin-login-submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>Sign in to dashboard</>
              )}
            </Button>

            <p className="admin-login-hint">
              Protected by your organization. Need access? Ask a super-admin to invite you.
            </p>
          </form>
        </section>
      </div>
    </div>
  )
}
