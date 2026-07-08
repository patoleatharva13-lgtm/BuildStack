import { X } from 'lucide-react'
export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
        </div>
        <div className="p-5 space-y-3 max-h-[70vh] overflow-auto">{children}</div>
        {footer && <div className="p-4 border-t bg-slate-50 rounded-b-2xl flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}
