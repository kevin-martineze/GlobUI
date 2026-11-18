// The docs examples render Next's Link; in the browser tests it is a plain anchor, which is what Link renders.
import type { AnchorHTMLAttributes } from "react"

export default function Link(props: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return <a {...props} />
}
