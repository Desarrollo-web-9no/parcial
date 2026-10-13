import React from 'react'
import { Modal } from '../Modal'
import { generateReceiptPDF } from '../../../utils/pdfGenerator'
import type { ReceiptData } from '../../../utils/pdfGenerator'
import { Download, CheckCircle, Calendar, User, BookOpen, Hash } from 'lucide-react'

interface ReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  data: ReceiptData | null
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, data }) => {
  if (!data) return null

  const { loan, user, book } = data

  const handleDownload = () => {
    generateReceiptPDF(data)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Comprobante Digital de Préstamo" maxWidth="lg">
      <div className="space-y-6">
        {/* Banner de confirmación */}
        <div className="flex items-center gap-3 p-3.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
          <CheckCircle className="w-6 h-6 text-gray-700 shrink-0" />
          <div>
            <p className="font-semibold text-sm">¡Préstamo Registrado con Éxito!</p>
            <p className="text-xs text-gray-800">
              El inventario se ha actualizado y la información se ha guardado en Local Storage.
            </p>
          </div>
        </div>

        {/* Formato visual del ticket / boleta institucional */}
        <div className="border border-gray-300 rounded-lg p-5 bg-gray-50/70 space-y-4">
          <div className="text-center pb-3 border-b border-gray-200">
            <img src="/logo-uncp.png" alt="UNCP Logo" className="h-12 w-auto mx-auto mb-2 object-contain" />
            <span className="text-xs uppercase tracking-wider font-bold text-gray-900 block">
              Universidad Nacional del Centro del Perú
            </span>
            <h4 className="text-sm text-gray-700 font-medium">Biblioteca Central · FIS</h4>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-300 rounded text-xs font-mono font-bold text-gray-900">
              <Hash className="w-3.5 h-3.5 text-gray-600" />
              {loan.id}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Usuario */}
            <div className="bg-white p-3 rounded border border-gray-200">
              <div className="flex items-center gap-1.5 font-bold text-gray-950 mb-1.5">
                <User className="w-4 h-4 text-gray-700" />
                <span>Datos del Usuario</span>
              </div>
              <p className="font-semibold text-gray-900">
                {user.nombres} {user.apellidos}
              </p>
              <p className="text-gray-600">Cód: {user.codigoUniversitario}</p>
              <p className="text-gray-600">Tipo: {user.tipo}</p>
              <p className="text-gray-500 truncate">{user.correo}</p>
            </div>

            {/* Libro */}
            <div className="bg-white p-3 rounded border border-gray-200">
              <div className="flex items-center gap-1.5 font-bold text-gray-950 mb-1.5">
                <BookOpen className="w-4 h-4 text-gray-700" />
                <span>Libro Prestado</span>
              </div>
              <p className="font-semibold text-gray-900 line-clamp-2">{book.titulo}</p>
              <p className="text-gray-600">Autor: {book.autor}</p>
              <p className="text-gray-500">ISBN: {book.isbn}</p>
            </div>
          </div>

          {/* Vigencia */}
          <div className="bg-white p-3 rounded border border-gray-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-gray-500 block">Fecha de Préstamo</span>
              <span className="font-medium text-gray-900">{loan.fechaPrestamo}</span>
            </div>
            <div className="text-right">
              <span className="text-gray-800 font-semibold block flex items-center justify-end gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-700" />
                Fecha Límite
              </span>
              <span className="font-bold text-gray-900">{loan.fechaLimiteDevolucion}</span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
          <button type="button" onClick={onClose} className="btn-outline text-xs py-2">
            Cerrar
          </button>
          <button type="button" onClick={handleDownload} className="btn-primary text-xs py-2">
            <Download className="w-4 h-4 text-gray-400" />
            Descargar Comprobante (PDF)
          </button>
        </div>
      </div>
    </Modal>
  )
}
