// The React render adapter for the phase 10d-4 contracts: data and dates.
import { useState } from "react"
import { render } from "vitest-browser-react"
import { Calendar, type DateRange } from "@glob-ui/calendar"
import { createDataTableColumnHelper, DataTable, type DataTableColumn } from "@glob-ui/data-table"
import { DatePicker } from "@glob-ui/date-picker"
import { Field } from "@glob-ui/field"
import { PhoneInput } from "@glob-ui/phone-input"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@glob-ui/table"
import { dataParityContract } from "./data-parity.contract"
import { dataContract, USERS } from "./data.contract"
import type { ContractDateRange, ContractUser, DataAdapter } from "./types"

const helper = createDataTableColumnHelper<ContractUser>()
const columns: DataTableColumn<ContractUser>[] = [
  helper.accessor("name", { header: "Name" }),
  helper.accessor("city", { header: "City" }),
  helper.accessor("role", { header: "Role" }),
]

function Invoices(props: { scrollLabel?: string; striped?: boolean; stickyHeader?: boolean }) {
  return (
    <Table scrollLabel={props.scrollLabel} striped={props.striped} stickyHeader={props.stickyHeader} containerClassName="max-h-48">
      <TableCaption>Invoices, November</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead align="right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>INV-001</TableCell>
          <TableCell align="right">$120</TableCell>
        </TableRow>
        <TableRow data-state="selected">
          <TableCell>INV-002</TableCell>
          <TableCell align="right">$80</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell align="right">$200</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

/** The parity gallery. The Svelte gallery (svelte/DataGallery.svelte) renders the same components and props. */
function DataGallery() {
  return (
    <div data-testid="data-gallery">
      <Invoices scrollLabel="Invoices" striped stickyHeader />
      <DataTable
        aria-label="Users"
        columns={columns}
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
  )
}

function SinglePicker(f: { value?: string | null; onChange?: (value: string | null) => void }) {
  const [value, setValue] = useState<string | null>(f.value ?? null)
  return (
    <Field label="Due date">
      <DatePicker
        locale="en-US"
        name="due"
        mode="single"
        value={value}
        onChange={(v) => {
          setValue(v)
          f.onChange?.(v)
        }}
      />
    </Field>
  )
}

function RangePicker(f: { onChange?: (value: DateRange) => void; presets?: { label: string; value: string | ContractDateRange }[] }) {
  const [value, setValue] = useState<DateRange>({ from: null, to: null })
  return (
    <Field label="Due date">
      <DatePicker
        mode="range"
        locale="en-US"
        name="stay"
        presets={f.presets}
        value={value}
        onChange={(r) => {
          setValue(r)
          f.onChange?.(r)
        }}
      />
    </Field>
  )
}

const react: DataAdapter = {
  name: "react",
  async dataGallery() {
    await render(<DataGallery />)
  },
  async table(f) {
    await render(<Invoices {...f} />)
  },
  async dataTable(f) {
    await render(<DataTable aria-label="Users" columns={columns} {...f} />)
  },
  async calendar(f) {
    const { mode, value, defaultValue, onChange, ...rest } = f
    await render(
      mode === "range" ? (
        <Calendar
          mode="range"
          value={value as DateRange | undefined}
          defaultValue={defaultValue as DateRange | undefined}
          onChange={onChange as (v: DateRange) => void}
          {...rest}
        />
      ) : (
        <Calendar
          value={value as string | null | undefined}
          defaultValue={defaultValue as string | null | undefined}
          onChange={onChange as (v: string | null) => void}
          {...rest}
        />
      )
    )
  },
  async datePicker(f) {
    await render(f.mode === "range" ? <RangePicker onChange={f.onChange} presets={f.presets} /> : <SinglePicker value={f.value} onChange={f.onChange} />)
  },
  async phoneInput(f) {
    await render(<PhoneInput aria-label="Phone" country={f.country} onCountryChange={f.onCountryChange} />)
  },
}

dataParityContract(react)
dataContract(react)
