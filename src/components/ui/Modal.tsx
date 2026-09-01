import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  footer,
}: ModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative rounded-2xl w-full flex flex-col max-h-[90vh] z-10 animate-in fade-in zoom-in-95 duration-150',
          sizeClasses[size]
        )}
        style={{
          backgroundColor: 'var(--surface-1)',
          border: '1px solid var(--border-primary)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        }}
      >
        {title && (
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: '1px solid var(--border-primary)' }}
          >
            <div>
              <h2 className="text-[15px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {title}
              </h2>
              {description && (
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors btn-subtle"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="overflow-y-auto flex-1 px-6 py-4">{children}</div>
        {footer && (
          <div
            className="px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl"
            style={{
              borderTop: '1px solid var(--border-primary)',
              backgroundColor: 'var(--surface-2)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
