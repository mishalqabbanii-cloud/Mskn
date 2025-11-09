import { Navigate, Route, Routes } from 'react-router-dom'

import AppLayout from './components/layout/AppLayout'
import { getRoleDashboardPath, useAuth } from './context/AuthContext'
import ContractsPage from './pages/ContractsPage'
import MaintenanceRequestsPage from './pages/MaintenanceRequestsPage'
import OwnersPage from './pages/OwnersPage'
import PropertiesPage from './pages/PropertiesPage'
import TenantsPage from './pages/TenantsPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ManagerDashboardPage from './pages/dashboard/ManagerDashboardPage'
import OwnerDashboardPage from './pages/dashboard/OwnerDashboardPage'
import TenantDashboardPage from './pages/dashboard/TenantDashboardPage'
import SettingsPage from './pages/SettingsPage'
import ProtectedRoute from './routes/ProtectedRoute'
import RoleGuard from './routes/RoleGuard'

const HomeRedirect = () => {
  const { isAuthenticated } = useAuth()
  return <Navigate to={isAuthenticated ? '/dashboard' : '/auth/login'} replace />
}

const DashboardRedirect = () => {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  return <Navigate to={getRoleDashboardPath(user.role)} replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/auth">
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="dashboard" element={<DashboardRedirect />} />

          <Route element={<RoleGuard allowed={['manager']} />}>
            <Route path="manager" element={<ManagerDashboardPage />} />
          </Route>

          <Route element={<RoleGuard allowed={['owner']} />}>
            <Route path="owner" element={<OwnerDashboardPage />} />
          </Route>

          <Route element={<RoleGuard allowed={['tenant']} />}>
            <Route path="tenant" element={<TenantDashboardPage />} />
          </Route>

          <Route path="properties" element={<PropertiesPage />} />
          <Route path="tenants" element={<TenantsPage />} />
          <Route path="owners" element={<OwnersPage />} />
          <Route path="contracts" element={<ContractsPage />} />
          <Route path="maintenance" element={<MaintenanceRequestsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
