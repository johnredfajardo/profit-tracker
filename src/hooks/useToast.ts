import { create } from 'zustand'
import { uid } from '@/lib/id'

export type ToastVariant = 'success' | 'error' | 'info'

export type Toast = {
  id: string
  message: string
  variant: ToastVariant
}

type ToastState = {
  toasts: Toast[]
  push: (message: string, variant?: ToastVariant) => void
  dismiss: (id: string) => void
}

/**
 * Lightweight toast queue. Not persisted — toasts are ephemeral by design.
 * Call `toast.success(...)` etc. from anywhere; <Toaster /> renders them.
 */
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (message, variant = 'info') => {
    const id = uid()
    set((state) => ({ toasts: [...state.toasts, { id, message, variant }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, 3200)
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

export const toast = {
  success: (message: string) => useToastStore.getState().push(message, 'success'),
  error: (message: string) => useToastStore.getState().push(message, 'error'),
  info: (message: string) => useToastStore.getState().push(message, 'info'),
}
