// The React render adapter for the phase 10d-1 contracts: forms and primitives.
import { render } from "vitest-browser-react"
import { Alert, AlertDescription, AlertTitle } from "@glob-ui/alert"
import { Avatar, AvatarGroup } from "@glob-ui/avatar"
import { Badge } from "@glob-ui/badge"
import { Button } from "@glob-ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@glob-ui/card"
import { Checkbox } from "@glob-ui/checkbox"
import { Field } from "@glob-ui/field"
import { Input } from "@glob-ui/input"
import { Label } from "@glob-ui/label"
import { Progress } from "@glob-ui/progress"
import { RadioGroup, RadioGroupItem } from "@glob-ui/radio-group"
import { Segmented } from "@glob-ui/segmented"
import { Separator } from "@glob-ui/separator"
import { Skeleton } from "@glob-ui/skeleton"
import { Slider } from "@glob-ui/slider"
import { Spinner } from "@glob-ui/spinner"
import { Switch } from "@glob-ui/switch"
import { Textarea } from "@glob-ui/textarea"
import { Toggle, ToggleGroup, ToggleGroupItem } from "@glob-ui/toggle"
import { formsParityContract } from "./forms-parity.contract"
import { formsContract } from "./forms.contract"
import type { FormsAdapter } from "./types"

/** The parity gallery. The Svelte gallery (svelte/FormsGallery.svelte) renders the same components and props. */
function FormsGallery() {
  return (
    <div data-testid="forms-gallery">
      <Button>Save</Button>
      <Button variant="outline" size="sm">Cancel</Button>
      <Button loading>Saving</Button>
      <Button asChild variant="link">
        <a href="#docs">Docs</a>
      </Button>
      <Badge dot variant="success">Active</Badge>
      <Badge size="sm">Draft</Badge>
      <Label htmlFor="gallery-name" required>Name</Label>
      <Input id="gallery-name" size="sm" placeholder="Name" />
      <Textarea aria-label="Notes" resize="none" />
      <Field label="Email" description="Work address" error="Enter a valid email" required>
        <Input />
      </Field>
      <Checkbox label="Accept" />
      <Checkbox aria-label="Select row" size="sm" />
      <Checkbox label="Disabled" disabled />
      <Switch aria-label="Notifications" defaultChecked size="sm" />
      <RadioGroup aria-label="Plan" defaultValue="free" orientation="horizontal" size="sm">
        <RadioGroupItem value="free" label="Free" />
        <RadioGroupItem value="pro" label="Pro" disabled />
      </RadioGroup>
      <RadioGroup aria-label="Tier" aria-invalid="true">
        <RadioGroupItem value="a" label="A" />
      </RadioGroup>
      <Separator />
      <Separator orientation="vertical" decorative={false} />
      <Spinner size="sm" />
      <Skeleton className="h-4 w-32" />
      <Card>
        <CardHeader>
          <CardTitle>Plan</CardTitle>
          <CardDescription>Monthly</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>
          <Button>Upgrade</Button>
        </CardFooter>
      </Card>
      <Alert variant="warning">
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Check the details.</AlertDescription>
      </Alert>
      <Alert icon={null}>
        <AlertTitle>No icon</AlertTitle>
      </Alert>
      <Avatar alt="Ana Torres" />
      <Avatar size="sm" shape="square" />
      <AvatarGroup max={2} size="sm">
        <Avatar alt="Ana Torres" />
        <Avatar alt="Bo Li" />
        <Avatar alt="Cy Diaz" />
      </AvatarGroup>
      <Progress aria-label="Upload" value={40} tone="success" />
      <Progress aria-label="Sync" size="sm" />
      <Slider aria-label="Volume" defaultValue={30} size="sm" />
      <Toggle aria-label="Bold" defaultPressed>B</Toggle>
      <ToggleGroup type="single" aria-label="Align" defaultValue="left" variant="outline" orientation="vertical">
        <ToggleGroupItem value="left" aria-label="Left">L</ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Center">C</ToggleGroupItem>
      </ToggleGroup>
      <Segmented
        aria-label="Range"
        size="sm"
        defaultValue="day"
        options={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week", disabled: true },
        ]}
      />
      <Segmented aria-label="Off" disabled options={[{ value: "a", label: "A" }]} />
    </div>
  )
}

