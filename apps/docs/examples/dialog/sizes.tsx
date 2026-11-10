import { Button } from "@glob-ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@glob-ui/dialog"

export default function DialogSizes() {
  return (
    <div className="flex flex-wrap gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Dialog key={size}>
          <DialogTrigger asChild>
            <Button variant="outline">{size.toUpperCase()}</Button>
          </DialogTrigger>
          <DialogContent size={size}>
            <DialogTitle>Size {size}</DialogTitle>
            <DialogDescription>The panel width follows the size prop.</DialogDescription>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}
