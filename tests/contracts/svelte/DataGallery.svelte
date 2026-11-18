<script lang="ts">
  // The class-parity gallery for the 10d-4 contracts. It renders the same components and props as the React gallery
  // (react-data.browser.test.tsx).
  import { Calendar } from "../../../packages/svelte/src/calendar"
  import { DataTable } from "../../../packages/svelte/src/data-table"
  import { DatePicker } from "../../../packages/svelte/src/date-picker"
  import { Field } from "../../../packages/svelte/src/field"
  import { PhoneInput } from "../../../packages/svelte/src/phone-input"
  import { USERS } from "../data.contract"
  import { columns } from "./data-columns"
  import Invoices from "./Invoices.svelte"
</script>

<div data-testid="data-gallery">
  <Invoices scrollLabel="Invoices" striped stickyHeader />
  <DataTable
    aria-label="Users"
    {columns}
    data={USERS}
    sorting
    globalFilter
    pagination
    rowSelection
    columnVisibility
    pageSize={5}
    density="compact"
  />
  <Calendar month="2025-02" value="2025-02-12" locale="en-US" isDateDisabled={(iso) => iso === "2025-02-20"} />
  <Calendar mode="range" month="2025-02" value={{ from: "2025-02-10", to: "2025-02-14" }} locale="en-US" numberOfMonths={2} showOutsideDays={false} />
  <Field label="Due date">
    <DatePicker locale="en-US" value="2025-02-12" name="due" />
  </Field>
  <PhoneInput aria-label="Phone" />
</div>
