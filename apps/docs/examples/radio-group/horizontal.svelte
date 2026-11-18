<script lang="ts">
  import { RadioGroup, RadioGroupItem } from "@glob-ui/svelte/radio-group"
</script>

<RadioGroup defaultValue="monthly" orientation="horizontal" aria-label="Billing">
  <RadioGroupItem value="monthly" label="Monthly" />
  <RadioGroupItem value="yearly" label="Yearly" />
  <RadioGroupItem value="lifetime" label="Lifetime" disabled />
</RadioGroup>
