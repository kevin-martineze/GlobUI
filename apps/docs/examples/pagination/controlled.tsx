"use client"

import { useState } from "react"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, getPageRange } from "@glob-ui/pagination"

const pageCount = 12

export default function PaginationControlled() {
  const [current, setCurrent] = useState(1)
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious asChild disabled={current === 1}>
              <button type="button" disabled={current === 1} onClick={() => setCurrent(current - 1)}>
                Previous
              </button>
            </PaginationPrevious>
          </PaginationItem>
          {getPageRange({ page: current, pageCount }).map((item, index) =>
            item === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink asChild isActive={item === current}>
                  <button type="button" onClick={() => setCurrent(item)}>
                    {item}
                  </button>
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext asChild disabled={current === pageCount}>
              <button type="button" disabled={current === pageCount} onClick={() => setCurrent(current + 1)}>
                Next
              </button>
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p className="text-sm text-glob-text-secondary">
        Page {current} of {pageCount}
      </p>
    </div>
  )
}
