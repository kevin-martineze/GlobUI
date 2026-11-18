// The React render adapter for the phase 10d-3 contracts: navigation.
import { useState } from "react"
import { render } from "vitest-browser-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@glob-ui/accordion"
import {
  getPageRange,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@glob-ui/pagination"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@glob-ui/tabs"
import { navigationParityContract } from "./navigation-parity.contract"
import { navigationContract } from "./navigation.contract"
import type { NavigationAdapter } from "./types"

/** The parity gallery. The Svelte gallery (svelte/NavigationGallery.svelte) renders the same components and props. */
function NavigationGallery() {
  return (
    <div data-testid="navigation-gallery">
      <Tabs defaultValue="one">
        <TabsList aria-label="Underline tabs">
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two" disabled>
            Two
          </TabsTrigger>
        </TabsList>
        <TabsContent value="one">First panel</TabsContent>
        <TabsContent value="two">Second panel</TabsContent>
      </Tabs>
      <Tabs defaultValue="b" variant="pill" orientation="vertical">
        <TabsList aria-label="Pill tabs">
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Panel A</TabsContent>
        <TabsContent value="b">Panel B</TabsContent>
      </Tabs>
      <Accordion type="single" defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>Open item</AccordionTrigger>
          <AccordionContent>Open content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger headingLevel="h4">Closed item</AccordionTrigger>
          <AccordionContent>Closed content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="c" disabled>
          <AccordionTrigger>Disabled item</AccordionTrigger>
          <AccordionContent>Disabled content</AccordionContent>
        </AccordionItem>
      </Accordion>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious disabled href="/p/0" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/p/1" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/p/2">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="/p/2" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

function ControlledPagination({ pageCount, onPage }: { pageCount: number; onPage?: (page: number) => void }) {
  const [current, setCurrent] = useState(1)
  const go = (next: number) => {
    setCurrent(next)
    onPage?.(next)
  }
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious asChild disabled={current === 1}>
            <button type="button" disabled={current === 1} onClick={() => go(current - 1)} />
          </PaginationPrevious>
        </PaginationItem>
        {getPageRange({ page: current, pageCount }).map((item, i) =>
          item === "ellipsis" ? (
            <PaginationItem key={`e${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink asChild isActive={item === current}>
                <button type="button" onClick={() => go(item)}>
                  {item}
                </button>
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext asChild disabled={current === pageCount}>
            <button type="button" disabled={current === pageCount} onClick={() => go(current + 1)}>
              Next
            </button>
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

const react: NavigationAdapter = {
  name: "react",
  async navigationGallery() {
    await render(<NavigationGallery />)
  },
  async tabs(f) {
    await render(
      <Tabs value={f.value} defaultValue={f.defaultValue} orientation={f.orientation} onValueChange={f.onValueChange}>
        <TabsList aria-label="Settings">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password" disabled>
            Password
          </TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account panel</TabsContent>
        <TabsContent value="billing">Billing panel</TabsContent>
        <TabsContent value="team">Team panel</TabsContent>
      </Tabs>
    )
  },
  async accordion(f) {
    const items = (
      <>
        <AccordionItem value="a">
          <AccordionTrigger>Shipping</AccordionTrigger>
          <AccordionContent>Ships in 2 days.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Returns</AccordionTrigger>
          <AccordionContent>30 days.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="c" disabled>
          <AccordionTrigger>Disabled</AccordionTrigger>
          <AccordionContent>Hidden.</AccordionContent>
        </AccordionItem>
      </>
    )
    await render(
      f.type === "multiple" ? (
        <Accordion type="multiple" onValueChange={f.onValueChange}>
          {items}
        </Accordion>
      ) : (
        <Accordion type="single" collapsible={f.collapsible} onValueChange={f.onValueChange}>
          {items}
        </Accordion>
      )
    )
  },
  async paginationLinks() {
    await render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="/a" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/a" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="/b" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  },
  async paginationDisabledPrevious() {
    await render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious disabled href="/prev" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  },
  async paginationControlled(f) {
    await render(<ControlledPagination {...f} />)
  },
}

navigationParityContract(react)
navigationContract(react)
