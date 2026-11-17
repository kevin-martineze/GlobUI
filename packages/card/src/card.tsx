import { forwardRef } from "react"
import { cn } from "@glob-ui/utils"
import { CARD_CLASSES, CARD_HEADER_CLASSES, CARD_TITLE_CLASSES, CARD_DESCRIPTION_CLASSES, CARD_CONTENT_CLASSES, CARD_FOOTER_CLASSES } from "@glob-ui/recipes"

export type CardProps = React.HTMLAttributes<HTMLDivElement>

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(CARD_CLASSES, className)}
    {...props}
  />
))
Card.displayName = "Card"

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(CARD_HEADER_CLASSES, className)} {...props} />
))
CardHeader.displayName = "CardHeader"

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading level. Defaults to h3; pick the one that fits the page outline. */
  as?: HeadingTag
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as: Comp = "h3", className, ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn(CARD_TITLE_CLASSES, className)}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn(CARD_DESCRIPTION_CLASSES, className)} {...props} />
  )
)
CardDescription.displayName = "CardDescription"

export type CardContentProps = React.HTMLAttributes<HTMLDivElement>

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(CARD_CONTENT_CLASSES, className)} {...props} />
))
CardContent.displayName = "CardContent"

export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(CARD_FOOTER_CLASSES, className)} {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
