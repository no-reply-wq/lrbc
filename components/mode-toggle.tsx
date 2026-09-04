"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Switch } from "@/components/ui/switch"

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Only render after mount to avoid SSR/client mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Sun className="h-4 w-4" />
        <Switch disabled aria-label="Toggle dark mode" />
        <Moon className="h-4 w-4" />
      </div>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4" />

      <Switch
        checked={isDark}
        onCheckedChange={(checked) => {
          setTheme(checked ? "dark" : "light")
        }}
        aria-label="Toggle dark mode"
      />

      <Moon className="h-4 w-4" />
    </div>
  )
}
