import React, { useState } from 'react'
import { useLibrary } from '../context/LibraryContext'
import type { Book, Category } from '../types'
import { Badge } from '../components/common/Badge'
import { Modal } from '../components/common/Modal'
import { Plus, Edit2, Trash2, FolderPlus, BookPlus, AlertCircle, CheckCircle } from 'lucide-react'

export const AdminBooks: React.FC = () => {
  const { categories, books, addBook, updateBook, deleteBook, addCategory, updateCategory, deleteCategory } =
    useLibrary()

  const [activeTab, setActiveTab] = useState<'books' | 'categories'>('books')

  // Estado para formulario de libros
  const [isBookModalOpen, setIsBookModalOpen] = useState(false)
  const [editingBookId, setEditingBookId] = useState<string | null>(null)
  const [bookForm, setBookForm] = useState({
    titulo: '',
    autor: '',
    isbn: '',
    categoriaId: '',
    stock: 1,
  })
  const [bookError, setBookError] = useState<string | null>(null)
  const [bookSuccess, setBookSuccess] = useState<string | null>(null)

  // Estado para formulario de categorías
  const [isCatModalOpen, setIsCatModalOpen] = useState(false)
  const [editingCatId, setEditingCatId] = useState<string | null>(null)
  const [catForm, setCatForm] = useState({
    nombre: '',
    descripcion: '',
  })
  const [catError, setCatError] = useState<string | null>(null)
  const [catSuccess, setCatSuccess] = useState<string | null>(null)

  // Handlers para Libros
  const openNewBookModal = () => {
    setEditingBookId(null)
    setBookForm({
      titulo: '',
      autor: '',
      isbn: '',
      categoriaId: categories[0]?.id || '',
      stock: 1,
    })
    setBookError(null)
    setIsBookModalOpen(true)
  }

  const openEditBookModal = (book: Book) => {
    setEditingBookId(book.id)
    setBookForm({
      titulo: book.titulo,
      autor: book.autor,
      isbn: book.isbn,
      categoriaId: book.categoriaId,
      stock: book.stock,
    })
    setBookError(null)
    setIsBookModalOpen(true)
  }

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setBookError(null)

    // Validaciones
    if (!bookForm.titulo.trim() || !bookForm.autor.trim() || !bookForm.isbn.trim()) {
      setBookError('Todos los campos son obligatorios.')
      return
    }
    if (!bookForm.categoriaId) {
      setBookError('Debe seleccionar una categoría.')
      return
    }
    if (bookForm.stock < 0) {
      setBookError('El stock disponible no puede ser un número negativo.')
      return
    }

    if (editingBookId) {
      const res = updateBook(editingBookId, bookForm)
      if (!res.success) {
        setBookError(res.error || 'Error al actualizar el libro')
        return
      }
      setBookSuccess('Libro actualizado correctamente')
    } else {
      const res = addBook(bookForm)
      if (!res.success) {
        setBookError(res.error || 'Error al registrar el libro')
        return
      }
      setBookSuccess('Libro registrado con éxito en el catálogo')
    }

    setTimeout(() => setBookSuccess(null), 3000)
    setIsBookModalOpen(false)
  }

  const handleDeleteBook = (id: string, titulo: string) => {
    if (window.confirm(`¿Está seguro de eliminar el libro "${titulo}"?`)) {
      const res = deleteBook(id)
      if (!res.success) {
        alert(res.error)
      }
    }
  }

  // Handlers para Categorías
  const openNewCatModal = () => {
    setEditingCatId(null)
    setCatForm({ nombre: '', descripcion: '' })
    setCatError(null)
    setIsCatModalOpen(true)
  }

  const openEditCatModal = (cat: Category) => {
    setEditingCatId(cat.id)
    setCatForm({ nombre: cat.nombre, descripcion: cat.descripcion || '' })
    setCatError(null)
    setIsCatModalOpen(true)
  }

  const handleCatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCatError(null)

    if (!catForm.nombre.trim()) {
      setCatError('El nombre de la categoría es obligatorio.')
      return
    }

    if (editingCatId) {
      const res = updateCategory(editingCatId, catForm)
      if (!res.success) {
        setCatError(res.error || 'Error al actualizar categoría')
        return
      }
      setCatSuccess('Categoría actualizada con éxito')
    } else {
      const res = addCategory(catForm)
      if (!res.success) {
        setCatError(res.error || 'Error al registrar categoría')
        return
      }
      setCatSuccess('Categoría registrada con éxito')
    }

    setTimeout(() => setCatSuccess(null), 3000)
    setIsCatModalOpen(false)
  }

  const handleDeleteCat = (id: string, nombre: string) => {
    if (window.confirm(`¿Está seguro de eliminar la categoría "${nombre}"?`)) {
      const res = deleteCategory(id)
      if (!res.success) {
        alert(res.error)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Título de la página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-blue-950">Módulo de Administración de Libros</h2>
          <p className="text-sm text-slate-600">
            Registro, edición, eliminación y control de inventario bibliográfico.
          </p>
        </div>

        {/* Botones de acción según pestaña */}
        <div className="flex gap-2">
          {activeTab === 'books' ? (
            <button onClick={openNewBookModal} className="btn-primary text-xs py-2">
              <BookPlus className="w-4 h-4 text-amber-400" />
              Nuevo Libro
            </button>
          ) : (
            <button onClick={openNewCatModal} className="btn-primary text-xs py-2">
              <FolderPlus className="w-4 h-4 text-amber-400" />
              Nueva Categoría
            </button>
          )}
        </div>
      </div>

      {/* Notificaciones */}
      {bookSuccess && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-md text-xs font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-700" />
          {bookSuccess}
        </div>
      )}
      {catSuccess && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-md text-xs font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-700" />
          {catSuccess}
        </div>
      )}

      {/* Tabs de navegación interna */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('books')}
          className={`pb-3 px-1 border-b-2 transition ${
            activeTab === 'books'
              ? 'border-blue-900 text-blue-950 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Gestión de Libros ({books.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 px-1 border-b-2 transition ${
            activeTab === 'categories'
              ? 'border-blue-900 text-blue-950 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Categorías ({categories.length})
        </button>
      </div>

      {/* TAB 1: LISTADO Y CRUD DE LIBROS */}
      {activeTab === 'books' && (
        <div className="card-solid overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Título</th>
                  <th className="p-3">Autor</th>
                  <th className="p-3">ISBN</th>
                  <th className="p-3">Categoría</th>
                  <th className="p-3 text-center">Stock</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {books.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      No hay libros registrados en el sistema.
                    </td>
                  </tr>
                ) : (
                  books.map((book) => {
                    const cat = categories.find((c) => c.id === book.categoriaId)
                    return (
                      <tr key={book.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-semibold text-blue-950 max-w-xs">{book.titulo}</td>
                        <td className="p-3 text-slate-700">{book.autor}</td>
                        <td className="p-3 font-mono text-slate-600">{book.isbn}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {cat ? cat.nombre : 'Sin Categoría'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {book.stock > 0 ? (
                            <Badge variant="success">{book.stock} disponibles</Badge>
                          ) : (
                            <Badge variant="danger">Agotado (0)</Badge>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => openEditBookModal(book)}
                            className="p-1.5 text-blue-700 hover:bg-blue-100 rounded transition"
                            title="Editar libro"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book.id, book.titulo)}
                            className="p-1.5 text-rose-700 hover:bg-rose-100 rounded transition"
                            title="Eliminar libro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: LISTADO Y CRUD DE CATEGORÍAS */}
      {activeTab === 'categories' && (
        <div className="card-solid overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Descripción</th>
                  <th className="p-3 text-center">Libros Asociados</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No hay categorías registradas.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => {
                    const count = books.filter((b) => b.categoriaId === cat.id).length
                    return (
                      <tr key={cat.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-semibold text-blue-950">{cat.nombre}</td>
                        <td className="p-3 text-slate-600">{cat.descripcion || '—'}</td>
                        <td className="p-3 text-center">
                          <span className="font-semibold text-slate-800">{count} libros</span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => openEditCatModal(cat)}
                            className="p-1.5 text-blue-700 hover:bg-blue-100 rounded transition"
                            title="Editar categoría"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCat(cat.id, cat.nombre)}
                            className="p-1.5 text-rose-700 hover:bg-rose-100 rounded transition"
                            title="Eliminar categoría"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL PARA CREAR / EDITAR LIBRO */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title={editingBookId ? 'Editar Libro' : 'Registrar Nuevo Libro'}
      >
        <form onSubmit={handleBookSubmit} className="space-y-4">
          {bookError && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-300 text-rose-900 rounded text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
              {bookError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Título del Libro *</label>
            <input
              type="text"
              required
              className="input-solid text-xs"
              placeholder="Ej. Clean Code"
              value={bookForm.titulo}
              onChange={(e) => setBookForm({ ...bookForm, titulo: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Autor *</label>
              <input
                type="text"
                required
                className="input-solid text-xs"
                placeholder="Ej. Robert C. Martin"
                value={bookForm.autor}
                onChange={(e) => setBookForm({ ...bookForm, autor: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">ISBN *</label>
              <input
                type="text"
                required
                className="input-solid text-xs font-mono"
                placeholder="Ej. 978-0132350884"
                value={bookForm.isbn}
                onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Categoría *</label>
              <select
                required
                className="input-solid text-xs"
                value={bookForm.categoriaId}
                onChange={(e) => setBookForm({ ...bookForm, categoriaId: e.target.value })}
              >
                {categories.length === 0 && <option value="">No hay categorías creadas</option>}
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Stock Disponible *</label>
              <input
                type="number"
                min="0"
                required
                className="input-solid text-xs"
                value={bookForm.stock}
                onChange={(e) => setBookForm({ ...bookForm, stock: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsBookModalOpen(false)}
              className="btn-outline text-xs py-2"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary text-xs py-2">
              <Plus className="w-4 h-4 text-amber-400" />
              {editingBookId ? 'Guardar Cambios' : 'Registrar Libro'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL PARA CREAR / EDITAR CATEGORÍA */}
      <Modal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        title={editingCatId ? 'Editar Categoría' : 'Registrar Categoría'}
      >
        <form onSubmit={handleCatSubmit} className="space-y-4">
          {catError && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-300 text-rose-900 rounded text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
              {catError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Nombre de la Categoría *</label>
            <input
              type="text"
              required
              className="input-solid text-xs"
              placeholder="Ej. Redes y Comunicaciones"
              value={catForm.nombre}
              onChange={(e) => setCatForm({ ...catForm, nombre: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Descripción</label>
            <textarea
              rows={3}
              className="input-solid text-xs"
              placeholder="Breve detalle sobre la temática bibliográfica..."
              value={catForm.descripcion}
              onChange={(e) => setCatForm({ ...catForm, descripcion: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsCatModalOpen(false)}
              className="btn-outline text-xs py-2"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary text-xs py-2">
              {editingCatId ? 'Guardar Cambios' : 'Registrar Categoría'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
