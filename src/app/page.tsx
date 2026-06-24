import { Button } from "@/components/ui"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-12 p-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-glob-text">GlobUI</h1>
        <p className="mt-2 text-glob-text-secondary">A component library for React</p>
      </div>

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Sizes</h2>
        <div className="flex flex-wrap items-end gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
          </Button>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">States</h2>
        <div className="flex flex-wrap gap-4">
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>Disabled</Button>
        </div>
      </section>
    </div>
  )
}
