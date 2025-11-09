import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  getDashboardDataByRole,
  getUserByToken,
  linkUserProfile,
  loginUser,
  registerUser,
  type DashboardSources,
  type LoginInput,
  type RegisterUserInput,
  type UserRecord,
  type UserRole,
} from '../mock/mockDb'

export type AuthUser = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: UserRole
  profileId?: string
}

type AuthState = {
  user: AuthUser | null
  token: string | null
  status: 'idle' | 'loading'
}

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  status: 'idle' | 'loading'
  isAuthenticated: boolean
  login: (payload: LoginInput) => Promise<AuthUser>
  register: (payload: RegisterUserInput) => Promise<UserRecord>
  logout: () => void
  attachProfile: (profileId: string) => void
  getDashboard: (sources: DashboardSources) => Promise<unknown>
}

const AUTH_STORAGE_KEY = 'mskn-cloud:auth'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const toAuthUser = (user: UserRecord): AuthUser => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  profileId: user.profileId,
})

const mapRoleToPath = (role: UserRole) => {
  switch (role) {
    case 'manager':
      return '/manager'
    case 'owner':
      return '/owner'
    case 'tenant':
    default:
      return '/tenant'
  }
}

const readStoredState = (): AuthState => {
  if (typeof window === 'undefined') {
    return { user: null, token: null, status: 'idle' }
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) {
      return { user: null, token: null, status: 'idle' }
    }

    const parsed = JSON.parse(raw) as { token: string }
    const existingUser = getUserByToken(parsed.token)
    if (!existingUser) {
      return { user: null, token: null, status: 'idle' }
    }

    return {
      user: toAuthUser(existingUser),
      token: parsed.token,
      status: 'idle',
    }
  } catch (error) {
    console.warn('فشل استرجاع جلسة المستخدم التجريبية', error)
    return { user: null, token: null, status: 'idle' }
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => readStoredState())

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (state.user && state.token) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token: state.token }))
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [state.user, state.token])

  const register = useCallback(async (payload: RegisterUserInput) => {
    const result = await registerUser(payload)
    return result.user
  }, [])

  const login = useCallback(async (payload: LoginInput) => {
    setState((prev) => ({ ...prev, status: 'loading' }))
    try {
      const result = await loginUser(payload)
      const authUser = toAuthUser(result.user)
      setState({
        user: authUser,
        token: result.token,
        status: 'idle',
      })
      return authUser
    } catch (error) {
      setState({ user: null, token: null, status: 'idle' })
      throw error
    }
  }, [])

  const logout = useCallback(() => {
    setState({ user: null, token: null, status: 'idle' })
  }, [])

  const attachProfile = useCallback((profileId: string) => {
    setState((prev) => {
      if (!prev.user) {
        return prev
      }
      linkUserProfile(prev.user.id, profileId)
      return {
        ...prev,
        user: {
          ...prev.user,
          profileId,
        },
      }
    })
  }, [])

  const getDashboard = useCallback(
    async (sources: DashboardSources) => {
      if (!state.user) {
        return null
      }
      return getDashboardDataByRole(state.user.role, state.user.profileId, sources)
    },
    [state.user],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      token: state.token,
      status: state.status,
      isAuthenticated: Boolean(state.user && state.token),
      login,
      logout,
      register,
      attachProfile,
      getDashboard,
    }),
    [attachProfile, getDashboard, login, logout, register, state.status, state.token, state.user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth يجب أن يُستخدم داخل AuthProvider')
  }

  return context
}

// eslint-disable-next-line react-refresh/only-export-components
export const getRoleDashboardPath = (role: UserRole) => mapRoleToPath(role)

