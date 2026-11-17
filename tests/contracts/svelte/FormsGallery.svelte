<script lang="ts">
  // The parity gallery: the same components and props as FormsGallery in react-forms.browser.test.tsx.
  import { Alert, AlertDescription, AlertTitle } from "../../../packages/svelte/src/alert"
  import { Avatar, AvatarGroup } from "../../../packages/svelte/src/avatar"
  import { Badge } from "../../../packages/svelte/src/badge"
  import { Button } from "../../../packages/svelte/src/button"
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../packages/svelte/src/card"
  import { Checkbox } from "../../../packages/svelte/src/checkbox"
  import { Field } from "../../../packages/svelte/src/field"
  import { Input } from "../../../packages/svelte/src/input"
  import { Label } from "../../../packages/svelte/src/label"
  import { Progress } from "../../../packages/svelte/src/progress"
  import { RadioGroup, RadioGroupItem } from "../../../packages/svelte/src/radio-group"
  import { Segmented } from "../../../packages/svelte/src/segmented"
  import { Separator } from "../../../packages/svelte/src/separator"
  import { Skeleton } from "../../../packages/svelte/src/skeleton"
  import { Slider } from "../../../packages/svelte/src/slider"
  import { Spinner } from "../../../packages/svelte/src/spinner"
  import { Switch } from "../../../packages/svelte/src/switch"
  import { Textarea } from "../../../packages/svelte/src/textarea"
  import { Toggle, ToggleGroup, ToggleGroupItem } from "../../../packages/svelte/src/toggle"
</script>

<div data-testid="forms-gallery">
  <Button>Save</Button>
  <Button variant="outline" size="sm">Cancel</Button>
  <Button loading>Saving</Button>
  <Button variant="link">
    {#snippet child(props)}<a href="#docs" {...props}>Docs</a>{/snippet}
  </Button>
  <Badge dot variant="success">Active</Badge>
  <Badge size="sm">Draft</Badge>
  <Label for="gallery-name" required>Name</Label>
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
  <Skeleton class="h-4 w-32" />
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
