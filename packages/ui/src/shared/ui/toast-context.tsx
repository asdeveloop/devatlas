"use client"

import * as React from "react"

type ToastKind = "info" | "success" | "error" | "warning" | "destructive"

type ToastContextValue = {
  showToast: (message: string, kind?: ToastKind) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const context = React.useMemo(
    () => ({
      showToast(message: string) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("app-toast", {
              detail: { message },
            }),
          )
        }
      },
    }),
    []
  )

  return <ToastContext.Provider value={context}>{children}</ToastContext.Provider>
}

export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext)

  if (context) {
    return context
  }

  return {
    showToast: () => undefined,
  }
}
