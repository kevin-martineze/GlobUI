<script lang="ts">
  // The class-parity gallery for the 10d-3 contracts. It renders the same components and props as the React gallery
  // (react-navigation.browser.test.tsx).
  import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../packages/svelte/src/accordion"
  import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "../../../packages/svelte/src/pagination"
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../packages/svelte/src/tabs"
</script>

<div data-testid="navigation-gallery">
  <Tabs defaultValue="one">
    <TabsList aria-label="Underline tabs">
      <TabsTrigger value="one">One</TabsTrigger>
      <TabsTrigger value="two" disabled>Two</TabsTrigger>
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
      <PaginationItem><PaginationPrevious disabled href="/p/0" /></PaginationItem>
      <PaginationItem><PaginationLink href="/p/1" isActive>1</PaginationLink></PaginationItem>
      <PaginationItem><PaginationLink href="/p/2">2</PaginationLink></PaginationItem>
      <PaginationItem><PaginationEllipsis /></PaginationItem>
      <PaginationItem><PaginationNext href="/p/2" /></PaginationItem>
    </PaginationContent>
  </Pagination>
</div>
