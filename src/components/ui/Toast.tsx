import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl
            border-l-4 min-w-[280px] max-w-sm animate-slide-up
            ${toast.type === 'success'
              ? 'bg-white dark:bg-gray-800 border-l-emerald-500 border border-slate-200 dark:border-gray-700'
              : 'bg-white dark:bg-gray-800 border-l-red-500 border border-slate-200 dark:border-gray-700'
            }
          `}
          role="alert"
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          )}
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200 flex-1">
            {toast.message}
          </span>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex-shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
