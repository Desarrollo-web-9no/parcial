import type { Book, Category, Loan, User } from '../types'
import { initialBooks, initialCategories, initialUsers } from '../data/seedData'

const KEYS = {
  CATEGORIES: 'uncp_categories',
  BOOKS: 'uncp_books',
  USERS: 'uncp_users',
  LOANS: 'uncp_loans',
}

// Inicialización con datos mockeados si no existen
export const initializeStorage = () => {
  if (!localStorage.getItem(KEYS.CATEGORIES)) {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(initialCategories))
  }
  if (!localStorage.getItem(KEYS.BOOKS)) {
    localStorage.setItem(KEYS.BOOKS, JSON.stringify(initialBooks))
  }
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(initialUsers))
  }
  if (!localStorage.getItem(KEYS.LOANS)) {
    localStorage.setItem(KEYS.LOANS, JSON.stringify([]))
  }
}

// --- CATEGORÍAS ---
export const getCategories = (): Category[] => {
  initializeStorage()
  const data = localStorage.getItem(KEYS.CATEGORIES)
  return data ? JSON.parse(data) : []
}

export const saveCategories = (categories: Category[]): void => {
  localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories))
}

// --- LIBROS ---
export const getBooks = (): Book[] => {
  initializeStorage()
  const data = localStorage.getItem(KEYS.BOOKS)
  return data ? JSON.parse(data) : []
}

export const saveBooks = (books: Book[]): void => {
  localStorage.setItem(KEYS.BOOKS, JSON.stringify(books))
}

// --- USUARIOS ---
export const getUsers = (): User[] => {
  initializeStorage()
  const data = localStorage.getItem(KEYS.USERS)
  return data ? JSON.parse(data) : []
}

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users))
}

// --- PRÉSTAMOS ---
export const getLoans = (): Loan[] => {
  initializeStorage()
  const data = localStorage.getItem(KEYS.LOANS)
  return data ? JSON.parse(data) : []
}

export const saveLoans = (loans: Loan[]): void => {
  localStorage.setItem(KEYS.LOANS, JSON.stringify(loans))
}

// Generador de código único de préstamo
export const generateLoanCode = (): string => {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  return `PRST-${new Date().getFullYear()}-${randomSuffix}`
}
