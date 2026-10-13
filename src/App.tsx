import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { BookOpen, Users, FolderTree, History, Library } from 'lucide-react'

export function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        {/* Header institucional */}
        <header className="bg-blue-900 text-white shadow-md border-b-4 border-amber-600">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-950 rounded-lg border border-blue-700">
                <Library className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Sistema de Gestión de Biblioteca</h1>
                <p className="text-xs text-blue-200">Universidad Nacional del Centro del Perú · FIS</p>
              </div>
            </div>

            {/* Navegación Principal */}
            <nav className="mt-4 sm:mt-0 flex flex-wrap gap-2">
              <Link
                to="/"
                className="px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-800 transition flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                Catálogo
              </Link>
              <Link
                to="/admin/libros"
                className="px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-800 transition flex items-center gap-1.5"
              >
                <FolderTree className="w-4 h-4 text-amber-400" />
                Libros y Categorías
              </Link>
              <Link
                to="/admin/usuarios"
                className="px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-800 transition flex items-center gap-1.5"
              >
                <Users className="w-4 h-4 text-amber-400" />
                Usuarios
              </Link>
              <Link
                to="/historial"
                className="px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-800 transition flex items-center gap-1.5"
              >
                <History className="w-4 h-4 text-amber-400" />
                Historial
              </Link>
            </nav>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6">
          <Routes>
            <Route
              path="/"
              element={
                <div className="card-solid p-6">
                  <h2 className="text-2xl font-bold text-blue-950 mb-2">Bienvenido a la Biblioteca Central UNCP</h2>
                  <p className="text-slate-600 mb-6">
                    Proyecto inicial base configurado con React, Vite, TypeScript y Tailwind CSS.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border border-slate-200 rounded-lg bg-white">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">Módulo 1</span>
                      <h3 className="font-semibold text-slate-800 mt-2">Libros y Categorías</h3>
                      <p className="text-xs text-slate-500 mt-1">Gestión administrativa de inventario y clasificación.</p>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-lg bg-white">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Módulo 2</span>
                      <h3 className="font-semibold text-slate-800 mt-2">Gestión de Usuarios</h3>
                      <p className="text-xs text-slate-500 mt-1">Registro de Estudiantes y Docentes sin códigos duplicados.</p>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-lg bg-white">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Módulos 3, 4 y 5</span>
                      <h3 className="font-semibold text-slate-800 mt-2">Préstamos y Comprobantes</h3>
                      <p className="text-xs text-slate-500 mt-1">Flujo de solicitud, PDF descargable e historial reactivo.</p>
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="/admin/libros" element={<div className="card-solid p-6"><h2 className="text-xl font-bold">Gestión de Libros y Categorías</h2></div>} />
            <Route path="/admin/usuarios" element={<div className="card-solid p-6"><h2 className="text-xl font-bold">Gestión de Usuarios</h2></div>} />
            <Route path="/historial" element={<div className="card-solid p-6"><h2 className="text-xl font-bold">Historial de Préstamos</h2></div>} />
          </Routes>
        </main>

        {/* Footer institucional */}
        <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500">
          Evaluación Parcial · Desarrollo de Aplicaciones Web · Dr. Jaime Suasnábar Terrel
        </footer>
      </div>
    </Router>
  )
}

export default App
