"use client"

import { forwardRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
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

const sheetVariants = cva(
  [
    // Pinned to its edge: the native dialog margin and max sizes are reset here, the side adds the edge.
    "m-0 h-full max-h-none w-[calc(100%-3rem)] max-w-none overflow-visible rounded-none border-glob-border bg-glob-surface p-0 text-glob-text shadow-glob-md",
    // Slide in from its edge. @starting-style sets the start; transition-discrete keeps display alive on exit.
    "transition-[translate,overlay,display] transition-discrete duration-300 ease-out",
    "backdrop:bg-glob-overlay backdrop:opacity-0 backdrop:transition-[opacity,overlay,display] backdrop:transition-discrete backdrop:duration-200",
    "open:backdrop:opacity-100 starting:open:backdrop:opacity-0",
    "motion-reduce:transition-none motion-reduce:backdrop:transition-none",
  ],
  {
    variants: {
      side: {
        right: "border-l inset-y-0 left-auto right-0 translate-x-full open:translate-x-0 starting:open:translate-x-full",
        left: "border-r inset-y-0 left-0 right-auto -translate-x-full open:translate-x-0 starting:open:-translate-x-full",
        top: "border-b inset-x-0 top-0 bottom-auto h-auto max-h-[85dvh] w-full -translate-y-full open:translate-y-0 starting:open:-translate-y-full",
        bottom: "border-t inset-x-0 top-auto bottom-0 h-auto max-h-[85dvh] w-full translate-y-full open:translate-y-0 starting:open:translate-y-full",
      },
      // Only applies to left and right (see compoundVariants): top and bottom are full width.
      size: {
        sm: "",
        md: "",
        lg: "",
      },
    },
    compoundVariants: [
      { side: ["left", "right"], size: "sm", className: "max-w-xs" },
      { side: ["left", "right"], size: "md", className: "max-w-sm" },
      { side: ["left", "right"], size: "lg", className: "max-w-md" },
    ],
    defaultVariants: {
      side: "right",
      size: "md",
    },
  }
)

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
