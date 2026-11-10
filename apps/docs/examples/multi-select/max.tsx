import { MultiSelect } from "@glob-ui/multi-select"

const skills = ["TypeScript", "React", "CSS", "Testing", "Accessibility", "Node"].map((label) => ({
  value: label.toLowerCase(),
  label,
}))

// `max` disables the other options once two are chosen. Removing a chip re-enables them.
export default function MultiSelectMax() {
  return (
    <MultiSelect
      options={skills}
      defaultValue={["react", "css"]}
      max={2}
      name="skills"
      aria-label="Skills"
      className="w-full max-w-sm"
    />
  )
}
