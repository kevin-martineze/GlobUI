import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@glob-ui/accordion"

export default function AccordionSingle() {
  return (
    <Accordion type="single" collapsible defaultValue="shipping" className="w-full max-w-md">
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
  )
}
