import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { MockDataProvider } from './context/MockDataContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { ToastProvider } from './components/ToastProvider.tsx'
import './index.css'
import App from './App.tsx'

document.documentElement.lang = 'en'
document.documentElement.dir = 'ltr'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <MockDataProvider>
            <App />
          </MockDataProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
