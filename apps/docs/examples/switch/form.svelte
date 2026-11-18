<script lang="ts">
  import { Switch } from "@glob-ui/svelte/switch"

  let submitted = $state("not submitted")
</script>

<form
  class="flex flex-col items-start gap-3"
  onsubmit={(e) => {
    e.preventDefault()
    submitted = new FormData(e.currentTarget).get("newsletter") ? "subscribed" : "not subscribed"
  }}
>
  <div class="flex items-center gap-3">
    <Switch name="newsletter" value="yes" defaultChecked aria-label="Newsletter" />
    <span class="text-sm">Subscribe to the newsletter</span>
  </div>
  <button type="submit" class="rounded-md border border-fd-border px-3 py-1.5 text-sm hover:bg-fd-muted">
    Submit
  </button>
  <p class="text-sm text-fd-muted-foreground">Submitted: {submitted}</p>
</form>
