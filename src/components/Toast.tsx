'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useCallback, useState, useEffect } from 'react';

/**
 * Toast notification types
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast notification configuration
 */
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Global toast store for managing notifications
 */
const toastStore = {
  toasts: [] as Toast[],
  listeners: new Set<(toasts: Toast[]) => void>(),

  subscribe: (listener: (toasts: Toast[]) => void) => {
    toastStore.listeners.add(listener);
    return () => {
      toastStore.listeners.delete(listener);
    };
  },

  notify: (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = {
      id,
      message,
      type,
      duration,
    };

    toastStore.toasts.push(toast);
    toastStore.listeners.forEach((listener) => listener(toastStore.toasts));

    if (duration > 0) {
      setTimeout(() => {
        toastStore.remove(id);
      }, duration);
    }
  },

  remove: (id: string) => {
    toastStore.toasts = toastStore.toasts.filter((t) => t.id !== id);
    toastStore.listeners.forEach((listener) => listener(toastStore.toasts));
  },
};

/**
 * Hook to use toast notifications
 * @returns Toast notification functions
 */
export const useToast = () => {
  return {
    success: (message: string, duration?: number) =>
      toastStore.notify(message, 'success', duration),
    error: (message: string, duration?: number) =>
      toastStore.notify(message, 'error', duration),
    warning: (message: string, duration?: number) =>
      toastStore.notify(message, 'warning', duration),
    info: (message: string, duration?: number) =>
      toastStore.notify(message, 'info', duration),
  };
};

/**
 * Individual toast notification item component
 */
const ToastItem: React.FC<{
  toast: Toast;
  onClose: (id: string) => void;
}> = ({ toast, onClose }) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
    error: 'bg-red-500/20 border-red-500/30 text-red-300',
    warning: 'bg-amber-500/20 border-amber-500/30 text-amber-300',
    info: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
  };

  const Icon = icons[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: 0 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 20, x: 100 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`flex items-center gap-3 ${colors[toast.type]} border rounded-lg p-4 backdrop-blur-xl shadow-lg pointer-events-auto`}
    >
      <Icon className="flex-shrink-0" size={20} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{toast.message}</p>
      </div>

      {toast.action && (
        <button
          onClick={toast.action.onClick}
          className="flex-shrink-0 text-xs font-semibold px-3 py-1 rounded opacity-80 hover:opacity-100 transition-opacity"
        >
          {toast.action.label}
        </button>
      )}

      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity p-1"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

/**
 * Toast container component - renders all active toast notifications
 * Place this component once in your app (typically in the root layout)
 *
 * @component
 * @example
 * ```tsx
 * <ToastContainer />
 * ```
 */
export const ToastContainer: React.FC = (): React.ReactElement => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toastStore.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const handleClose = useCallback((id: string) => {
    toastStore.remove(id);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={handleClose} />
        ))}
      </AnimatePresence>
    </div>
  );
};