const RADIO_ITEMS = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "team", label: "Team" },
]

const react: FormsAdapter = {
  name: "react",
  async formsGallery() {
    await render(<FormsGallery />)
  },
  async button(f) {
    await render(
      <Button loading={f.loading} disabled={f.disabled} onClick={f.onClick}>
        {f.label}
      </Button>
    )
  },
  async buttonLink(f) {
    await render(
      <Button asChild>
        <a href={f.href}>{f.label}</a>
      </Button>
    )
  },
  async fieldWithInput(f) {
    await render(
      <Field label={f.label} description={f.description} error={f.error}>
        <Input />
      </Field>
    )
  },
  async fieldWithRadioGroup(f) {
    await render(
      <Field label={f.label}>
        <RadioGroup defaultValue="free">
          <RadioGroupItem value="free" label="Free" />
          <RadioGroupItem value="pro" label="Pro" />
        </RadioGroup>
      </Field>
    )
  },
  async fieldWithCheckbox(f) {
    await render(
      <Field label={f.label}>
        <Checkbox label={f.checkboxLabel} />
      </Field>
    )
  },
  async fieldWithSlider(f) {
    await render(
      <Field label={f.label} description={f.description}>
        <Slider />
      </Field>
    )
  },
  async checkbox(f) {
    await render(<Checkbox label={f.label} indeterminate={f.indeterminate} />)
  },
  async switch(f) {
    await render(
      <Switch aria-label={f.label} name={f.name} value={f.value} defaultChecked={f.defaultChecked} onCheckedChange={f.onCheckedChange} />
    )
  },
  async radioGroup(f) {
    const group = (
      <RadioGroup defaultValue={f.defaultValue} name={f.name} onValueChange={f.onValueChange} aria-label="Plan">
        {RADIO_ITEMS.map((item) => (
          <RadioGroupItem key={item.value} value={item.value} label={item.label} />
        ))}
      </RadioGroup>
    )
    await render(f.inForm ? <form onSubmit={(e) => e.preventDefault()}>{group}</form> : group)
  },
  async separator() {
    await render(
      <div>
        <p>Above</p>
        <Separator decorative={false} />
        <p>Below</p>
      </div>
    )
  },
  async avatar(f) {
    const screen = await render(<Avatar src={f.src} alt={f.alt} />)
    return {
      async setSrc(src) {
        await screen.rerender(<Avatar src={src} alt={f.alt} />)
      },
    }
  },
  async progress(f) {
    await render(
      <div>
        <span id="progress-label">{f.label}</span>
        <Progress aria-labelledby="progress-label" value={f.value} tone="success" />
      </div>
    )
  },
  async slider(f) {
    await render(<Slider aria-label={f.label} defaultValue={f.defaultValue} min={f.min} max={f.max} onValueChange={f.onValueChange} />)
  },
  async toggle(f) {
    await render(
      <Toggle aria-label={f.label} onPressedChange={f.onPressedChange}>
        {f.label.slice(0, 1)}
      </Toggle>
    )
  },
  async toggleGroup(f) {
    const items = f.items.map((item) => (
      <ToggleGroupItem key={item.value} value={item.value} aria-label={item.label} disabled={item.disabled}>
        {item.label}
      </ToggleGroupItem>
    ))
    const group =
      f.type === "single" ? (
        <ToggleGroup type="single" aria-label={f.label} onValueChange={f.onValueChange as (v: string) => void}>
          {items}
        </ToggleGroup>
      ) : (
        <ToggleGroup type="multiple" aria-label={f.label} onValueChange={f.onValueChange as (v: string[]) => void}>
          {items}
        </ToggleGroup>
      )
    await render(
      f.withOutsideButtons ? (
        <div>
          <button>Before</button>
          {group}
          <button>After</button>
        </div>
      ) : (
        group
      )
    )
  },
  async segmented(f) {
    const control = <Segmented name={f.name} options={f.options} defaultValue={f.defaultValue} onChange={f.onChange} aria-label="Range" />
    await render(f.inForm ? <form onSubmit={(e) => e.preventDefault()}>{control}</form> : control)
  },
}

formsParityContract(react)
formsContract(react)
