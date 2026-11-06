"use client"

import { useState } from "react"
import { Button } from "@glob-ui/button"
import { Input } from "@glob-ui/input"
import { PhoneInput } from "@glob-ui/phone-input"
import { Select } from "@glob-ui/select"
import { MultiSelect } from "@glob-ui/multi-select"
import { Label } from "@glob-ui/label"
import { Textarea } from "@glob-ui/textarea"
import { Checkbox } from "@glob-ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@glob-ui/radio-group"
import { Switch } from "@glob-ui/switch"
import { Field } from "@glob-ui/field"

const toppings = ["cheese", "ham", "pineapple"]

export default function Home() {
  const [selectedToppings, setSelectedToppings] = useState(["cheese"])
  const [plan, setPlan] = useState("pro")
  const [notifications, setNotifications] = useState(true)
  const [email, setEmail] = useState("")
  const [country, setCountry] = useState("")
  const allToppings = selectedToppings.length === toppings.length
  const someToppings = selectedToppings.length > 0 && !allToppings
  const emailError = email.length > 0 && !email.includes("@") ? "Enter a valid email address." : undefined
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
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Label</h2>
        <div className="flex flex-wrap items-center gap-6">
          <Label size="sm">Small</Label>
          <Label>Medium</Label>
          <Label size="lg">Large</Label>
          <Label required>Required</Label>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Textarea</h2>
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Textarea placeholder="Default (resize vertical)" />
          <Textarea size="sm" placeholder="Small" />
          <Textarea size="lg" resize="both" placeholder="Large, resize both" />
          <Textarea resize="none" placeholder="Resize none" />
          <Textarea placeholder="Disabled" disabled />
          <Textarea aria-invalid placeholder="Invalid" />
        </div>
      </section>

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Checkbox</h2>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-6">
            <Checkbox size="sm" label="Small" defaultChecked />
            <Checkbox label="Medium" defaultChecked />
            <Checkbox size="lg" label="Large" defaultChecked />
            <Checkbox aria-label="No label" />
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Checkbox label="Disabled" disabled />
            <Checkbox label="Disabled checked" disabled defaultChecked />
            <Checkbox label="Invalid" aria-invalid />
          </div>
          <div className="flex flex-col gap-2 rounded-glob-md border border-glob-border p-3">
            <Checkbox
              label="All toppings (controlled, indeterminate)"
              checked={allToppings}
              indeterminate={someToppings}
              onChange={() => setSelectedToppings(allToppings ? [] : toppings)}
            />
            <div className="flex flex-col gap-2 pl-7">
              {toppings.map((t) => (
                <Checkbox
                  key={t}
                  label={t}
                  checked={selectedToppings.includes(t)}
                  onChange={(e) =>
                    setSelectedToppings((prev) =>
                      e.target.checked ? [...prev, t] : prev.filter((x) => x !== t)
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Radio Group</h2>
        <div className="flex flex-col gap-6">
          <RadioGroup value={plan} onValueChange={setPlan} aria-label="Plan (controlled)">
            <RadioGroupItem value="free" label="Free" />
            <RadioGroupItem value="pro" label="Pro" />
            <RadioGroupItem value="team" label="Team" disabled />
          </RadioGroup>
          <p className="text-xs text-glob-text-secondary">Selected plan: {plan}</p>
          <RadioGroup defaultValue="md" orientation="horizontal" size="sm" aria-label="Size (uncontrolled)">
            <RadioGroupItem value="sm" label="Small" />
            <RadioGroupItem value="md" label="Medium" />
            <RadioGroupItem value="lg" label="Large" />
          </RadioGroup>
          <RadioGroup defaultValue="a" orientation="horizontal" size="lg" aria-label="Large">
            <RadioGroupItem value="a" label="Large A" />
            <RadioGroupItem value="b" label="Large B" />
          </RadioGroup>
          <RadioGroup defaultValue="x" orientation="horizontal" disabled aria-label="Disabled">
            <RadioGroupItem value="x" label="Disabled X" />
            <RadioGroupItem value="y" label="Disabled Y" />
          </RadioGroup>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Switch</h2>
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <Switch size="sm" defaultChecked aria-label="Small" />
            <Switch defaultChecked aria-label="Medium" />
            <Switch size="lg" defaultChecked aria-label="Large" />
            <Switch aria-label="Off" />
            <Switch disabled aria-label="Disabled" />
            <Switch disabled defaultChecked aria-label="Disabled on" />
            <Switch aria-invalid aria-label="Invalid" />
          </div>
          <div className="flex items-center gap-2">
            <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
            <Label htmlFor="notifications">Notifications {notifications ? "on" : "off"} (controlled)</Label>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Field</h2>
        <div className="flex w-full max-w-sm flex-col gap-5">
          <Field
            label="Email"
            description="Type something without @ to see the error."
            error={emailError}
            required
          >
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field label="Bio" description="Max 200 characters." size="sm">
            <Textarea size="sm" placeholder="Tell us about you" />
          </Field>
          <Field label="Country" error={country ? undefined : "Pick a country."} required>
            <Select
              options={[
                { value: "mx", label: "Mexico" },
                { value: "co", label: "Colombia" },
                { value: "ar", label: "Argentina" },
              ]}
              value={country}
              onChange={setCountry}
              placeholder="Select a country..."
            />
          </Field>
          <Field label="Plan" description="Labelled via aria-labelledby." error="Choose a paid plan.">
            <RadioGroup defaultValue="free" orientation="horizontal">
              <RadioGroupItem value="free" label="Free" />
              <RadioGroupItem value="pro" label="Pro" />
            </RadioGroup>
          </Field>
          <Field label="Disabled" size="lg">
            <Input size="lg" placeholder="Disabled" disabled />
          </Field>
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
