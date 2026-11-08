import { describe, expect, it, vi } from "vitest"
import { renderHook } from "vitest-browser-react"
import { act } from "react"
import { useControllableState } from "./use-controllable-state"

describe("useControllableState", () => {
  it("is uncontrolled: uses defaultProp and updates internally", async () => {
    const { result } = await renderHook(() => useControllableState<string>(undefined, "a"))
    expect(result.current[0]).toBe("a")
    await act(() => result.current[1]("b"))
    expect(result.current[0]).toBe("b")
  })

  it("is controlled: the prop wins and setting does not change it", async () => {
    const onChange = vi.fn()
    const { result } = await renderHook(() => useControllableState<string>("fixed", "a", onChange))
    await act(() => result.current[1]("b"))
    expect(result.current[0]).toBe("fixed")
    expect(onChange).toHaveBeenCalledWith("b")
  })

  it("calls onChange only when the value actually changes", async () => {
    const onChange = vi.fn()
    const { result } = await renderHook(() => useControllableState<string>(undefined, "a", onChange))
    await act(() => result.current[1]("a"))
    expect(onChange).not.toHaveBeenCalled()
    await act(() => result.current[1]("b"))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it("switches from controlled to uncontrolled without losing its last internal value", async () => {
    const { result, rerender } = await renderHook(
      (props: { value?: string }) => useControllableState<string>(props.value, "a"),
      { initialProps: { value: undefined as string | undefined } }
    )
    await act(() => result.current[1]("internal"))
    expect(result.current[0]).toBe("internal")
    await rerender({ value: "controlled" })
    expect(result.current[0]).toBe("controlled")
  })
})
