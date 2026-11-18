<script lang="ts">
  import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@glob-ui/svelte/accordion"
</script>

<Accordion type="single" collapsible defaultValue="shipping" class="w-full max-w-md">
  <AccordionItem value="shipping">
    <AccordionTrigger>Shipping</AccordionTrigger>
    <AccordionContent>Orders ship within 2 business days.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="returns">
    <AccordionTrigger>Returns</AccordionTrigger>
    <AccordionContent>You can return items within 30 days.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="disabled" disabled>
    <AccordionTrigger>Not available</AccordionTrigger>
    <AccordionContent>Hidden.</AccordionContent>
  </AccordionItem>
</Accordion>
