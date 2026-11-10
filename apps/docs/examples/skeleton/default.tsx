import { Skeleton } from "@glob-ui/skeleton"

export default function SkeletonDefault() {
  return (
    <div className="flex w-full max-w-sm items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}
