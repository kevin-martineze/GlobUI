<script lang="ts">
  import { Button } from "@glob-ui/svelte/button"
  import { Field } from "@glob-ui/svelte/field"
  import { Select } from "@glob-ui/svelte/select"

  const plans = [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
  ]
  let submitted = $state("not submitted")
</script>

<!-- `name` writes a hidden input, so a native form submits the value. -->
<form
  class="flex w-full max-w-xs flex-col gap-3"
  onsubmit={(e) => {
    e.preventDefault()
    submitted = new FormData(e.currentTarget).get("plan") as string
  }}
>
  <Field label="Plan">
    <Select name="plan" options={plans} defaultValue="pro" />
  </Field>
  <Button type="submit" variant="outline">Submit</Button>
  <p class="text-sm text-fd-muted-foreground">Submitted plan: {submitted}</p>
</form>
