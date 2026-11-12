"use client"

import { Children, cloneElement, forwardRef, isValidElement, useState } from "react"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@glob-ui/utils"
import { avatarVariants } from "@glob-ui/recipes"

type Status = "loading" | "loaded" | "error"

function getInitials(name?: string) {
  const words = name?.trim().split(/\s+/).filter(Boolean) ?? []
  if (words.length === 0) return null
  const first = words[0][0]
  const last = words.length > 1 ? words[words.length - 1][0] : ""
  return (first + last).toUpperCase()
}

export interface AvatarProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  /** Shown while the image loads or after it fails. Defaults to initials from `alt`. */
  fallback?: React.ReactNode
}

const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ src, alt, fallback, size, shape, className, ...props }, ref) => {
    const [status, setStatus] = useState<Status>(src ? "loading" : "error")
    const [prevSrc, setPrevSrc] = useState(src)

    // Reset when src changes (adjusting state during render, not in an effect).
    if (src !== prevSrc) {
      setPrevSrc(src)
      setStatus(src ? "loading" : "error")
    }

    const loaded = status === "loaded"
    const fallbackContent = fallback ?? getInitials(alt) ?? (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3/5 w-3/5">
        <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6z" />
      </svg>
    )

    return (
      <span
        ref={ref}
        // While the fallback shows, the wrapper carries the name; the img is hidden from AT.
        role={!loaded && alt ? "img" : undefined}
        aria-label={!loaded && alt ? alt : undefined}
        className={cn(avatarVariants({ size, shape, className }))}
        {...props}
      >
        {src && status !== "error" && (
          // eslint-disable-next-line @next/next/no-img-element -- framework-agnostic library
          <img
            key={src}
            src={src}
            alt={loaded ? (alt ?? "") : ""}
            aria-hidden={loaded ? undefined : true}
            // The image can finish before hydration attaches onLoad; check it on mount.
            ref={(img) => {
              if (img?.complete) setStatus(img.naturalWidth > 0 ? "loaded" : "error")
            }}
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("error")}
            className={cn("absolute inset-0 h-full w-full object-cover", !loaded && "opacity-0")}
          />
        )}
        {!loaded && (
          <span aria-hidden="true" className="flex h-full w-full items-center justify-center">
            {fallbackContent}
          </span>
        )}
      </span>
    )
  }
)
Avatar.displayName = "Avatar"

const overlap = {
  sm: "-space-x-2",
  md: "-space-x-2",
  lg: "-space-x-3",
  xl: "-space-x-4",
}

export interface AvatarGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  /** Avatars shown before collapsing the rest into "+N". */
  max?: number
}

const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ max, size, shape, className, children, ...props }, ref) => {
    const items = Children.toArray(children).filter(isValidElement<AvatarProps>)
    const visible = max !== undefined ? items.slice(0, Math.max(0, max)) : items
    const extra = items.length - visible.length
    const s = size ?? "md"

    return (
      <div ref={ref} role="group" className={cn("flex items-center", overlap[s], className)} {...props}>
        {visible.map((child) =>
          cloneElement(child, {
            size: child.props.size ?? size,
            shape: child.props.shape ?? shape,
            className: cn("ring-2 ring-glob-surface", child.props.className),
          })
        )}
        {extra > 0 && (
          <span
            role="img"
            aria-label={`${extra} more`}
            className={cn(avatarVariants({ size, shape }), "ring-2 ring-glob-surface")}
          >
            <span aria-hidden="true">+{extra}</span>
          </span>
        )}
      </div>
    )
  }
)
AvatarGroup.displayName = "AvatarGroup"

export { Avatar, AvatarGroup, avatarVariants }
