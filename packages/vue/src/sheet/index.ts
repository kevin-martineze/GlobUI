// A Sheet is a Dialog: same context, same scroll lock, Escape, backdrop and focus return.
export {
  Dialog as Sheet,
  DialogTrigger as SheetTrigger,
  DialogClose as SheetClose,
  DialogHeader as SheetHeader,
  DialogTitle as SheetTitle,
  DialogDescription as SheetDescription,
} from "../dialog"
export { default as SheetContent } from "./SheetContent.vue"
export { default as SheetFooter } from "./SheetFooter.vue"
export { sheetVariants } from "@glob-ui/recipes"
