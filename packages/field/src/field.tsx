import { Children, cloneElement, forwardRef, isValidElement, useId } from "react"
import { cn } from "@glob-ui/utils"
import { Label } from "@glob-ui/label"
import { CONTROL_TEXT_SIZE, FIELD_CLASSES, FIELD_DESCRIPTION_CLASSES, FIELD_ERROR_CLASSES } from "@glob-ui/recipes"

type Size = "sm" | "md" | "lg"

const textSize: Record<Size, string> = CONTROL_TEXT_SIZE

interface ControlProps {
  id?: string
  "aria-describedby"?: string
  "aria-labelledby"?: string
  "aria-invalid"?: React.AriaAttributes["aria-invalid"]
}

export interface FieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  label?: React.ReactNode
  description?: React.ReactNode
  /** When truthy, marks the control invalid. The description stays visible. */
  error?: React.ReactNode
  /** Shows the asterisk only. Put `required` on the control too, for validation and screen readers. */
  required?: boolean
  size?: Size
  /** One form control. Field injects id, aria-describedby, aria-labelledby and aria-invalid into it. */
  children: React.ReactElement
}

const Field = forwardRef<HTMLDivElement, FieldProps>(
  ({ label, description, error, required, size = "md", className, children, ...props }, ref) => {
    const baseId = useId()
    const child = Children.only(children)
    const childProps: ControlProps = isValidElement<ControlProps>(child) ? child.props : {}

    const controlId = childProps.id ?? `${baseId}-control`
    const labelId = `${baseId}-label`
    const descriptionId = `${baseId}-description`
    const errorId = `${baseId}-error`
    const hasError = Boolean(error)

    const describedBy =
      [childProps["aria-describedby"], description ? descriptionId : null, hasError ? errorId : null]
        .filter(Boolean)
        .join(" ") || undefined

    const labelledBy =
      [childProps["aria-labelledby"], label ? labelId : null].filter(Boolean).join(" ") || undefined

    const control = isValidElement<ControlProps>(child)
      ? cloneElement(child, {
          id: controlId,
          "aria-describedby": describedBy,
          "aria-labelledby": labelledBy,
          "aria-invalid": hasError ? true : childProps["aria-invalid"],
        })
      : child

    return (
      <div ref={ref} className={cn(FIELD_CLASSES, className)} {...props}>
        {label && (
          <Label id={labelId} htmlFor={controlId} size={size} required={required}>
            {label}
          </Label>
        )}
        {control}
        {description && (
          <p id={descriptionId} className={cn(FIELD_DESCRIPTION_CLASSES, textSize[size])}>
            {description}
          </p>
        )}
        {hasError && (
          <p id={errorId} className={cn(FIELD_ERROR_CLASSES, textSize[size])}>
            {error}
          </p>
        )}
      </div>
    )
  }
)
Field.displayName = "Field"

export { Field }
