import { NavLink } from 'react-router-dom'
import { BookOpen, History, Library, Users } from 'lucide-react'

const navigationItems = [
  { to: '/', label: 'Catálogo', icon: BookOpen, end: true },
  { to: '/admin/libros', label: 'Libros', icon: Library },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { to: '/historial', label: 'Préstamos', icon: History },
]

export const Navbar = () => (
  <header className="bg-white border-b border-gray-200 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4">
        <NavLink to="/" className="flex items-center gap-3 text-gray-950">
          <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-900 text-white">
            <BookOpen className="w-5 h-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block font-bold leading-tight">Biblioteca Central</span>
            <span className="block text-xs text-gray-500">UNCP · Facultad de Ingeniería de Sistemas</span>
          </span>
        </NavLink>

        <nav aria-label="Navegación principal" className="flex items-center gap-1 overflow-x-auto">
          {navigationItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-50 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  </header>
)
