<script lang="ts">
  import { onDestroy } from "svelte"
  import { Combobox, type ComboboxOption } from "@glob-ui/svelte/combobox"
  import { Field } from "@glob-ui/svelte/field"

  const cities = ["Amsterdam", "Berlin", "Bogotá", "Buenos Aires", "Cancún", "Lima", "Lisbon", "London", "Madrid", "Mexico City", "Montevideo", "Paris", "Rome", "São Paulo", "Tokyo"]

  /** A stand-in for a server search: 400 ms, then the matches. */
  function searchCities(query: string) {
    return new Promise<ComboboxOption[]>((resolve) => {
      window.setTimeout(() => {
        const q = query.trim().toLowerCase()
        resolve(cities.filter((c) => c.toLowerCase().includes(q)).map((c) => ({ value: c, label: c })))
      }, 400)
    })
  }

  let text = $state("")
  let value = $state<string | null>(null)
  let options = $state<ComboboxOption[]>([])
  let loading = $state(false)
  let timer: number | undefined

  // Debounce: ask the server after a pause in typing. The latest request wins.
  function onText(next: string) {
    text = next
    window.clearTimeout(timer)
    if (!next.trim()) {
      options = []
      loading = false
      return
    }
    loading = true
    timer = window.setTimeout(() => {
      searchCities(next).then((results) => {
        options = results
        loading = false
      })
    }, 250)
  }

  onDestroy(() => window.clearTimeout(timer))
</script>

<div class="w-full max-w-sm">
  <Field label="City" description="Type two letters or more.">
    <Combobox
      {options}
      filter={false}
      inputValue={text}
      onInputChange={onText}
      bind:value
      {loading}
      emptyMessage="No cities match."
      placeholder="Search cities..."
    />
  </Field>
</div>
