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
import { Segmented } from "@glob-ui/segmented"
import { Field } from "@glob-ui/field"
import { Badge } from "@glob-ui/badge"
import { Spinner } from "@glob-ui/spinner"
import { Alert, AlertTitle, AlertDescription } from "@glob-ui/alert"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@glob-ui/card"
import { Avatar, AvatarGroup } from "@glob-ui/avatar"
import { Skeleton } from "@glob-ui/skeleton"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@glob-ui/dialog"
import { Popover, PopoverTrigger, PopoverContent } from "@glob-ui/popover"
import { Tooltip } from "@glob-ui/tooltip"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@glob-ui/tabs"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@glob-ui/accordion"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@glob-ui/dropdown-menu"
import { toast } from "@glob-ui/toast"
import { ThemeToggle } from "./theme-toggle"

const toppings = ["cheese", "ham", "pineapple"]
const badgeVariants = ["default", "primary", "secondary", "outline", "success", "warning", "danger", "info"] as const
const team = ["Ana Torres", "Luis Gómez", "Sara Díaz", "Iván Ruiz", "Eva Mora", "Leo Paz"]

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
  const [saving, setSaving] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmLog, setConfirmLog] = useState("none yet")
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [tab, setTab] = useState("account")
  const [faq, setFaq] = useState<string[]>(["shipping"])
  const [avatarSrc, setAvatarSrc] = useState("/avatars/1.svg")
  const [skeletonLoading, setSkeletonLoading] = useState(true)
  const [ghostFramework, setGhostFramework] = useState("react")
  const [frameworks, setFrameworks] = useState(["react", "vue"])
  const [languages, setLanguages] = useState(["ts"])
  const [multiOptions, setMultiOptions] = useState<string[]>([])
  const [menuLog, setMenuLog] = useState("none yet")
  const [statusBar, setStatusBar] = useState(true)
  const [activityBar, setActivityBar] = useState(false)
  const [menuTheme, setMenuTheme] = useState("system")
  const [formLog, setFormLog] = useState("none yet")

  return (
    <div className="flex flex-col items-center justify-center gap-12 p-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-glob-text">GlobUI</h1>
        <p className="mt-2 text-glob-text-secondary">A component library for React</p>
        <div className="mt-4 flex justify-center">
          <ThemeToggle />
        </div>
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
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <a href="#dialog">asChild link</a>
          </Button>
          <Button asChild variant="outline" disabled>
            <a href="#dialog">Disabled link (aria-disabled)</a>
          </Button>
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
          <Field label="Terms" description="Field label + Checkbox label are both in the accessible name.">
            <Checkbox label="I accept the terms" />
          </Field>
          <Field label="Skills" error="Pick at least one skill.">
            <MultiSelect
              options={[
                { value: "design", label: "Design" },
                { value: "code", label: "Code" },
              ]}
              value={[]}
              onChange={() => {}}
            />
          </Field>
          <Field label="Phone" error="Enter a valid phone number.">
            <PhoneInput placeholder="555 000 0000" />
          </Field>
        </div>
      </section>

      <section id="a11y-controls" className="flex w-full flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Select, MultiSelect, Segmented (a11y)</h2>
        <form
          id="phase4-form"
          className="flex w-full max-w-md flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            setFormLog(new URLSearchParams(new FormData(e.currentTarget) as unknown as Record<string, string>).toString() || "(empty)")
          }}
        >
          <Field label="Fruit (native name)">
            <Select name="fruit" defaultValue="pear" options={[
              { value: "apple", label: "Apple" }, { value: "banana", label: "Banana" }, { value: "pear", label: "Pear" },
              { value: "kiwi", label: "Kiwi", disabled: true }, { value: "mango", label: "Mango" },
              { value: "plum", label: "Plum" }, { value: "grape", label: "Grape" }, { value: "lime", label: "Lime" },
              { value: "fig", label: "Fig" },
            ]} />
          </Field>
          <Field label="Tags (max 2)">
            <MultiSelect name="tags" max={2} defaultValue={["design", "code"]} options={[
              { value: "design", label: "Design" }, { value: "code", label: "Code" }, { value: "docs", label: "Docs" },
              { value: "ops", label: "Ops" }, { value: "qa", label: "QA" }, { value: "ux", label: "UX" },
              { value: "data", label: "Data" }, { value: "sales", label: "Sales" }, { value: "legal", label: "Legal" },
            ]} />
          </Field>
          <Field label="Size">
            <Segmented name="size" defaultValue="md" options={[
              { value: "sm", label: "S" }, { value: "md", label: "M" }, { value: "lg", label: "L" },
            ]} />
          </Field>
          <Button type="submit" variant="outline">Submit form</Button>
          <p id="form-log" className="text-sm text-glob-text-secondary">Last submit: {formLog}</p>
        </form>
        <Card className="w-full max-w-sm overflow-hidden">
          <CardContent>
            <Field label="Inside overflow-hidden card">
              <Select options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} defaultValue="a" />
            </Field>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Badge</h2>
        <div className="flex max-w-xl flex-wrap justify-center gap-2">
          {badgeVariants.map((v) => (
            <Badge key={v} variant={v}>{v}</Badge>
          ))}
        </div>
        <div className="flex max-w-xl flex-wrap justify-center gap-2">
          {badgeVariants.map((v) => (
            <Badge key={v} variant={v} size="sm" dot>{v}</Badge>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Spinner</h2>
        <div className="flex items-center gap-6 text-glob-text">
          <Spinner size="sm" />
          <Spinner />
          <Spinner size="lg" />
          <Spinner size="lg" className="text-glob-primary" aria-label="Saving" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button loading={saving} onClick={() => setSaving(true)}>Save changes</Button>
          <Button variant="outline" loading={saving}>Outline</Button>
          <Button variant="secondary" size="sm" loading={saving}>Small</Button>
          <Button variant="ghost" size="lg" loading={saving}>Large ghost</Button>
          <Button variant="link" onClick={() => setSaving((v) => !v)}>Toggle loading</Button>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Alert</h2>
        <div className="flex w-full max-w-lg flex-col gap-3">
          <Alert>
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>Default alert with the default icon.</AlertDescription>
          </Alert>
          <Alert variant="info">
            <AlertTitle>New version available</AlertTitle>
            <AlertDescription>Reload to get the latest components.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertTitle>Saved</AlertTitle>
            <AlertDescription>Your changes were saved.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertTitle>Storage almost full</AlertTitle>
            <AlertDescription>You have used 90% of your space.</AlertDescription>
          </Alert>
          <Alert variant="danger">
            <AlertTitle>Payment failed</AlertTitle>
            <AlertDescription>Check your card details and try again.</AlertDescription>
          </Alert>
          <Alert variant="info" icon={null}>
            <AlertDescription>Info alert without an icon (icon=&#123;null&#125;).</AlertDescription>
          </Alert>
          <Alert variant="success" icon={<Spinner size="sm" aria-hidden />}>
            <AlertTitle>Custom icon</AlertTitle>
          </Alert>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Card</h2>
        <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Create project</CardTitle>
              <CardDescription>Deploy your new project in one click.</CardDescription>
            </CardHeader>
            <CardContent>
              <Field label="Name">
                <Input placeholder="My project" />
              </Field>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="ghost">Cancel</Button>
              <Button>Create</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle as="h4">Team</CardTitle>
                <Badge variant="success" size="sm" dot>Active</Badge>
              </div>
              <CardDescription>CardTitle rendered as h4.</CardDescription>
            </CardHeader>
            <CardContent>
              <AvatarGroup max={4}>
                {team.map((name, i) => (
                  <Avatar key={name} src={`/avatars/${i + 1}.svg`} alt={name} />
                ))}
              </AvatarGroup>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Avatar</h2>
        <div className="flex flex-wrap items-end justify-center gap-4">
          <Avatar size="sm" src="/avatars/1.svg" alt="Ana Torres" />
          <Avatar size="md" src="/avatars/2.svg" alt="Luis Gómez" />
          <Avatar size="lg" src="/avatars/3.svg" alt="Sara Díaz" />
          <Avatar size="xl" src="/avatars/4.svg" alt="Iván Ruiz" />
          <Avatar size="xl" shape="square" src="/avatars/5.svg" alt="Eva Mora" />
        </div>
        <div className="flex flex-wrap items-end justify-center gap-4">
          <Avatar size="lg" src="/avatars/missing.png" alt="Broken Image" />
          <Avatar size="lg" alt="Only Alt" />
          <Avatar size="lg" fallback="GU" />
          <Avatar size="lg" />
          <Avatar size="lg" shape="square" src="/avatars/missing.png" alt="Square Broken" />
        </div>
        <div className="flex items-center gap-3">
          <Avatar size="lg" src={avatarSrc} alt="Switchable" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAvatarSrc((s) => (s === "/avatars/1.svg" ? "/avatars/missing.png" : "/avatars/1.svg"))}
          >
            Toggle src (ok / broken)
          </Button>
        </div>
        <div className="flex flex-col items-center gap-3">
          <AvatarGroup size="sm" max={3}>
            {team.map((name, i) => (
              <Avatar key={name} src={`/avatars/${i + 1}.svg`} alt={name} />
            ))}
          </AvatarGroup>
          <AvatarGroup size="xl" shape="square" max={5}>
            {team.map((name, i) => (
              <Avatar key={name} src={i === 2 ? "/avatars/missing.png" : `/avatars/${i + 1}.svg`} alt={name} />
            ))}
          </AvatarGroup>
        </div>
      </section>

      <section className="flex w-full flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Skeleton</h2>
        <Button variant="outline" size="sm" onClick={() => setSkeletonLoading((v) => !v)}>
          {skeletonLoading ? "Show content" : "Show skeleton"}
        </Button>
        <Card className="w-full max-w-sm">
          <CardContent className="flex items-center gap-4 pt-6">
            {skeletonLoading ? (
              <>
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </>
            ) : (
              <>
                <Avatar size="lg" src="/avatars/2.svg" alt="Luis Gómez" />
                <div className="flex flex-col">
                  <span className="font-medium">Luis Gómez</span>
                  <span className="text-sm text-glob-text-secondary">Frontend engineer</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </section>

      <section id="dialog" className="flex flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Dialog</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Edit profile</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>Uncontrolled. Esc, backdrop click, X or Cancel close it.</DialogDescription>
              </DialogHeader>
              <Field label="Name">
                <Input defaultValue="Ana Torres" />
              </Field>
              <Field label="Bio">
                <Textarea placeholder="Tell us about you" />
              </Field>
              <Button
                variant="outline"
                className="self-start"
                onClick={() =>
                  toast.info("Draft saved", {
                    description: "Fired from inside the dialog.",
                    action: { label: "Undo", onClick: () => toast({ title: "Undone" }) },
                  })
                }
              >
                Toast from dialog
              </Button>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Save</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen} closeOnOutsideClick={false}>
            <DialogTrigger asChild>
              <Button variant="outline">Delete (controlled)</Button>
            </DialogTrigger>
            <DialogContent size="sm" showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>Delete project?</DialogTitle>
                <DialogDescription>Controlled, size sm, backdrop click disabled.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost" onClick={() => { setConfirmLog("cancelled"); setConfirmOpen(false) }}>
                  Cancel
                </Button>
                <Button onClick={() => { setConfirmLog("deleted"); setConfirmOpen(false) }}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Large dialog</Button>
            </DialogTrigger>
            <DialogContent size="lg">
              <DialogHeader>
                <DialogTitle>Terms of service</DialogTitle>
                <DialogDescription>Size lg with scrolling content.</DialogDescription>
              </DialogHeader>
              {Array.from({ length: 12 }, (_, i) => (
                <p key={i} className="text-sm text-glob-text-secondary">
                  Section {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a
                  ante venenatis dapibus posuere velit aliquet.
                </p>
              ))}
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-xs text-glob-text-secondary">
          Controlled dialog: open={String(confirmOpen)}, last action: {confirmLog}
        </p>
      </section>

      <section className="flex w-full flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Popover</h2>
        <Card className="w-full max-w-sm overflow-hidden">
          <CardHeader>
            <CardTitle as="h4">Inside overflow-hidden</CardTitle>
            <CardDescription>The popover renders in the top layer, so the card does not clip it.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Dimensions</Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="flex flex-col gap-3">
                  <p className="font-medium">Dimensions</p>
                  <Field label="Width" size="sm">
                    <Input size="sm" defaultValue="100%" />
                  </Field>
                  <Field label="Height" size="sm">
                    <Input size="sm" defaultValue="25px" />
                  </Field>
                </div>
              </PopoverContent>
            </Popover>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen} placement="right-start">
              <PopoverTrigger asChild>
                <Button variant="ghost">Controlled ({popoverOpen ? "open" : "closed"})</Button>
              </PopoverTrigger>
              <PopoverContent>
                <p>placement=&quot;right-start&quot;</p>
                <Button size="sm" className="mt-2" onClick={() => setPopoverOpen(false)}>
                  Close
                </Button>
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>
        <div className="flex w-full justify-between">
          <Popover placement="left">
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">Edge (left)</Button>
            </PopoverTrigger>
            <PopoverContent>Flips to the right when the left has no room.</PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">Tall content</Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              {Array.from({ length: 40 }, (_, i) => (
                <p key={i}>Row {i + 1}</p>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Tooltip</h2>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Tooltip content="Top (default, 500ms)">
            <Button variant="outline">Hover me</Button>
          </Tooltip>
          <Tooltip content="Bottom with arrow" placement="bottom" arrow>
            <Button variant="outline">Arrow</Button>
          </Tooltip>
          <Tooltip content="Right, no delay" placement="right" delayDuration={0} arrow>
            <Button variant="outline">Instant</Button>
          </Tooltip>
          <Tooltip content="Hoverable: 150ms close delay" closeDelay={150}>
            <Button variant="outline">Hoverable</Button>
          </Tooltip>
          <Tooltip content="Delete item" arrow>
            <Button variant="ghost" size="icon" aria-label="Delete">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>
            </Button>
          </Tooltip>
        </div>
      </section>

      <section className="flex w-full flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Tabs</h2>
        <div className="flex w-full max-w-lg flex-col gap-8">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="billing" disabled>Billing</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
            <TabsContent value="account">Account settings (controlled: {tab}).</TabsContent>
            <TabsContent value="password">Change your password.</TabsContent>
            <TabsContent value="billing">Billing is disabled.</TabsContent>
            <TabsContent value="team">Manage your team.</TabsContent>
          </Tabs>
          <Tabs defaultValue="day" variant="pill">
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
            <TabsContent value="day">Pill variant, uncontrolled: day view.</TabsContent>
            <TabsContent value="week">Week view.</TabsContent>
            <TabsContent value="month">Month view.</TabsContent>
          </Tabs>
          <Tabs defaultValue="general" orientation="vertical">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="general">Vertical: Up/Down arrows.</TabsContent>
            <TabsContent value="security">Security settings.</TabsContent>
            <TabsContent value="advanced">Advanced settings.</TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="flex w-full flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Accordion</h2>
        <div className="flex w-full max-w-lg flex-col gap-8">
          <Accordion type="single" collapsible defaultValue="a">
            <AccordionItem value="a">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>Yes. Buttons with aria-expanded, regions with aria-labelledby.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>Yes, with grid-template-rows. Reduced motion turns it off.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="c" disabled>
              <AccordionTrigger>Disabled item</AccordionTrigger>
              <AccordionContent>Hidden.</AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="multiple" value={faq} onValueChange={setFaq}>
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping</AccordionTrigger>
              <AccordionContent>Multiple + controlled. Open: {faq.join(", ") || "none"}.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="returns">
              <AccordionTrigger>Returns</AccordionTrigger>
              <AccordionContent>
                30 days. <a href="#dialog" className="text-glob-primary underline">A link inside</a>.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section id="dropdown-menu" className="flex flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Dropdown Menu</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => setMenuLog("Profile")}>
                Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setMenuLog("Billing")}>Billing</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setMenuLog("Settings")}>
                Settings <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setMenuLog("Support")}>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled onSelect={() => setMenuLog("Disabled (should not happen)")}>
                Disabled item
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setMenuLog("Keep open")
                }}
              >
                Keep open (preventDefault)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="danger" onSelect={() => setMenuLog("Delete")}>
                Delete <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu placement="bottom-end">
            <DropdownMenuTrigger className="inline-flex h-10 items-center rounded-glob-md border border-glob-border px-4 text-sm text-glob-text hover:bg-glob-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring">
              View
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52">
              <DropdownMenuLabel inset>Appearance</DropdownMenuLabel>
              <DropdownMenuCheckboxItem checked={statusBar} onCheckedChange={setStatusBar}>
                Status bar
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={activityBar} onCheckedChange={setActivityBar}>
                Activity bar
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem disabled>Panel (disabled)</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel inset>Theme</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={menuTheme} onValueChange={setMenuTheme} aria-label="Theme">
                <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-glob-text-secondary">
          Last action: {menuLog} · Status bar: {statusBar ? "on" : "off"} · Activity bar: {activityBar ? "on" : "off"} ·
          Theme: {menuTheme}
        </p>
      </section>

      <section id="toast" className="flex flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-glob-muted">Toast</h2>
        <div className="flex max-w-2xl flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={() => toast({ title: "Event created", description: "Friday at 10:00." })}>
            Default
          </Button>
          <Button variant="outline" onClick={() => toast.success("Changes saved")}>
            Success
          </Button>
          <Button variant="outline" onClick={() => toast.info("New version available", { description: "Reload to update." })}>
            Info
          </Button>
          <Button variant="outline" onClick={() => toast.warning("Storage almost full", { description: "92% used." })}>
            Warning
          </Button>
          <Button variant="outline" onClick={() => toast.error("Upload failed", { description: "The file is too large." })}>
            Error
          </Button>
          <Button variant="outline" onClick={() => toast({ title: "Sticky toast", description: "Stays until closed.", duration: Infinity })}>
            Sticky
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast({
                title: "Message archived",
                action: { label: "Undo", onClick: () => toast.success("Message restored") },
              })
            }
          >
            With action
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              for (let i = 1; i <= 5; i++) toast({ title: `Queued toast ${i}`, description: "Max 3 visible; the rest wait." })
            }}
          >
            Fire 5 (queue)
          </Button>
          <Button variant="ghost" onClick={() => toast.dismiss()}>
            Dismiss all
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
