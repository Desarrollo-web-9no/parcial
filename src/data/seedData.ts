import type { Book, Category, User } from '../types'

export const initialCategories: Category[] = [
  { id: 'cat-1', nombre: 'Ingeniería de Sistemas', descripcion: 'Libros de software, arquitectura y redes' },
  { id: 'cat-2', nombre: 'Ciencias de la Computación', descripcion: 'Algoritmos, estructuras de datos e IA' },
  { id: 'cat-3', nombre: 'Bases de Datos', descripcion: 'Diseño relacional, NoSQL y optimización' },
  { id: 'cat-4', nombre: 'Desarrollo Web y Móvil', descripcion: 'Frontend, backend, APIs y frameworks' },
]

export const initialBooks: Book[] = [
  {
    id: 'book-1',
    titulo: 'Clean Architecture: A Craftsman\'s Guide',
    autor: 'Robert C. Martin',
    isbn: '978-0134494166',
    categoriaId: 'cat-1',
    stock: 5,
  },
  {
    id: 'book-2',
    titulo: 'Designing Data-Intensive Applications',
    autor: 'Martin Kleppmann',
    isbn: '978-1449373320',
    categoriaId: 'cat-3',
    stock: 3,
  },
  {
    id: 'book-3',
    titulo: 'Introduction to Algorithms (CLRS)',
    autor: 'Thomas H. Cormen',
    isbn: '978-0262046305',
    categoriaId: 'cat-2',
    stock: 2,
  },
  {
    id: 'book-4',
    titulo: 'React y TypeScript en la Práctica',
    autor: 'Dan Abramov & Comunidad',
    isbn: '978-9876543210',
    categoriaId: 'cat-4',
    stock: 4,
  },
  {
    id: 'book-5',
    titulo: 'Database System Concepts (Silberschatz)',
    autor: 'Abraham Silberschatz',
    isbn: '978-0078022159',
    categoriaId: 'cat-3',
    stock: 1,
  },
  {
    id: 'book-6',
    titulo: 'Inteligencia Artificial: Un Enfoque Moderno',
    autor: 'Stuart Russell & Peter Norvig',
    isbn: '978-0136042594',
    categoriaId: 'cat-2',
    stock: 0, // Libro agotado para probar validación de stock cero
  },
]

export const initialUsers: User[] = [
  {
    id: 'usr-1',
    nombres: 'José Carlos',
    apellidos: 'Aguilar Huamán',
    codigoUniversitario: '2021100523',
    correo: 'jaguilar@uncp.edu.pe',
    tipo: 'Estudiante',
  },
  {
    id: 'usr-2',
    nombres: 'Jaime',
    apellidos: 'Suasnábar Terrel',
    codigoUniversitario: '1998000412',
    correo: 'jsuasnabar@uncp.edu.pe',
    tipo: 'Docente',
  },
  {
    id: 'usr-3',
    nombres: 'María Elena',
    apellidos: 'Rojas Quispe',
    codigoUniversitario: '2022200115',
    correo: 'mrojas@uncp.edu.pe',
    tipo: 'Estudiante',
  },
]
