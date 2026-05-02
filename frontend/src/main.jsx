import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './auth/authProvider.jsx'
import { BirdsProvider } from './contexts/BirdsProvider.jsx'
import { SearchUIProvider } from './contexts/SearchUIProvider.jsx'
import './index.css'
import App from './App.jsx'
import './i18n';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* Conocer si un usuario está logueado o no */}
      <BirdsProvider> {/* Guardar y filtrar avistamientos */}
        <SearchUIProvider> {/* Tipo de búsqueda */}
          <App />
        </SearchUIProvider>
      </BirdsProvider>
    </AuthProvider>
  </StrictMode>
)
