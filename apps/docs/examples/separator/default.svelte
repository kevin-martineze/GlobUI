<script lang="ts">
  import { Separator } from "@glob-ui/svelte/separator"
</script>

<div class="flex w-full max-w-md flex-col gap-4 text-sm">
  <p class="text-glob-text">Sections of a page are divided by a horizontal line.</p>
  <Separator />
  <p class="text-glob-text-secondary">Inline items use a vertical one.</p>
  <div class="flex h-5 items-center gap-3">
    <a href="#docs" class="text-glob-primary-text hover:underline">Docs</a>
    <Separator orientation="vertical" />
    <a href="#source" class="text-glob-primary-text hover:underline">Source</a>
    <Separator orientation="vertical" />
    <a href="#changelog" class="text-glob-primary-text hover:underline">Changelog</a>
  </div>
</div>
