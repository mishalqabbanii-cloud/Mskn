import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

type ProtectedRouteProps = {
  redirectTo?: string
}

const ProtectedRoute = ({ redirectTo = '/auth/login' }: ProtectedRouteProps) => {
  const { isAuthenticated, status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        جاري التحقق من البيانات...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />
  }

  return <Outlet />
}

export default ProtectedRoute

