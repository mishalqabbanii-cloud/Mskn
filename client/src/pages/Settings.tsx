import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RefreshCw, Download, Trash2 } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function Settings() {
  const handleResetDemoData = () => {
    if (confirm('Are you sure you want to reset all demo data? This will restore the original sample data and cannot be undone.')) {
      // todo: Implement reset functionality
      localStorage.clear()
      window.location.reload()
      console.log('Demo data reset')
    }
  }

  const handleExportData = () => {
    console.log('Export all data')
    // todo: Implement full data export
  }

  const handleClearLogs = () => {
    if (confirm('Clear all activity logs?')) {
      console.log('Cleared activity logs')
      // todo: Clear activity logs from localStorage
    }
  }

  return (
    <div className="space-y-6 p-6" data-testid="page-settings">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure system preferences and manage application data
        </p>
      </div>
      
      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Theme</h3>
              <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>
      
      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Version</h3>
              <Badge variant="outline">v1.0.0</Badge>
            </div>
            <div>
              <h3 className="font-medium">Environment</h3>
              <Badge variant="outline">Development</Badge>
            </div>
            <div>
              <h3 className="font-medium">Storage</h3>
              <p className="text-sm text-muted-foreground">LocalStorage</p>
            </div>
            <div>
              <h3 className="font-medium">Last Updated</h3>
              <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Export Data</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Download all system data as CSV files for backup or analysis
              </p>
              <Button onClick={handleExportData} variant="outline" data-testid="button-export-data">
                <Download className="h-4 w-4 mr-2" />
                Export All Data
              </Button>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">Clear Activity Logs</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Remove all activity log entries from the system
              </p>
              <Button onClick={handleClearLogs} variant="outline" data-testid="button-clear-logs">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Logs
              </Button>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2 text-destructive">Reset Demo Data</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Restore all sample data to initial state. This will delete all changes and cannot be undone.
              </p>
              <Button onClick={handleResetDemoData} variant="destructive" data-testid="button-reset-data">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Demo Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Help & Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Help & Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h3 className="font-medium">Admin System Guide</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive guide for using the admin system features
              </p>
            </div>
            <div>
              <h3 className="font-medium">Keyboard Shortcuts</h3>
              <p className="text-sm text-muted-foreground">
                Learn keyboard shortcuts to navigate the system efficiently
              </p>
            </div>
            <div>
              <h3 className="font-medium">Support</h3>
              <p className="text-sm text-muted-foreground">
                Contact support for technical assistance and feature requests
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}