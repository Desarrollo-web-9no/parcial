import React, { useState } from 'react'
import { useLibrary } from '../context/LibraryContext'
import type { Book } from '../types'
import { Badge } from '../components/common/Badge'
import { Modal } from '../components/common/Modal'
import { ReceiptModal } from '../components/common/loans/ReceiptModal'
import { Search, BookOpen, AlertTriangle, Calendar, User, ArrowRight } from 'lucide-react'

export const Catalog: React.FC = () => {
  const { categories, books, users, activeUser, createLoan, lastReceipt, setLastReceipt } = useLibrary()

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS')
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false)

  // Estado del modal de solicitud de préstamo
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [loanDays, setLoanDays] = useState<number>(7)
  const [loanError, setLoanError] = useState<string | null>(null)

  // Modal de Comprobante
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)

  const handleOpenLoan = (book: Book) => {
    setSelectedBook(book)
    setSelectedUserId(activeUser?.id || users[0]?.id || '')
    setLoanDays(7)
    setLoanError(null)
    setIsLoanModalOpen(true)
  }

  const handleConfirmLoan = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBook) return

    setLoanError(null)
    const res = createLoan(selectedUserId, selectedBook.id, loanDays)
    if (!res.success) {
      setLoanError(res.error || 'Error al procesar el préstamo')
      return
    }

    // Éxito: cerrar modal de solicitud y abrir comprobante digital
    setIsLoanModalOpen(false)
    setIsReceiptOpen(true)
  }

  // Filtrado de libros
  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.titulo.toLowerCase().includes(search.toLowerCase()) ||
      b.autor.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.toLowerCase().includes(search.toLowerCase())

    const matchesCategory = selectedCategory === 'TODAS' || b.categoriaId === selectedCategory
    const matchesAvailable = !onlyAvailable || b.stock > 0

    return matchesSearch && matchesCategory && matchesAvailable
  })

  return (
    <div className="space-y-6">
      {/* Cabecera y presentación */}
      <div className="card-solid p-6 border-l-4 border-l-gray-900 bg-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <img src="/logo-uncp.png" alt="UNCP Logo" className="h-12 w-auto object-contain shrink-0 hidden sm:block" />
            <div>
              <h2 className="text-2xl font-bold text-gray-950">Catálogo General de Libros</h2>
              <p className="text-sm text-gray-600 mt-1">
                Explora el acervo bibliográfico, consulta la disponibilidad de ejemplares en tiempo real y solicita tu préstamo digital.
              </p>
            </div>
          </div>
          {activeUser && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-900">
                {activeUser.nombres.charAt(0)}
              </div>
              <div>
                <span className="text-gray-500 block">Solicitante Activo:</span>
                <span className="font-bold text-gray-900">
                  {activeUser.nombres} {activeUser.apellidos}
                </span>
                <span className="text-gray-700 ml-1 font-semibold">({activeUser.tipo})</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            className="input-solid pl-9 text-xs"
            placeholder="Buscar por título, autor o ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="sm:col-span-4">
          <select
            className="input-solid text-xs"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="TODAS">Todas las categorías ({books.length} libros)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3 flex items-center">
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              className="rounded text-gray-900 focus:ring-gray-800"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
            />
            Solo con stock disponible
          </label>
        </div>
      </div>

      {/* Grid de Libros */}
      {filteredBooks.length === 0 ? (
        <div className="card-solid p-10 text-center text-gray-500">
          <BookOpen className="w-10 h-10 mx-auto text-gray-300 mb-2" />
          <p className="font-semibold text-gray-700">No se encontraron libros con los filtros indicados.</p>
          <p className="text-xs text-gray-400 mt-1">Prueba limpiando los términos de búsqueda o cambiando la categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBooks.map((book) => {
            const cat = categories.find((c) => c.id === book.categoriaId)
            const isAvailable = book.stock > 0

            return (
              <div
                key={book.id}
                className="card-solid p-5 flex flex-col justify-between hover:border-gray-300 transition shadow-xs"
              >
                <div>
                  {/* Categoría y disponibilidad */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold text-gray-900 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded">
                      {cat?.nombre || 'General'}
                    </span>
                    {isAvailable ? (
                      <Badge variant="success">{book.stock} en stock</Badge>
                    ) : (
                      <Badge variant="danger">Agotado (0)</Badge>
                    )}
                  </div>

                  {/* Título y Autor */}
                  <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mt-1">
                    {book.titulo}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">Autor: {book.autor}</p>
                  <p className="text-[11px] font-mono text-gray-400 mt-0.5">ISBN: {book.isbn}</p>
                </div>

                {/* Acción de Préstamo */}
                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {isAvailable ? 'Disponible para préstamo' : 'Sin ejemplares'}
                  </span>
                  <button
                    onClick={() => handleOpenLoan(book)}
                    disabled={!isAvailable}
                    className={`text-xs px-3 py-1.5 rounded font-medium transition flex items-center gap-1.5 ${
                      isAvailable
                        ? 'bg-gray-900 text-white hover:bg-gray-950 cursor-pointer shadow-xs'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                    }`}
                    title={isAvailable ? 'Solicitar préstamo' : 'No se puede solicitar: Stock es cero'}
                  >
                    <span>Prestar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* MODAL DE SOLICITUD DE PRÉSTAMO */}
      <Modal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        title="Solicitud de Préstamo de Libro"
      >
        {selectedBook && (
          <form onSubmit={handleConfirmLoan} className="space-y-4">
            {loanError && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-300 text-gray-900 rounded text-xs font-medium">
                <AlertTriangle className="w-4 h-4 text-gray-700 shrink-0" />
                {loanError}
              </div>
            )}

            {/* Resumen del libro */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-1">
              <span className="text-gray-500 block text-[10px] uppercase font-bold">Libro Seleccionado</span>
              <p className="font-bold text-gray-900 text-sm">{selectedBook.titulo}</p>
              <p className="text-gray-600">Autor: {selectedBook.autor}</p>
              <p className="text-gray-600">Stock actual: {selectedBook.stock} ejemplar(es)</p>
            </div>

            {/* Selección de Usuario */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-gray-900" />
                Usuario Solicitante (Estudiante o Docente) *
              </label>
              <select
                required
                className="input-solid text-xs"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombres} {u.apellidos} - Cód: {u.codigoUniversitario} ({u.tipo})
                  </option>
                ))}
              </select>
            </div>

            {/* Plazo del préstamo */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-600" />
                Período de Préstamo *
              </label>
              <select
                className="input-solid text-xs"
                value={loanDays}
                onChange={(e) => setLoanDays(parseInt(e.target.value))}
              >
                <option value={3}>3 Días (Lectura intensiva)</option>
                <option value={7}>7 Días (Estándar universitario)</option>
                <option value={14}>14 Días (Investigación / Docente)</option>
              </select>
              <span className="text-[10px] text-gray-500 mt-1 block">
                Se calculará automáticamente la fecha límite de entrega.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsLoanModalOpen(false)}
                className="btn-outline text-xs py-2"
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary text-xs py-2">
                Confirmar y Generar Comprobante
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* MODAL DE COMPROBANTE DIGITAL (PDF) */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => {
          setIsReceiptOpen(false)
          setLastReceipt(null)
        }}
        data={lastReceipt}
      />
    </div>
  )
}
