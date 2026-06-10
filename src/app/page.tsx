import { Button } from "@/components/ui"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 p-12">
      <h1 className="text-2xl font-semibold">GlobUI</h1>
      <div className="flex flex-wrap gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap items-end gap-4">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
        </Button>
      </div>
      <Button className=""> </Button>
      <Button disabled>Disabled</Button>
    </div>
  )
}
