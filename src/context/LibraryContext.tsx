import React, { createContext, useContext, useState } from 'react'
import type { Book, Category, Loan, User } from '../types'
import * as storage from '../services/storage'
import type { ReceiptData } from '../utils/pdfGenerator'

export interface LibraryContextType {
  categories: Category[]
  books: Book[]
  users: User[]
  loans: Loan[]
  activeUser: User | null
  lastReceipt: ReceiptData | null
  setActiveUser: (user: User | null) => void
  setLastReceipt: (receipt: ReceiptData | null) => void

  // Categorías
  addCategory: (category: Omit<Category, 'id'>) => { success: boolean; error?: string }
  updateCategory: (id: string, category: Omit<Category, 'id'>) => { success: boolean; error?: string }
  deleteCategory: (id: string) => { success: boolean; error?: string }

  // Libros
  addBook: (book: Omit<Book, 'id'>) => { success: boolean; error?: string }
  updateBook: (id: string, book: Omit<Book, 'id'>) => { success: boolean; error?: string }
  deleteBook: (id: string) => { success: boolean; error?: string }

  // Usuarios
  addUser: (user: Omit<User, 'id'>) => { success: boolean; error?: string }
  updateUser: (id: string, user: Omit<User, 'id'>) => { success: boolean; error?: string }
  deleteUser: (id: string) => { success: boolean; error?: string }

  // Préstamos
  createLoan: (userId: string, bookId: string, days?: number) => { success: boolean; error?: string; loan?: Loan }
  returnLoan: (loanId: string) => { success: boolean; error?: string }
}

