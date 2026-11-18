<script lang="ts">
  import { Combobox, type ComboboxOption } from "@glob-ui/svelte/combobox"
  import { Field } from "@glob-ui/svelte/field"

  const plans: ComboboxOption[] = [
    { value: "free", label: "Free", description: "For side projects. Up to 3 members." },
    { value: "pro", label: "Pro", description: "For teams. Unlimited members and audit logs." },
    { value: "enterprise", label: "Enterprise", description: "SSO and a support contract.", disabled: true },
  ]
  let value = $state<string | null>("free")
</script>

<div class="w-full max-w-sm">
  <Field label="Plan" description="Enterprise needs a sales call, so it is not available here.">
    <Combobox options={plans} bind:value />
  </Field>
</div>
