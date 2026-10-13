// Tipos de dominio para el Sistema de Biblioteca Universitaria UNCP

export interface Category {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface Book {
  id: string;
  titulo: string;
  autor: string;
  isbn: string;
  categoriaId: string;
  stock: number;
}

export type UserType = 'Estudiante' | 'Docente';

export interface User {
  id: string;
  nombres: string;
  apellidos: string;
  codigoUniversitario: string;
  correo: string;
  tipo: UserType;
}

export type LoanStatus = 'Activo' | 'Devuelto';

export interface Loan {
  id: string; // Ej: PRST-2026-1001
  userId: string;
  bookId: string;
  fechaPrestamo: string;
  fechaLimiteDevolucion: string;
  fechaDevolucionReal?: string;
  estado: LoanStatus;
}