export const LibraryContext = createContext<LibraryContextType | undefined>(undefined)

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicialización directa (Lazy initial state) para evitar re-renderizados innecesarios
  const [categories, setCategories] = useState<Category[]>(() => {
    storage.initializeStorage()
    return storage.getCategories()
  })

  const [books, setBooks] = useState<Book[]>(() => storage.getBooks())
  const [users, setUsers] = useState<User[]>(() => storage.getUsers())
  const [loans, setLoans] = useState<Loan[]>(() => storage.getLoans())

  const [activeUser, setActiveUser] = useState<User | null>(() => {
    const loaded = storage.getUsers()
    return loaded.length > 0 ? loaded[0] : null
  })

  const [lastReceipt, setLastReceipt] = useState<ReceiptData | null>(null)

  // --- MÓDULO 1: CATEGORÍAS ---
  const addCategory = (catData: Omit<Category, 'id'>) => {
    const exists = categories.some((c) => c.nombre.trim().toLowerCase() === catData.nombre.trim().toLowerCase())
    if (exists) {
      return { success: false, error: 'Ya existe una categoría con ese nombre' }
    }
    const newCategory: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
    }
    const updated = [...categories, newCategory]
    setCategories(updated)
    storage.saveCategories(updated)
    return { success: true }
  }

  const updateCategory = (id: string, catData: Omit<Category, 'id'>) => {
    const exists = categories.some(
      (c) => c.id !== id && c.nombre.trim().toLowerCase() === catData.nombre.trim().toLowerCase()
    )
    if (exists) {
      return { success: false, error: 'Ya existe otra categoría con ese nombre' }
    }
    const updated = categories.map((c) => (c.id === id ? { ...catData, id } : c))
    setCategories(updated)
    storage.saveCategories(updated)
    return { success: true }
  }

  const deleteCategory = (id: string) => {
    const hasBooks = books.some((b) => b.categoriaId === id)
    if (hasBooks) {
      return { success: false, error: 'No se puede eliminar la categoría porque tiene libros asignados' }
    }
    const updated = categories.filter((c) => c.id !== id)
    setCategories(updated)
    storage.saveCategories(updated)
    return { success: true }
  }

  // --- MÓDULO 1: LIBROS ---
  const addBook = (bookData: Omit<Book, 'id'>) => {
    if (bookData.stock < 0) {
      return { success: false, error: 'El stock no puede ser negativo' }
    }
    const existsIsbn = books.some((b) => b.isbn.trim() === bookData.isbn.trim())
    if (existsIsbn) {
      return { success: false, error: 'Ya existe un libro registrado con este código ISBN' }
    }
    const newBook: Book = {
      ...bookData,
      id: `book-${Date.now()}`,
    }
    const updated = [...books, newBook]
    setBooks(updated)
    storage.saveBooks(updated)
    return { success: true }
  }

  const updateBook = (id: string, bookData: Omit<Book, 'id'>) => {
    if (bookData.stock < 0) {
      return { success: false, error: 'El stock no puede ser negativo' }
    }
    const existsIsbn = books.some((b) => b.id !== id && b.isbn.trim() === bookData.isbn.trim())
    if (existsIsbn) {
      return { success: false, error: 'Otro libro ya tiene este código ISBN registrado' }
    }
    const updated = books.map((b) => (b.id === id ? { ...bookData, id } : b))
    setBooks(updated)
    storage.saveBooks(updated)
    return { success: true }
  }

  const deleteBook = (id: string) => {
    const hasActiveLoan = loans.some((l) => l.bookId === id && l.estado === 'Activo')
    if (hasActiveLoan) {
      return { success: false, error: 'No se puede eliminar el libro porque tiene un préstamo activo en curso' }
    }
    const updated = books.filter((b) => b.id !== id)
    setBooks(updated)
    storage.saveBooks(updated)
    return { success: true }
  }

  // --- MÓDULO 2: USUARIOS ---
  const addUser = (userData: Omit<User, 'id'>) => {
    const cleanCode = userData.codigoUniversitario.trim()
    const duplicate = users.some((u) => u.codigoUniversitario.trim().toLowerCase() === cleanCode.toLowerCase())
    if (duplicate) {
      return { success: false, error: `El código universitario "${cleanCode}" ya está registrado` }
    }
    const newUser: User = {
      ...userData,
      codigoUniversitario: cleanCode,
      id: `usr-${Date.now()}`,
    }
    const updated = [...users, newUser]
    setUsers(updated)
    storage.saveUsers(updated)
    return { success: true }
  }

  const updateUser = (id: string, userData: Omit<User, 'id'>) => {
    const cleanCode = userData.codigoUniversitario.trim()
    const duplicate = users.some(
      (u) => u.id !== id && u.codigoUniversitario.trim().toLowerCase() === cleanCode.toLowerCase()
    )
    if (duplicate) {
      return { success: false, error: `El código universitario "${cleanCode}" ya pertenece a otro usuario` }
    }
    const updated = users.map((u) => (u.id === id ? { ...userData, codigoUniversitario: cleanCode, id } : u))
    setUsers(updated)
    storage.saveUsers(updated)
    return { success: true }
  }

  const deleteUser = (id: string) => {
    const hasActiveLoan = loans.some((l) => l.userId === id && l.estado === 'Activo')
    if (hasActiveLoan) {
      return { success: false, error: 'El usuario tiene libros pendientes de devolución' }
    }
    const updated = users.filter((u) => u.id !== id)
    setUsers(updated)
    storage.saveUsers(updated)
    if (activeUser?.id === id) {
      setActiveUser(updated[0] || null)
    }
    return { success: true }
  }

  // --- MÓDULO 3 Y 4: PRÉSTAMO Y COMPROBANTE ---
  const createLoan = (userId: string, bookId: string, days = 7) => {
    const targetBook = books.find((b) => b.id === bookId)
    const targetUser = users.find((u) => u.id === userId)

    if (!targetBook) {
      return { success: false, error: 'Libro no encontrado' }
    }
    if (!targetUser) {
      return { success: false, error: 'Usuario no seleccionado o inexistente' }
    }
    // Requisito: No permitir préstamos si el stock es cero
    if (targetBook.stock <= 0) {
      return { success: false, error: 'No hay ejemplares disponibles en inventario (Stock = 0)' }
    }

    const today = new Date()
    const dueDate = new Date()
    dueDate.setDate(today.getDate() + days)

    const formatDate = (d: Date) => d.toISOString().split('T')[0]

    const newLoan: Loan = {
      id: storage.generateLoanCode(),
      userId,
      bookId,
      fechaPrestamo: formatDate(today),
      fechaLimiteDevolucion: formatDate(dueDate),
      estado: 'Activo',
    }

    // Actualización automática de inventario (restar 1 al stock)
    const updatedBooks = books.map((b) => (b.id === bookId ? { ...b, stock: b.stock - 1 } : b))
    const updatedLoans = [newLoan, ...loans]

    setBooks(updatedBooks)
    setLoans(updatedLoans)

    storage.saveBooks(updatedBooks)
    storage.saveLoans(updatedLoans)

    // Configuración de comprobante digital automático
    setLastReceipt({
      loan: newLoan,
      user: targetUser,
      book: targetBook,
    })

    return { success: true, loan: newLoan }
  }

  // --- MÓDULO 5: DEVOLUCIÓN ---
  const returnLoan = (loanId: string) => {
    const targetLoan = loans.find((l) => l.id === loanId)
    if (!targetLoan) {
      return { success: false, error: 'Préstamo no encontrado' }
    }
    if (targetLoan.estado === 'Devuelto') {
      return { success: false, error: 'Este préstamo ya fue devuelto anteriormente' }
    }

    const today = new Date().toISOString().split('T')[0]

    // Actualización del préstamo
    const updatedLoans = loans.map((l) =>
      l.id === loanId ? { ...l, estado: 'Devuelto' as const, fechaDevolucionReal: today } : l
    )

    // Devolución automática al inventario (sumar 1 al stock)
    const updatedBooks = books.map((b) => (b.id === targetLoan.bookId ? { ...b, stock: b.stock + 1 } : b))

    setLoans(updatedLoans)
    setBooks(updatedBooks)

    storage.saveLoans(updatedLoans)
    storage.saveBooks(updatedBooks)

    return { success: true }
  }

  return (
    <LibraryContext.Provider
      value={{
        categories,
        books,
        users,
        loans,
        activeUser,
        lastReceipt,
        setActiveUser,
        setLastReceipt,
        addCategory,
        updateCategory,
        deleteCategory,
        addBook,
        updateBook,
        deleteBook,
        addUser,
        updateUser,
        deleteUser,
        createLoan,
        returnLoan,
      }}
    >
      {children}
    </LibraryContext.Provider>
  )
}

export const useLibrary = () => {
  const context = useContext(LibraryContext)
  if (!context) {
    throw new Error('useLibrary debe utilizarse dentro de un LibraryProvider')
  }
  return context
}
