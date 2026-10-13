import { jsPDF } from 'jspdf'
import type { Book, Loan, User } from '../types'

export interface ReceiptData {
  loan: Loan
  user: User
  book: Book
}

export const generateReceiptPDF = ({ loan, user, book }: ReceiptData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5', // Tamaño media cuartilla formal para comprobante
  })

  // Estilos de color institucional UNCP
  const primaryNavy = '#1e3a8a'
  const textDark = '#0f172a'

  // Encabezado institucional
  doc.setFillColor(30, 58, 138)
  doc.rect(0, 0, 148, 22, 'F')

  doc.setTextColor('#ffffff')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('UNIVERSIDAD NACIONAL DEL CENTRO DEL PERÚ', 74, 9, { align: 'center' })
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Facultad de Ingeniería de Sistemas · Biblioteca Central', 74, 15, { align: 'center' })

  // Título del Comprobante
  doc.setTextColor(primaryNavy)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('COMPROBANTE DIGITAL DE PRÉSTAMO', 74, 32, { align: 'center' })

  // Código de préstamo
  doc.setFillColor(241, 245, 249)
  doc.roundedRect(20, 36, 108, 11, 2, 2, 'F')
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text(`CÓDIGO ÚNICO: ${loan.id}`, 74, 43, { align: 'center' })

  // Línea separadora
  doc.setDrawColor(203, 213, 225)
  doc.line(15, 52, 133, 52)

  let y = 60
  doc.setTextColor(textDark)

  // Sección: Datos del Usuario
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('DATOS DEL USUARIO', 15, y)
  y += 6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.text(`Nombres y Apellidos: ${user.nombres} ${user.apellidos}`, 15, y)
  y += 5
  doc.text(`Código Universitario: ${user.codigoUniversitario}`, 15, y)
  doc.text(`Tipo: ${user.tipo}`, 85, y)
  y += 5
  doc.text(`Correo Electrónico: ${user.correo}`, 15, y)
  y += 9

  // Línea separadora
  doc.line(15, y - 2, 133, y - 2)

  // Sección: Datos del Libro
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('DETALLES DEL LIBRO PRESTADO', 15, y + 4)
  y += 10

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.text(`Título: ${book.titulo}`, 15, y)
  y += 5
  doc.text(`Autor: ${book.autor}`, 15, y)
  y += 5
  doc.text(`ISBN: ${book.isbn}`, 15, y)
  y += 9

  // Línea separadora
  doc.line(15, y - 2, 133, y - 2)

  // Sección: Fechas del Préstamo
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('VIGENCIA DEL PRÉSTAMO', 15, y + 4)
  y += 10

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.text(`Fecha de Emisión: ${loan.fechaPrestamo}`, 15, y)
  y += 5
  doc.setTextColor(194, 65, 12) // Color ámbar/terracota
  doc.setFont('helvetica', 'bold')
  doc.text(`Fecha Límite de Devolución: ${loan.fechaLimiteDevolucion}`, 15, y)
  doc.setTextColor(textDark)
  y += 16

  // Nota de compromiso
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'italic')
  doc.text(
    'Nota: El usuario se compromete a devolver el material bibliográfico en perfecto estado.',
    74,
    y,
    { align: 'center' }
  )
  y += 4
  doc.text('Cualquier retraso estará sujeto a sanción administrativa universitaria.', 74, y, { align: 'center' })

  // Pie de página
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(100, 116, 139)
  doc.text(`Generado automáticamente · Sistema de Biblioteca UNCP · ${new Date().toLocaleDateString()}`, 74, 195, {
    align: 'center',
  })

  // Descarga del PDF
  doc.save(`Comprobante_${loan.id}.pdf`)
}
