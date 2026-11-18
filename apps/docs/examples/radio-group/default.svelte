<script lang="ts">
  import { RadioGroup, RadioGroupItem } from "@glob-ui/svelte/radio-group"
</script>

<RadioGroup defaultValue="free" aria-label="Plan">
  <RadioGroupItem value="free" label="Free" />
  <RadioGroupItem value="pro" label="Pro" />
  <RadioGroupItem value="team" label="Team" />
</RadioGroup>
