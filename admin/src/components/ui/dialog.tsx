import * as React from "react"
import { X } from "lucide-react"

const Dialog = ({ open, onOpenChange, children }: { open: boolean, onOpenChange: (open: boolean) => void, children: React.ReactNode }) => {
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative z-50">
        {children}
      </div>
    </div>
  )
}

const DialogContent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6 ${className || ''}`}>
      {children}
    </div>
  )
}

const DialogHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`flex flex-col space-y-1.5 ${className || ''}`}>
      {children}
    </div>
  )
}

const DialogTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <h2 className={`tracking-tight ${className || ''}`}>
      {children}
    </h2>
  )
}

const DialogDescription = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <p className={`text-sm text-gray-500 ${className || ''}`}>
      {children}
    </p>
  )
}

const DialogFooter = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`flex justify-end space-x-2 mt-6 ${className || ''}`}>
      {children}
    </div>
  )
}

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter }
