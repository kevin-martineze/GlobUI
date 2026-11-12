import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// tailwind-merge only knows the default radius/shadow scales. Without this, "rounded-glob-md"
// and a consumer's "rounded-full" both survive and the token class can win.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: ["glob-sm", "glob-md", "glob-lg"],
      shadow: ["glob-sm", "glob-md"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// Moved to @glob-ui/core in 0.4.0; re-exported so existing imports keep working.
export { normalizeText, matchesSearch } from "@glob-ui/core"
