<script lang="ts">
  // One fixture for the forms contracts: `kind` picks what to render, `props` carries the fixture values.
  import { Avatar } from "../../../packages/svelte/src/avatar"
  import { Button } from "../../../packages/svelte/src/button"
  import { Checkbox } from "../../../packages/svelte/src/checkbox"
  import { Field } from "../../../packages/svelte/src/field"
  import { Input } from "../../../packages/svelte/src/input"
  import { Progress } from "../../../packages/svelte/src/progress"
  import { RadioGroup, RadioGroupItem } from "../../../packages/svelte/src/radio-group"
  import { Segmented } from "../../../packages/svelte/src/segmented"
  import { Separator } from "../../../packages/svelte/src/separator"
  import { Slider } from "../../../packages/svelte/src/slider"
  import { Switch } from "../../../packages/svelte/src/switch"
  import { Toggle, ToggleGroup, ToggleGroupItem } from "../../../packages/svelte/src/toggle"

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- test fixture: each kind reads its own fields
  let { kind, props }: { kind: string; props: any } = $props()

  // The avatar's src lives here so the adapter can change it with setAvatarSrc (rerender does not reach the nested props object).
  // svelte-ignore state_referenced_locally
  let avatarSrc = $state<string | undefined>(props?.src)
  export function setAvatarSrc(src: string | undefined) {
    avatarSrc = src
  }

  const RADIO_ITEMS = [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
    { value: "team", label: "Team" },
  ]
</script>

{#snippet radioGroup()}
  <RadioGroup defaultValue={props.defaultValue} name={props.name} onValueChange={props.onValueChange} aria-label="Plan">
    {#each RADIO_ITEMS as item (item.value)}
      <RadioGroupItem value={item.value} label={item.label} />
    {/each}
  </RadioGroup>
{/snippet}

{#snippet segmented()}
  <Segmented name={props.name} options={props.options} defaultValue={props.defaultValue} onChange={props.onChange} aria-label="Range" />
{/snippet}

{#snippet toggleGroup()}
  <ToggleGroup type={props.type} aria-label={props.label} onValueChange={props.onValueChange}>
    {#each props.items as item (item.value)}
      <ToggleGroupItem value={item.value} aria-label={item.label} disabled={item.disabled}>{item.label}</ToggleGroupItem>
    {/each}
  </ToggleGroup>
{/snippet}

{#if kind === "button"}
  <Button loading={props.loading} disabled={props.disabled} onclick={props.onClick}>{props.label}</Button>
{:else if kind === "buttonLink"}
  <Button>
    {#snippet child(attrs)}<a href={props.href} {...attrs}>{props.label}</a>{/snippet}
  </Button>
{:else if kind === "fieldWithInput"}
  <Field label={props.label} description={props.description} error={props.error}><Input /></Field>
{:else if kind === "fieldWithRadioGroup"}
  <Field label={props.label}>
    <RadioGroup defaultValue="free">
      <RadioGroupItem value="free" label="Free" />
      <RadioGroupItem value="pro" label="Pro" />
    </RadioGroup>
  </Field>
{:else if kind === "fieldWithCheckbox"}
  <Field label={props.label}><Checkbox label={props.checkboxLabel} /></Field>
{:else if kind === "fieldWithSlider"}
  <Field label={props.label} description={props.description}><Slider /></Field>
{:else if kind === "checkbox"}
  <Checkbox label={props.label} indeterminate={props.indeterminate} />
{:else if kind === "switch"}
  <Switch aria-label={props.label} name={props.name} value={props.value} defaultChecked={props.defaultChecked} onCheckedChange={props.onCheckedChange} />
{:else if kind === "radioGroup"}
  {#if props.inForm}
    <form onsubmit={(e) => e.preventDefault()}>{@render radioGroup()}</form>
  {:else}
    {@render radioGroup()}
  {/if}
{:else if kind === "separator"}
  <div>
    <p>Above</p>
    <Separator decorative={false} />
    <p>Below</p>
  </div>
{:else if kind === "avatar"}
  <Avatar src={avatarSrc} alt={props.alt} />
{:else if kind === "progress"}
  <div>
    <span id="progress-label">{props.label}</span>
    <Progress aria-labelledby="progress-label" value={props.value} tone="success" />
  </div>
{:else if kind === "slider"}
  <Slider aria-label={props.label} defaultValue={props.defaultValue} min={props.min} max={props.max} onValueChange={props.onValueChange} />
{:else if kind === "toggle"}
  <Toggle aria-label={props.label} onPressedChange={props.onPressedChange}>{props.label.slice(0, 1)}</Toggle>
{:else if kind === "toggleGroup"}
  {#if props.withOutsideButtons}
    <div>
      <button>Before</button>
      {@render toggleGroup()}
      <button>After</button>
    </div>
  {:else}
    {@render toggleGroup()}
  {/if}
{:else if kind === "segmented"}
  {#if props.inForm}
    <form onsubmit={(e) => e.preventDefault()}>{@render segmented()}</form>
  {:else}
    {@render segmented()}
  {/if}
{/if}
