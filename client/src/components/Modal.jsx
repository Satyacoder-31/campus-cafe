import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({ open, onClose, children, title, size = 'md' }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-5xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-cafe-bg rounded-3xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto animate-slide-up`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-cafe-border sticky top-0 bg-cafe-bg z-10">
            <h2 className="font-display font-bold text-xl text-primary">{title}</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-cafe-border transition-colors">
              <X className="w-5 h-5 text-stone-500" />
            </button>
          </div>
        )}
        {!title && (
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors z-10">
            <X className="w-5 h-5 text-stone-600" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
