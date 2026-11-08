import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@glob-ui/accordion"

export default function AccordionMultiple() {
  return (
    <Accordion type="multiple" defaultValue={["a", "b"]} className="w-full max-w-md">
      <AccordionItem value="a">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It follows the WAI-ARIA accordion pattern.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>Yes, with a grid-rows transition that respects reduced motion.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
