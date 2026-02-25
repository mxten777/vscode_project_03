/**
 * Toast notification system
 * Usage:
 *   import { useToast, ToastProvider } from './Toast';
 *   const toast = useToast();
 *   toast.success('저장되었습니다');
 *   toast.error('오류가 발생했습니다');
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const contextValue: ToastContextType = {
    success: (msg) => addToast('success', msg),
    error: (msg) => addToast('error', msg),
    info: (msg) => addToast('info', msg),
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const styles = {
    success: 'from-emerald-500 to-emerald-600 shadow-emerald-500/25',
    error: 'from-red-500 to-red-600 shadow-red-500/25',
    info: 'from-primary-500 to-primary-600 shadow-primary-500/25',
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <div
              key={toast.id}
              className="pointer-events-auto animate-slide-in-right flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/60 px-4 py-3 shadow-xl min-w-[280px] max-w-[380px]"
            >
              <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${styles[toast.type]} shadow-lg`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-800 flex-1">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 rounded-lg p-1 text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-all"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
