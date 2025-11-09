import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { createId } from '../utils/id'

type Toast = {
  id: string
  message: string
}

type ToastContextValue = {
  showToast: (message: string, durationMs?: number) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  useEffect(() => {
    const activeTimers = timers.current
    return () => {
      Object.values(activeTimers).forEach((timer) => clearTimeout(timer))
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
    const timer = timers.current[id]
    if (timer) {
      clearTimeout(timer)
      delete timers.current[id]
    }
  }, [])

  const showToast = useCallback(
    (message: string, durationMs = 3200) => {
      const id = createId()
      setToasts((prev) => [...prev, { id, message }])
      timers.current[id] = setTimeout(() => removeToast(id), durationMs)
    },
    [removeToast],
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed top-5 right-5 z-50 flex max-w-md flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto rounded-lg bg-slate-900/90 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-slate-900/20"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return ctx
}

