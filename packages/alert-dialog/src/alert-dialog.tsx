"use client"

import { forwardRef } from "react"
import { cn } from "@glob-ui/utils"
import { buttonVariants } from "@glob-ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogContentBase,
  dialogVariants,
  type DialogContentBaseProps,
  type DialogProps,
  type DialogCloseProps,
  type DialogFooterProps,
} from "@glob-ui/dialog"

export type AlertDialogProps = Omit<DialogProps, "closeOnOutsideClick">

/**
 * A Dialog for a decision the user must make. The backdrop does not close it, so the user answers
 * with Cancel or the action (Escape still closes it, as the WAI-ARIA alertdialog pattern allows).
 */
function AlertDialog(props: AlertDialogProps) {
  return <Dialog {...props} closeOnOutsideClick={false} />
}
AlertDialog.displayName = "AlertDialog"

export const AlertDialogTrigger = DialogTrigger
export const AlertDialogHeader = DialogHeader
export const AlertDialogTitle = DialogTitle
export const AlertDialogDescription = DialogDescription

export type AlertDialogTriggerProps = React.ComponentProps<typeof DialogTrigger>
export type AlertDialogHeaderProps = React.ComponentProps<typeof DialogHeader>
export type AlertDialogTitleProps = React.ComponentProps<typeof DialogTitle>
export type AlertDialogDescriptionProps = React.ComponentProps<typeof DialogDescription>
export type AlertDialogFooterProps = DialogFooterProps

export type AlertDialogContentProps = DialogContentBaseProps

const AlertDialogContent = forwardRef<HTMLDialogElement, AlertDialogContentProps>(
  ({ className, children, ...props }, ref) => (
    <DialogContentBase
      ref={ref}
      role="alertdialog"
      className={cn(dialogVariants({ size: "sm", className }))}
      {...props}
    >
      <div className="relative flex max-h-[calc(100dvh-2rem)] flex-col gap-4 overflow-y-auto p-6">{children}</div>
    </DialogContentBase>
  )
)
AlertDialogContent.displayName = "AlertDialogContent"

const AlertDialogFooter = forwardRef<HTMLDivElement, AlertDialogFooterProps>(({ className, ...props }, ref) => (
  <DialogFooter ref={ref} className={className} {...props} />
))
AlertDialogFooter.displayName = "AlertDialogFooter"

export type AlertDialogCancelProps = DialogCloseProps

/** The safe option. It takes the initial focus. */
const AlertDialogCancel = forwardRef<HTMLButtonElement, AlertDialogCancelProps>(({ className, ...props }, ref) => (
  <DialogClose
    ref={ref}
    autoFocus
    className={cn(buttonVariants({ variant: "outline" }), className)}
    {...props}
  />
))
AlertDialogCancel.displayName = "AlertDialogCancel"

export interface AlertDialogActionProps extends DialogCloseProps {
  /** `danger` for destructive actions (delete, remove, revoke). */
  variant?: "primary" | "danger"
}

/**
 * Confirms the decision and closes the dialog. Call `event.preventDefault()` in `onClick` to keep it
 * open, for example while an async action runs.
 */
const AlertDialogAction = forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <DialogClose
      ref={ref}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  )
)
AlertDialogAction.displayName = "AlertDialogAction"

export { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogCancel, AlertDialogAction }
