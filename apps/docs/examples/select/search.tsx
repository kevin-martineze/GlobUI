import { Select } from "@glob-ui/select"

// More than 8 options: a search field appears at the top of the list.
const fruits = ["Apple", "Banana", "Blueberry", "Cherry", "Grape", "Kiwi", "Lemon", "Mango", "Papaya", "Pear"].map(
  (label) => ({ value: label.toLowerCase(), label })
)

export default function SelectSearch() {
  return <Select aria-label="Fruit" options={fruits} defaultValue="mango" className="w-full max-w-xs" />
}
