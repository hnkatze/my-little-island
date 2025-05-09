// Si no existe este componente, lo creamos
"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return createPortal(
    <div className="fixed top-0 right-0 z-50 p-4 space-y-4 w-full max-w-sm">
      {toasts
        .filter((toast) => toast.visible)
        .map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-md shadow-lg flex items-start gap-3 animate-in slide-in-from-right-full 
              ${toast.variant === "destructive" ? "bg-destructive text-destructive-foreground" : "bg-white border"}`}
          >
            <div className="flex-1">
              <h3 className="font-medium">{toast.title}</h3>
              <p className={`text-sm ${toast.variant === "destructive" ? "" : "text-muted-foreground"}`}>
                {toast.description}
              </p>
            </div>
            <button
              onClick={() => {
                document.getElementById(`toast-${toast.id}`)?.classList.add("animate-out", "slide-out-to-right-full")
              }}
              className="text-foreground/50 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
    </div>,
    document.body,
  )
}
