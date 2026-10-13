import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LibraryProvider } from './context/LibraryContext'
import { Navbar } from './components/layout/Navbar'
import { Catalog } from './pages/Catalog'
import { AdminBooks } from './pages/AdminBooks'
import { AdminUsers } from './pages/AdminUsers'
import { LoanHistory } from './pages/LoanHistory'

export function App() {
  return (
    <LibraryProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
          {/* Navegación y Cabecera Institucional UNCP */}
          <Navbar />

          {/* Área de Contenido Principal */}
          <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 md:p-8">
            <Routes>
              {/* Ruta Principal: Catálogo y Solicitud de Préstamos */}
              <Route path="/" element={<Catalog />} />

              {/* Módulo 1: Gestión de Categorías y Libros */}
              <Route path="/admin/libros" element={<AdminBooks />} />

              {/* Módulo 2: Gestión de Usuarios */}
              <Route path="/admin/usuarios" element={<AdminUsers />} />

              {/* Módulo 5: Historial de Préstamos y Devolución */}
              <Route path="/historial" element={<LoanHistory />} />

              {/* Ruta de fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Pie de Página Institucional */}
          <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
            <p className="font-semibold text-slate-700">
              Universidad Nacional del Centro del Perú · Facultad de Ingeniería de Sistemas
            </p>
            <p className="mt-0.5 text-slate-400">
              Evaluación Parcial de Desarrollo de Aplicaciones Web · Dr. Jaime Suasnábar Terrel · 2026
            </p>
          </footer>
        </div>
      </Router>
    </LibraryProvider>
  )
}

export default App
