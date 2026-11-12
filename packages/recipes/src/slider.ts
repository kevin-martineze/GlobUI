import { cva } from "class-variance-authority"

export const sliderVariants = cva(
  [
    // Native range input: keyboard, form submission, RTL and screen readers come with it.
    "w-full cursor-pointer appearance-none rounded-glob-sm bg-transparent focus-visible:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
    // Track (WebKit and Firefox). The WebKit fill is a gradient up to --glob-slider-fill.
    "[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full",
    "[&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,var(--glob-primary)_var(--glob-slider-fill),var(--glob-surface-hover)_var(--glob-slider-fill))]",
    "[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-glob-surface-hover",
    "[&::-moz-range-progress]:h-1.5 [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-glob-primary",
    // Thumb. The margin centres a 16 px thumb on the 6 px track in WebKit.
    "[&::-webkit-slider-thumb]:-mt-[5px] [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-glob-primary [&::-webkit-slider-thumb]:bg-glob-surface",
    "[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-glob-primary [&::-moz-range-thumb]:bg-glob-surface",
    "[&:focus-visible::-webkit-slider-thumb]:shadow-[0_0_0_3px_var(--glob-ring)] [&:focus-visible::-moz-range-thumb]:shadow-[0_0_0_3px_var(--glob-ring)]",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      size: {
        sm: "[&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:-mt-[4px] [&::-moz-range-thumb]:size-3",
        md: "",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)