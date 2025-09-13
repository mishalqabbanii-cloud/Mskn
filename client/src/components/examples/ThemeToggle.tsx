import { ThemeToggle } from '../ThemeToggle'
import { ThemeProvider } from 'next-themes'

export default function ThemeToggleExample() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="p-6 border rounded-md bg-card">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Theme</span>
          <ThemeToggle />
        </div>
        <p className="text-xs text-muted-foreground mt-2">Toggle between light and dark mode</p>
      </div>
    </ThemeProvider>
  )
}