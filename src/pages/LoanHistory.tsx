import React, { useState } from 'react'
import { useLibrary } from '../context/LibraryContext'
import { Badge } from '../components/common/Badge'
import { ReceiptModal } from '../components/common/loans/ReceiptModal'
import type { ReceiptData } from '../utils/pdfGenerator'
import { History, CheckCircle2, RotateCcw, FileText, Search } from 'lucide-react'

export const LoanHistory: React.FC = () => {
  const { loans, books, users, activeUser, returnLoan } = useLibrary()

  const [selectedUserFilter, setSelectedUserFilter] = useState<string>(activeUser?.id || 'TODOS')
  const [statusFilter, setStatusFilter] = useState<'TODOS' | 'Activo' | 'Devuelto'>('TODOS')
  const [search, setSearch] = useState('')

  // Modal para comprobante re-generado
  const [modalReceiptData, setModalReceiptData] = useState<ReceiptData | null>(null)
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  const handleReturn = (loanId: string, bookTitle: string) => {
    if (window.confirm(`¿Confirmar la devolución del libro "${bookTitle}"? Se repondrá 1 unidad al stock.`)) {
      const res = returnLoan(loanId)
      if (res.success) {
        setActionSuccess(`Devolución registrada con éxito. El inventario se actualizó.`)
        setTimeout(() => setActionSuccess(null), 3000)
      } else {
        alert(res.error)
      }
    }
  }

  const handleViewReceipt = (loanId: string) => {
    const loan = loans.find((l) => l.id === loanId)
    if (!loan) return
    const user = users.find((u) => u.id === loan.userId)
    const book = books.find((b) => b.id === loan.bookId)
    if (!user || !book) return

    setModalReceiptData({ loan, user, book })
    setIsReceiptModalOpen(true)
  }

  // Filtrado de préstamos
  const filteredLoans = loans.filter((l) => {
    const book = books.find((b) => b.id === l.bookId)
    const user = users.find((u) => u.id === l.userId)

    const matchesUser = selectedUserFilter === 'TODOS' || l.userId === selectedUserFilter
    const matchesStatus = statusFilter === 'TODOS' || l.estado === statusFilter

    const query = search.toLowerCase()
    const matchesSearch =
      l.id.toLowerCase().includes(query) ||
      (book && book.titulo.toLowerCase().includes(query)) ||
      (user && `${user.nombres} ${user.apellidos}`.toLowerCase().includes(query))

    return matchesUser && matchesStatus && matchesSearch
  })

  // Estadísticas rápidas
  const totalLoans = loans.length
  const activeCount = loans.filter((l) => l.estado === 'Activo').length
  const returnedCount = loans.filter((l) => l.estado === 'Devuelto').length

  return (
    <div className="space-y-6">
      {/* Cabecera y Resumen */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-950 flex items-center gap-2">
            <History className="w-6 h-6 text-gray-600" />
            Historial de Préstamos y Devoluciones
          </h2>
          <p className="text-sm text-gray-600">
            Control de vigencias, estados de préstamo activo/devuelto y comprobantes digitales.
          </p>
        </div>

        {/* Tarjetas de métricas rápidas */}
        <div className="flex gap-2">
          <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs shadow-xs">
            <span className="text-gray-500 block">Total</span>
            <span className="font-bold text-gray-900">{totalLoans}</span>
          </div>
          <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs shadow-xs">
            <span className="text-gray-800 block">Activos</span>
            <span className="font-bold text-gray-900">{activeCount}</span>
          </div>
          <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs shadow-xs">
            <span className="text-gray-800 block">Devueltos</span>
            <span className="font-bold text-gray-900">{returnedCount}</span>
          </div>
        </div>
      </div>

      {/* Alerta de acción */}
      {actionSuccess && (
        <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-md text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-gray-700 shrink-0" />
          {actionSuccess}
        </div>
      )}

      {/* Filtros de Historial */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-4 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            className="input-solid pl-9 text-xs"
            placeholder="Buscar por código, libro o usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="sm:col-span-4">
          <select
            className="input-solid text-xs"
            value={selectedUserFilter}
            onChange={(e) => setSelectedUserFilter(e.target.value)}
          >
            <option value="TODOS">Ver todos los usuarios ({loans.length} préstamos)</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombres} {u.apellidos} ({u.tipo})
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-4">
          <select
            className="input-solid text-xs"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'TODOS' | 'Activo' | 'Devuelto')}
          >
            <option value="TODOS">Todos los estados</option>
            <option value="Activo">Solo Préstamos Activos</option>
            <option value="Devuelto">Solo Préstamos Devueltos</option>
          </select>
        </div>
      </div>

      {/* Tabla de Historial */}
      <div className="card-solid overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="p-3">Código</th>
                <th className="p-3">Usuario</th>
                <th className="p-3">Libro Prestado</th>
                <th className="p-3">Fecha Préstamo</th>
                <th className="p-3">Fecha Límite</th>
                <th className="p-3 text-center">Estado</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    No hay registros de préstamos que coincidan con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => {
                  const book = books.find((b) => b.id === loan.bookId)
                  const user = users.find((u) => u.id === loan.userId)
                  const isActivo = loan.estado === 'Activo'

                  return (
                    <tr key={loan.id} className="hover:bg-gray-50 transition">
                      <td className="p-3 font-mono font-bold text-gray-900">{loan.id}</td>
                      <td className="p-3">
                        <div className="font-semibold text-gray-900">
                          {user ? `${user.nombres} ${user.apellidos}` : 'Usuario eliminado'}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {user?.tipo} · Cód: {user?.codigoUniversitario}
                        </div>
                      </td>
                      <td className="p-3 max-w-xs">
                        <div className="font-medium text-gray-900 line-clamp-1">
                          {book ? book.titulo : 'Libro no disponible'}
                        </div>
                        <div className="text-[10px] text-gray-500">{book?.autor}</div>
                      </td>
                      <td className="p-3 text-gray-700">{loan.fechaPrestamo}</td>
                      <td className="p-3 font-semibold text-gray-900">{loan.fechaLimiteDevolucion}</td>
                      <td className="p-3 text-center">
                        {isActivo ? (
                          <Badge variant="warning">En Préstamo (Activo)</Badge>
                        ) : (
                          <Badge variant="success">Devuelto ({loan.fechaDevolucionReal})</Badge>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {/* Ver comprobante */}
                        <button
                          onClick={() => handleViewReceipt(loan.id)}
                          className="p-1.5 text-gray-700 hover:bg-gray-100 rounded transition inline-flex items-center gap-1"
                          title="Ver comprobante y descargar PDF"
                        >
                          <FileText className="w-4 h-4 text-gray-900" />
                          <span className="hidden md:inline text-[11px] font-medium">Comprobante</span>
                        </button>

                        {/* Registrar devolución */}
                        {isActivo && (
                          <button
                            onClick={() => handleReturn(loan.id, book?.titulo || '')}
                            className="p-1.5 text-gray-700 hover:bg-gray-100 rounded transition inline-flex items-center gap-1 font-semibold"
                            title="Registrar devolución del libro"
                          >
                            <RotateCcw className="w-4 h-4 text-gray-800" />
                            <span className="hidden md:inline text-[11px]">Devolver</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Comprobante Re-visualizado */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => {
          setIsReceiptModalOpen(false)
          setModalReceiptData(null)
        }}
        data={modalReceiptData}
      />
    </div>
  )
}
