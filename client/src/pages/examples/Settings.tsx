import Settings from '../Settings'
import { ThemeProvider } from 'next-themes'

export default function SettingsExample() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <Settings />
    </ThemeProvider>
  )
}