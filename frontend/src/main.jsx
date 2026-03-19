import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './auth/AuthProvider.jsx'
import { BirdsProvider } from './contexts/BirdsProvider.jsx'
import { SearchProvider } from './contexts/SearchProvider.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* Conocer si un usuario está logueado o no */}
      <BirdsProvider> {/* Guardar avistamientos */}
        <SearchProvider> {/* Servicio de búsqueda */}
          <App />
        </SearchProvider>
      </BirdsProvider>
    </AuthProvider>
  </StrictMode>
)
