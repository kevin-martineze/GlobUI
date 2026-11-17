import { forwardRef } from "react"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@glob-ui/utils"
import { alertVariants } from "@glob-ui/recipes"
import { ALERT_ICON_CLASSES, ALERT_ICON_TONE, ALERT_BODY_CLASSES, ALERT_TITLE_CLASSES, ALERT_DESCRIPTION_CLASSES } from "@glob-ui/recipes"

export type AlertVariant = "default" | "info" | "success" | "warning" | "danger"

const iconColor: Record<AlertVariant, string> = ALERT_ICON_TONE

const iconPaths: Record<AlertVariant, React.ReactNode> = {
  default: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </>
  ),
  success: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l3 3 5-6" />
    </>
  ),
  warning: (
    <>
      <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4M12 17h.01" />
    </>
  ),
  danger: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </>
  ),
}

export interface AlertIconProps {
  variant?: AlertVariant
  className?: string
}

/** The variant's icon, coloured. Decorative: hidden from assistive tech. */
function AlertIcon({ variant = "default", className }: AlertIconProps) {
  return (
    <span aria-hidden="true" className={cn(ALERT_ICON_CLASSES, iconColor[variant], className)}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        {iconPaths[variant]}
      </svg>
    </span>
  )
}
AlertIcon.displayName = "AlertIcon"

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /** Replaces the variant's default icon. Pass `null` to hide it. */
  icon?: React.ReactNode
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, children, ...props }, ref) => {
    const v = variant ?? "default"
    // Only urgent variants interrupt screen readers; the rest are polite.
    const role = v === "warning" || v === "danger" ? "alert" : "status"

    return (
      <div ref={ref} role={role} className={cn(alertVariants({ variant, className }))} {...props}>
        {icon === undefined ? (
          <AlertIcon variant={v} />
        ) : (
          icon !== null && (
            <span aria-hidden="true" className={cn(ALERT_ICON_CLASSES, iconColor[v])}>
              {icon}
            </span>
          )
        )}
        <div className={ALERT_BODY_CLASSES}>{children}</div>
      </div>
    )
  }
)
Alert.displayName = "Alert"

export type AlertTitleProps = React.HTMLAttributes<HTMLDivElement>

const AlertTitle = forwardRef<HTMLDivElement, AlertTitleProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(ALERT_TITLE_CLASSES, className)} {...props} />
))
AlertTitle.displayName = "AlertTitle"

export type AlertDescriptionProps = React.HTMLAttributes<HTMLDivElement>

const AlertDescription = forwardRef<HTMLDivElement, AlertDescriptionProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(ALERT_DESCRIPTION_CLASSES, className)} {...props} />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription, AlertIcon, alertVariants }
