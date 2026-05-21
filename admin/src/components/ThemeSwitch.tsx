import { Moon, Sun } from "lucide-react"
import { useTheme } from "../lib/theme"

interface ThemeSwitchProps {
  className?: string
  labelled?: boolean
}

export function ThemeSwitch({ className = "", labelled = false }: ThemeSwitchProps) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className={`admin-theme-switch ${isDark ? "is-dark" : "is-light"} ${className}`}
    >
      <span className="admin-theme-switch-track">
        <span className="admin-theme-switch-thumb">
          {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
        </span>
      </span>
      {labelled ? (
        <span className="admin-theme-switch-label">{isDark ? "Dark" : "Light"}</span>
      ) : null}
    </button>
  )
}
