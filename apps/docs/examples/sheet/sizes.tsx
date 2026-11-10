import { Button } from "@glob-ui/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@glob-ui/sheet"

export default function SheetSizes() {
  return (
    <div className="flex flex-wrap gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Sheet key={size}>
          <SheetTrigger asChild>
            <Button variant="outline">{size.toUpperCase()}</Button>
          </SheetTrigger>
          <SheetContent side="left" size={size}>
            <SheetTitle>Size {size}</SheetTitle>
            <SheetDescription>The width follows the size prop (left and right sheets).</SheetDescription>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  )
}
