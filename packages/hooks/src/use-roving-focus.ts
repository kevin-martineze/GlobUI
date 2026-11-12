import { useEffect, useState } from "react"
import { createRovingFocus, type RovingFocusOptions } from "@glob-ui/core"

export type UseRovingFocusOptions = RovingFocusOptions

/**
 * Keyboard focus movement inside a composite widget (tablist, menu, accordion headers).
 * Spread `rootProps` on the container. The behaviour lives in `@glob-ui/core`; this hook wires it to React.
 */
export function useRovingFocus(options: UseRovingFocusOptions = {}) {
  const [controller] = useState(() => createRovingFocus(options))

  // Options are read at key time, so the latest ones apply without re-creating the controller.
  useEffect(() => {
    controller.update(options)
  })
  useEffect(() => () => controller.destroy(), [controller])

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => controller.handleKeyDown(e)
  return {
    rootProps: { "data-roving-root": "", onKeyDown },
    onKeyDown,
  }
}
