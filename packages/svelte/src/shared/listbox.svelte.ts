// Active-option state for a listbox driven by aria-activedescendant (focus stays on the combobox or search input).
// Arrows, Home/End, PageUp/PageDown and typeahead, skipping disabled options. The rules live in @glob-ui/core
// (the same ones React's useListbox uses). Create it while a component initializes.

import {
  createTypeahead,
  isPrintableKey,
  listboxKeyMove,
  listboxOptionId,
  moveListboxIndex,
  scrollOptionIntoView,
  type ListboxMove,
} from "@glob-ui/core"

export interface ListboxOptions<T> {
  /** Base id; option ids are derived from it. */
  id: string
  /** Options currently shown (already filtered), in display order. */
  items: T[]
  getKey: (item: T) => string
  /** Text matched by typeahead. */
  getText: (item: T) => string
  isDisabled?: (item: T) => boolean
  open: boolean
}

export class Listbox<T> {
  #get: () => ListboxOptions<T>
  #typeahead = createTypeahead()
  activeKeyState = $state<string | null>(null)

  readonly #enabled = $derived.by(() => {
    const { items, isDisabled } = this.#get()
    return items.filter((item) => !isDisabled?.(item))
  })

  /** If the stored key is filtered out (or unset), the first enabled option is active. */
  readonly activeItem = $derived.by((): T | undefined => {
    const { open, getKey } = this.#get()
    if (!open) return undefined
    return this.#enabled.find((item) => getKey(item) === this.activeKeyState) ?? this.#enabled[0]
  })

  readonly activeKey = $derived.by(() => (this.activeItem === undefined ? null : this.#get().getKey(this.activeItem)))

  constructor(options: () => ListboxOptions<T>) {
    this.#get = options

    // Scroll the list itself (not the page) so the active option is visible.
    $effect(() => {
      const { open, id } = this.#get()
      const key = this.activeKey
      if (!open || key === null) return
      const option = document.getElementById(listboxOptionId(id, key))
      const list = option?.closest<HTMLElement>('[role="listbox"]')
      if (option && list) scrollOptionIntoView(option, list)
    })

    $effect(() => () => this.#typeahead.reset())
  }

  setActiveKey(key: string | null) {
    this.activeKeyState = key
  }

  optionId(key: string) {
    return listboxOptionId(this.#get().id, key)
  }

  /** Value for `aria-activedescendant` on the element that has focus. */
  get activeDescendant() {
    return this.activeKey === null ? undefined : this.optionId(this.activeKey)
  }

  move(to: ListboxMove) {
    const enabled = this.#enabled
    if (enabled.length === 0) return
    const index = this.activeItem === undefined ? -1 : enabled.indexOf(this.activeItem)
    this.activeKeyState = this.#get().getKey(enabled[moveListboxIndex(index, enabled.length, to)])
  }

  /** Jumps to the next option starting with the typed text. Repeating one letter cycles. */
  typeahead(char: string) {
    const enabled = this.#enabled
    const { getText, getKey } = this.#get()
    const index = this.activeItem === undefined ? -1 : enabled.indexOf(this.activeItem)
    const found = this.#typeahead.type(char, enabled.map(getText), index)
    if (found !== -1) this.activeKeyState = getKey(enabled[found])
  }

  /**
   * Handles navigation keys. Returns true when the key was used (and default prevented).
   * Pass `homeEnd: false` in text inputs, where Home/End move the caret.
   */
  navigate(e: KeyboardEvent, { homeEnd = true, typeahead = false } = {}) {
    const to = listboxKeyMove(e.key, { homeEnd })
    if (to && !e.altKey) {
      e.preventDefault()
      this.move(to)
      return true
    }
    if (typeahead && isPrintableKey(e)) {
      e.preventDefault()
      this.typeahead(e.key)
      return true
    }
    return false
  }
}
