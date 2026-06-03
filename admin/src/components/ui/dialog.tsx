import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "./utils"

const Dialog = ({ open, onOpenChange, children }: { open: boolean, onOpenChange: (open: boolean) => void, children: React.ReactNode }) => {
  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative z-50">
        {children}
      </div>
    </div>,
    document.body
  )
}

const DialogContent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("relative z-50 grid w-full max-w-lg gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-lg", className)}>
      {children}
    </div>
  )
}

const DialogHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}>
      {children}
    </div>
  )
}

const DialogTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
      {children}
    </h2>
  )
}

const DialogDescription = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <p className={cn("text-sm text-gray-500", className)}>
      {children}
    </p>
  )
}

const DialogFooter = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}>
      {children}
    </div>
  )
}

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter }
