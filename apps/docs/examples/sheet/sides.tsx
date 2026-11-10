import { Button } from "@glob-ui/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@glob-ui/sheet"

const sides = ["right", "left", "top", "bottom"] as const

export default function SheetSides() {
  return (
    <div className="flex flex-wrap gap-3">
      {sides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline" className="capitalize">
              {side}
            </Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetTitle className="capitalize">{side} sheet</SheetTitle>
            <SheetDescription>It slides in from the {side}.</SheetDescription>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  )
}
