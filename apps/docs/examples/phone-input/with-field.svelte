<script lang="ts">
  import { Field } from "@glob-ui/svelte/field"
  import { PhoneInput } from "@glob-ui/svelte/phone-input"
</script>

<Field label="Phone" error="Enter a valid phone number." class="w-full max-w-sm">
  <PhoneInput country="MX" placeholder="555 000 0000" />
</Field>
