"use client"

import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
} from "react"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@glob-ui/utils"
import { useControllableState } from "@glob-ui/hooks"
import { Slot, composeRefs } from "@glob-ui/slot"
import { dialogVariants } from "@glob-ui/recipes"
import { lockScroll, shouldRestoreFocus } from "@glob-ui/core"
export { dialogVariants }

interface DialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  contentId: string
  titleId: string
  descriptionId: string
  closeOnOutsideClick: boolean
}

const DialogContext = createContext<DialogContextValue | null>(null)

function useDialogContext(part: string) {
  const ctx = useContext(DialogContext)
  if (!ctx) throw new Error(`${part} must be used inside Dialog, Sheet or AlertDialog`)
  return ctx
}

export interface DialogProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Close when the backdrop is clicked. */
  closeOnOutsideClick?: boolean
  children?: React.ReactNode
}

function Dialog({ open, defaultOpen = false, onOpenChange, closeOnOutsideClick = true, children }: DialogProps) {
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange)
  const baseId = useId()

  return (
    <DialogContext.Provider
      value={{
        open: isOpen,
        setOpen,
        contentId: `${baseId}-content`,
        titleId: `${baseId}-title`,
        descriptionId: `${baseId}-description`,
        closeOnOutsideClick,
      }}
    >
      {children}
    </DialogContext.Provider>
  )
}
Dialog.displayName = "Dialog"

export interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ asChild = false, onClick, ...props }, ref) => {
    const ctx = useDialogContext("DialogTrigger")
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : "button"}
        aria-haspopup="dialog"
        aria-expanded={ctx.open}
        aria-controls={ctx.open ? ctx.contentId : undefined}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          onClick?.(e)
          if (!e.defaultPrevented) ctx.setOpen(true)
        }}
        {...props}
      />
    )
  }
)
DialogTrigger.displayName = "DialogTrigger"

export type DialogContentBaseProps = React.DialogHTMLAttributes<HTMLDialogElement>

/**
 * The modal behaviour of Dialog with no styles and no layout: showModal, the shared scroll lock,
 * Esc, backdrop click (see closeOnOutsideClick), focus return and aria-labelledby/describedby.
 * Build your own modal on the same behaviour. Sheet and AlertDialog are built on it.
 */
const DialogContentBase = forwardRef<HTMLDialogElement, DialogContentBaseProps>(
  ({ className, children, onCancel, onClose, onPointerDown, onClick, ...props }, ref) => {
    const ctx = useDialogContext("DialogContent")
    const { open, setOpen, titleId, descriptionId, closeOnOutsideClick } = ctx
    const innerRef = useRef<HTMLDialogElement>(null)
    const previouslyFocused = useRef<HTMLElement | null>(null)
    const pointerDownOnBackdrop = useRef(false)
    const mergedRef = useMemo(() => composeRefs(ref, innerRef), [ref])
    const hasOwnLabel = props["aria-labelledby"] !== undefined || props["aria-label"] !== undefined
    const hasOwnDescription = props["aria-describedby"] !== undefined

    useEffect(() => {
      const dialog = innerRef.current
      if (!dialog) return
      if (!open) {
        if (dialog.open) dialog.close()
        return
      }
      if (!dialog.open) {
        previouslyFocused.current = document.activeElement as HTMLElement | null
        // Point at Title/Description only if they are rendered, so the references never dangle.
        if (!hasOwnLabel) {
          if (document.getElementById(titleId)) dialog.setAttribute("aria-labelledby", titleId)
          else dialog.removeAttribute("aria-labelledby")
        }
        if (!hasOwnDescription) {
          if (document.getElementById(descriptionId)) dialog.setAttribute("aria-describedby", descriptionId)
          else dialog.removeAttribute("aria-describedby")
        }
        dialog.showModal()
      }
      return lockScroll()
    }, [open, titleId, descriptionId, hasOwnLabel, hasOwnDescription])

    return (
      <dialog
        ref={mergedRef}
        id={ctx.contentId}
        className={cn(className)}
        // Esc: keep React state as the source of truth (controlled dialogs may refuse to close).
        onCancel={(e) => {
          onCancel?.(e)
          e.preventDefault()
          setOpen(false)
        }}
        // Closed by the browser anyway (e.g. a repeated Esc that cannot be cancelled): sync state.
        onClose={(e) => {
          onClose?.(e)
          if (open) setOpen(false)
          if (shouldRestoreFocus(innerRef.current)) previouslyFocused.current?.focus()
        }}
        // A click lands on the <dialog> element itself only over the backdrop: content fills it.
        onPointerDown={(e) => {
          onPointerDown?.(e)
          pointerDownOnBackdrop.current = e.target === e.currentTarget
        }}
        onClick={(e) => {
          onClick?.(e)
          if (e.defaultPrevented) return
          if (closeOnOutsideClick && pointerDownOnBackdrop.current && e.target === e.currentTarget) {
            setOpen(false)
          }
        }}
        {...props}
      >
        {children}
      </dialog>
    )
  }
)
DialogContentBase.displayName = "DialogContentBase"

