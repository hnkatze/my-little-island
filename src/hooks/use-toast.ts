"use client"

import { useState, useEffect } from "react"

type ToastVariant = "default" | "destructive"

type ToastProps = {
  title: string
  description: string
  variant?: ToastVariant
  duration?: number
}

type Toast = ToastProps & {
  id: string
  visible: boolean
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    // Limpiar toasts que ya no son visibles después de un tiempo
    const interval = setInterval(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.visible))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const toast = ({ title, description, variant = "default", duration = 5000 }: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)

    // Añadir nuevo toast
    setToasts((prevToasts) => [...prevToasts, { id, title, description, variant, duration, visible: true }])

    // Configurar temporizador para ocultar el toast
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.map((t) => (t.id === id ? { ...t, visible: false } : t)))
    }, duration)
  }

  return { toast, toasts }
}

export default useToast
