import { Navigate, Outlet } from 'react-router-dom'

import { getRoleDashboardPath, useAuth } from '../context/AuthContext'
import type { UserRole } from '../mock/mockDb'

type RoleGuardProps = {
  allowed: UserRole[]
  fallbackPath?: string
}

const RoleGuard = ({ allowed, fallbackPath }: RoleGuardProps) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  if (!allowed.includes(user.role)) {
    const redirect = fallbackPath ?? getRoleDashboardPath(user.role)
    return <Navigate to={redirect} replace />
  }

  return <Outlet />
}

export default RoleGuard