export type DialogCloseIconProps = React.ButtonHTMLAttributes<HTMLButtonElement>

/** The X button in the top-right corner. Closes the surrounding Dialog, Sheet or AlertDialog. */
const DialogCloseIcon = forwardRef<HTMLButtonElement, DialogCloseIconProps>(({ className, onClick, ...props }, ref) => {
  const ctx = useDialogContext("DialogCloseIcon")
  return (
    <button
      ref={ref}
      type="button"
      aria-label="Close"
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) ctx.setOpen(false)
      }}
      className={cn(
        "absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-glob-sm text-glob-text-secondary transition-colors hover:bg-glob-surface-hover hover:text-glob-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring",
        className
      )}
      {...props}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  )
})
DialogCloseIcon.displayName = "DialogCloseIcon"

export interface DialogContentProps
  extends React.DialogHTMLAttributes<HTMLDialogElement>,
    VariantProps<typeof dialogVariants> {
  /** Shows an X button in the top-right corner. */
  showCloseButton?: boolean
}

const DialogContent = forwardRef<HTMLDialogElement, DialogContentProps>(
  ({ className, size, showCloseButton = true, children, ...props }, ref) => (
    <DialogContentBase ref={ref} className={cn(dialogVariants({ size, className }))} {...props}>
      <div className="relative flex max-h-[calc(100dvh-2rem)] flex-col gap-4 overflow-y-auto p-6">
        {children}
        {showCloseButton && <DialogCloseIcon />}
      </div>
    </DialogContentBase>
  )
)
DialogContent.displayName = "DialogContent"

export type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement>

const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-1.5 pr-8", className)} {...props} />
))
DialogHeader.displayName = "DialogHeader"

export type DialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>

const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(({ className, ...props }, ref) => {
  const ctx = useDialogContext("DialogTitle")
  return (
    <h2
      ref={ref}
      id={ctx.titleId}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
})
DialogTitle.displayName = "DialogTitle"

export type DialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>

const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, ...props }, ref) => {
    const ctx = useDialogContext("DialogDescription")
    return (
      <p ref={ref} id={ctx.descriptionId} className={cn("text-sm text-glob-text-secondary", className)} {...props} />
    )
  }
)
DialogDescription.displayName = "DialogDescription"

export type DialogFooterProps = React.HTMLAttributes<HTMLDivElement>

const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
))
DialogFooter.displayName = "DialogFooter"

export interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(({ asChild = false, onClick, ...props }, ref) => {
  const ctx = useDialogContext("DialogClose")
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : "button"}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e)
        if (!e.defaultPrevented) ctx.setOpen(false)
      }}
      {...props}
    />
  )
})
DialogClose.displayName = "DialogClose"

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogContentBase,
  DialogCloseIcon,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
}
