import { Children, cloneElement, forwardRef, isValidElement, useMemo } from "react"
import { cn } from "@glob-ui/utils"

type AnyProps = Record<string, unknown>
type Handler = (...args: unknown[]) => unknown

/** Returns one callback ref that writes `node` into every ref passed. */
function composeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.RefObject<T | null>).current = node
    }
  }
}

function isPrevented(event: unknown) {
  return typeof event === "object" && event !== null && (event as { defaultPrevented?: boolean }).defaultPrevented === true
}

/**
 * Merges slot props with child props. The child wins on plain props.
 * className: cn(slot, child). style: shallow merge, child wins.
 * on* handlers: child runs first; the slot handler runs unless the child called preventDefault().
 */
function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...slotProps }
  for (const key of Object.keys(childProps)) {
    const slotValue = slotProps[key]
    const childValue = childProps[key]
    if (/^on[A-Z]/.test(key) && typeof slotValue === "function" && typeof childValue === "function") {
      merged[key] = (...args: unknown[]) => {
        const result = (childValue as Handler)(...args)
        if (!isPrevented(args[0])) (slotValue as Handler)(...args)
        return result
      }
    } else if (key === "className") {
      merged[key] = cn(slotValue as string, childValue as string)
    } else if (key === "style") {
      merged[key] = { ...(slotValue as object), ...(childValue as object) }
    } else if (childValue !== undefined) {
      merged[key] = childValue
    }
  }
  return merged
}

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

/** Renders its single child element with the Slot's props, className, handlers and ref merged in. */
const Slot = forwardRef<HTMLElement, SlotProps>(({ children, ...slotProps }, forwardedRef) => {
  const child = Children.only(children)
  const childProps = (isValidElement(child) ? child.props : {}) as AnyProps
  // React 19: ref is a regular prop on the element.
  const childRef = childProps.ref as React.Ref<HTMLElement> | undefined

  // Only build a callback when both exist, so server-rendered markup never gets a function ref.
  const ref = useMemo(
    () => (forwardedRef && childRef ? composeRefs(forwardedRef, childRef) : (forwardedRef ?? childRef)),
    [forwardedRef, childRef]
  )

  if (!isValidElement(child)) return null
  return cloneElement(child, { ...mergeProps(slotProps, childProps), ref } as AnyProps)
})
Slot.displayName = "Slot"

export { Slot, composeRefs, mergeProps }
