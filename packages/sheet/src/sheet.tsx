"use client"

import { forwardRef } from "react"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@glob-ui/utils"
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogContentBase,
  DialogCloseIcon,
  type DialogContentBaseProps,
  type DialogFooterProps,
} from "@glob-ui/dialog"
import { sheetVariants } from "@glob-ui/recipes"

// A Sheet is a Dialog: same context, same scroll lock, Esc, backdrop and focus return.
export const Sheet = Dialog
export const SheetTrigger = DialogTrigger
export const SheetClose = DialogClose
export const SheetHeader = DialogHeader
export const SheetTitle = DialogTitle
export const SheetDescription = DialogDescription

export type SheetProps = React.ComponentProps<typeof Dialog>
export type SheetTriggerProps = React.ComponentProps<typeof DialogTrigger>
export type SheetCloseProps = React.ComponentProps<typeof DialogClose>
export type SheetHeaderProps = React.ComponentProps<typeof DialogHeader>
export type SheetTitleProps = React.ComponentProps<typeof DialogTitle>
export type SheetDescriptionProps = React.ComponentProps<typeof DialogDescription>
export type SheetFooterProps = DialogFooterProps

export interface SheetContentProps extends DialogContentBaseProps, VariantProps<typeof sheetVariants> {
  /** Shows an X button in the top-right corner. */
  showCloseButton?: boolean
}

const SheetContent = forwardRef<HTMLDialogElement, SheetContentProps>(
  ({ className, side, size, showCloseButton = true, children, ...props }, ref) => (
    <DialogContentBase ref={ref} className={cn(sheetVariants({ side, size, className }))} {...props}>
      <div className="relative flex h-full flex-col gap-4 overflow-y-auto p-6">
        {children}
        {showCloseButton && <DialogCloseIcon />}
      </div>
    </DialogContentBase>
  )
)
SheetContent.displayName = "SheetContent"

const SheetFooter = forwardRef<HTMLDivElement, SheetFooterProps>(({ className, ...props }, ref) => (
  <DialogFooter ref={ref} className={cn("mt-auto", className)} {...props} />
))
SheetFooter.displayName = "SheetFooter"

export { SheetContent, SheetFooter, sheetVariants }
