import React, { useState } from 'react'
import { useLibrary } from '../context/LibraryContext'
import type { User, UserType } from '../types'
import { Badge } from '../components/common/Badge'
import { Modal } from '../components/common/Modal'
import { UserPlus, Edit2, Trash2, Search, AlertCircle, CheckCircle, GraduationCap, Briefcase } from 'lucide-react'

export const AdminUsers: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useLibrary()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    codigoUniversitario: '',
    correo: '',
    tipo: 'Estudiante' as UserType,
  })

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'TODOS' | UserType>('TODOS')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const openNewUserModal = () => {
    setEditingUserId(null)
    setForm({
      nombres: '',
      apellidos: '',
      codigoUniversitario: '',
      correo: '',
      tipo: 'Estudiante',
    })
    setError(null)
    setIsModalOpen(true)
  }

  const openEditUserModal = (user: User) => {
    setEditingUserId(user.id)
    setForm({
      nombres: user.nombres,
      apellidos: user.apellidos,
      codigoUniversitario: user.codigoUniversitario,
      correo: user.correo,
      tipo: user.tipo,
    })
    setError(null)
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validaciones
    if (!form.nombres.trim() || !form.apellidos.trim()) {
      setError('Los nombres y apellidos son campos obligatorios.')
      return
    }
    if (!form.codigoUniversitario.trim()) {
      setError('El código universitario es obligatorio.')
      return
    }
    if (!form.correo.trim() || !form.correo.includes('@')) {
      setError('Ingrese un correo electrónico válido.')
      return
    }

    if (editingUserId) {
      const res = updateUser(editingUserId, form)
      if (!res.success) {
        setError(res.error || 'Error al actualizar usuario')
        return
      }
      setSuccess('Usuario actualizado con éxito')
    } else {
      const res = addUser(form)
      if (!res.success) {
        setError(res.error || 'Error al registrar usuario')
        return
      }
      setSuccess('Usuario registrado con éxito en el sistema')
    }

    setTimeout(() => setSuccess(null), 3000)
    setIsModalOpen(false)
  }

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Está seguro de eliminar al usuario "${name}"?`)) {
      const res = deleteUser(id)
      if (!res.success) {
        alert(res.error)
      }
    }
  }

  // Filtrado de usuarios
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.nombres.toLowerCase().includes(search.toLowerCase()) ||
      u.apellidos.toLowerCase().includes(search.toLowerCase()) ||
      u.codigoUniversitario.toLowerCase().includes(search.toLowerCase()) ||
      u.correo.toLowerCase().includes(search.toLowerCase())

    const matchesType = typeFilter === 'TODOS' || u.tipo === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-950">Módulo de Gestión de Usuarios</h2>
          <p className="text-sm text-gray-600">
            Registro y administración de estudiantes y docentes de la universidad.
          </p>
        </div>

        <button onClick={openNewUserModal} className="btn-primary text-xs py-2 self-start sm:self-auto">
          <UserPlus className="w-4 h-4 text-gray-400" />
          Nuevo Usuario
        </button>
      </div>

      {/* Alerta de éxito */}
      {success && (
        <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-md text-xs font-medium">
          <CheckCircle className="w-4 h-4 text-gray-700" />
          {success}
        </div>
      )}

      {/* Barra de Búsqueda y Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            className="input-solid pl-9 text-xs"
            placeholder="Buscar por nombres, código universitario o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <select
            className="input-solid text-xs"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'TODOS' | UserType)}
          >
            <option value="TODOS">Todos los tipos de usuario</option>
            <option value="Estudiante">Solo Estudiantes</option>
            <option value="Docente">Solo Docentes</option>
          </select>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="card-solid overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="p-3">Código</th>
                <th className="p-3">Nombres y Apellidos</th>
                <th className="p-3">Correo Institucional</th>
                <th className="p-3 text-center">Tipo de Usuario</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No se encontraron usuarios que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 font-mono font-bold text-gray-900">{user.codigoUniversitario}</td>
                    <td className="p-3 font-medium text-gray-900">
                      {user.nombres} {user.apellidos}
                    </td>
                    <td className="p-3 text-gray-600">{user.correo}</td>
                    <td className="p-3 text-center">
                      {user.tipo === 'Docente' ? (
                        <Badge variant="accent">
                          <Briefcase className="w-3 h-3 mr-1 inline" />
                          Docente
                        </Badge>
                      ) : (
                        <Badge variant="primary">
                          <GraduationCap className="w-3 h-3 mr-1 inline" />
                          Estudiante
                        </Badge>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => openEditUserModal(user)}
                        className="p-1.5 text-gray-700 hover:bg-gray-100 rounded transition"
                        title="Editar usuario"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, `${user.nombres} ${user.apellidos}`)}
                        className="p-1.5 text-gray-700 hover:bg-gray-100 rounded transition"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL REGISTRAR / EDITAR USUARIO */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUserId ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-300 text-gray-900 rounded text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-gray-700 shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Nombres *</label>
              <input
                type="text"
                required
                className="input-solid text-xs"
                placeholder="Ej. Juan Carlos"
                value={form.nombres}
                onChange={(e) => setForm({ ...form, nombres: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Apellidos *</label>
              <input
                type="text"
                required
                className="input-solid text-xs"
                placeholder="Ej. Pérez Quispe"
                value={form.apellidos}
                onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Código Universitario *</label>
              <input
                type="text"
                required
                className="input-solid text-xs font-mono"
                placeholder="Ej. 2022100892"
                value={form.codigoUniversitario}
                onChange={(e) => setForm({ ...form, codigoUniversitario: e.target.value })}
              />
              <span className="text-[10px] text-gray-500">Debe ser único.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Tipo de Usuario *</label>
              <select
                className="input-solid text-xs"
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value as UserType })}
              >
                <option value="Estudiante">Estudiante</option>
                <option value="Docente">Docente</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">Correo Electrónico *</label>
            <input
              type="email"
              required
              className="input-solid text-xs"
              placeholder="Ej. jperez@uncp.edu.pe"
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-outline text-xs py-2"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary text-xs py-2">
              <UserPlus className="w-4 h-4 text-gray-400" />
              {editingUserId ? 'Guardar Cambios' : 'Registrar Usuario'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
