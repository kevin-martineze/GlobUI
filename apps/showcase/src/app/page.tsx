"use client"

import { useState } from "react"
import { Button } from "@glob-ui/button"
import { Input } from "@glob-ui/input"
import { PhoneInput } from "@glob-ui/phone-input"
import { Select } from "@glob-ui/select"
import { MultiSelect } from "@glob-ui/multi-select"

export default function Home() {
  const [framework, setFramework] = useState("react")
  const [ghostFramework, setGhostFramework] = useState("react")
  const [frameworks, setFrameworks] = useState(["react", "vue"])
  const [languages, setLanguages] = useState(["ts"])
  const [multiOptions, setMultiOptions] = useState<string[]>([])

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
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Input</h2>
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Input placeholder="Default input" />
          <Input size="sm" placeholder="Small" />
          <Input size="lg" placeholder="Large" />
          <Input placeholder="Disabled" disabled />
          <Input placeholder="With value" defaultValue="Hello GlobUI" />
        </div>
      </section>

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Phone Input</h2>
        <div className="flex w-full max-w-sm flex-col gap-3">
          <PhoneInput placeholder="Phone number" />
          <PhoneInput size="sm" placeholder="Small" />
          <PhoneInput size="lg" placeholder="Large" />
          <PhoneInput placeholder="Disabled" disabled />
          <PhoneInput country="MX" placeholder="Default MX" />
        </div>
      </section>

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Select</h2>
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Select
            options={[
              { value: "react", label: "React" },
              { value: "vue", label: "Vue" },
              { value: "svelte", label: "Svelte" },
              { value: "solid", label: "Solid" },
            ]}
            value={framework}
            onChange={setFramework}
          />
          <Select
            variant="ghost"
            options={[
              { value: "react", label: "React" },
              { value: "vue", label: "Vue" },
              { value: "svelte", label: "Svelte" },
            ]}
            value={ghostFramework}
            onChange={setGhostFramework}
          />
          <Select
            variant="outline"
            size="sm"
            options={[
              { value: "xs", label: "Extra Small" },
              { value: "sm", label: "Small" },
              { value: "md", label: "Medium" },
            ]}
            value="sm"
            onChange={() => {}}
          />
          <Select
            options={[
              { value: "1", label: "Option 1" },
              { value: "2", label: "Option 2" },
            ]}
            placeholder="Disabled..."
            disabled
          />
        </div>
      </section>

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Multi Select</h2>
        <div className="flex w-full max-w-sm flex-col gap-4">
          <MultiSelect
            options={[
              { value: "react", label: "React" },
              { value: "vue", label: "Vue" },
              { value: "angular", label: "Angular" },
              { value: "svelte", label: "Svelte" },
              { value: "solid", label: "Solid" },
              { value: "qwik", label: "Qwik" },
            ]}
            value={frameworks}
            onChange={setFrameworks}
          />
          <MultiSelect
            size="sm"
            options={[
              { value: "js", label: "JavaScript" },
              { value: "ts", label: "TypeScript" },
              { value: "rust", label: "Rust" },
            ]}
            value={languages}
            onChange={setLanguages}
          />
          <MultiSelect
            options={[
              { value: "1", label: "Option 1" },
              { value: "2", label: "Option 2" },
              { value: "3", label: "Option 3" },
            ]}
            value={multiOptions}
            onChange={setMultiOptions}
            placeholder="Choose frameworks..."
          />
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
