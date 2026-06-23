import { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext(null);

let idCounter = 0;

const ICONS = {
  success: (
    <path d="M20 6 9 17l-5-5" />
  ),
  download: (
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  ),
  error: (
    <path d="M18 6 6 18M6 6l12 12" />
  ),
  info: (
    <path d="M12 16v-4M12 8h.01" />
  ),
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, message, type = 'success', duration = 4000 }) => {
      const id = ++idCounter;
      setToasts((list) => [...list, { id, title, message, type }]);
      if (duration) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}

      {/* Toast viewport */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-3">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="pointer-events-auto relative overflow-hidden rounded-2xl border border-white/10 bg-slate-card/95 p-4 shadow-glow backdrop-blur-md"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                    t.type === 'error' ? 'bg-red-500/15 text-red-400' : 'bg-amber-glow/15 text-amber-glow'
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    {t.type === 'error' ? ICONS.error : ICONS[t.type] || ICONS.success}
                    {(t.type === 'info') && <circle cx="12" cy="12" r="10" />}
                  </svg>
                </span>
                <div className="flex-1 pr-4">
                  {t.title && <p className="font-heading text-sm font-semibold text-cloud">{t.title}</p>}
                  {t.message && <p className="mt-0.5 text-sm leading-snug text-mist">{t.message}</p>}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss"
                  className="text-mist transition hover:text-cloud"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Progress bar */}
              <motion.span
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 4, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-amber-glow/70"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
