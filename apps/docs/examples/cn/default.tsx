import { cn } from "@glob-ui/utils"

// Later classes win. Glob radius and shadow tokens are merged as well as the default scale.
export default function CnDefault() {
  const merged = cn("rounded-glob-md p-2 text-sm", "rounded-full p-4")
  return (
    <code className="rounded bg-fd-muted px-2 py-1 text-sm">
      cn(&quot;rounded-glob-md p-2 text-sm&quot;, &quot;rounded-full p-4&quot;) → &quot;{merged}&quot;
    </code>
  )
}
