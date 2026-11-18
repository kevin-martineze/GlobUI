// The DataTable columns of the 10d-4 fixtures: name, city and role.
import { createDataTableColumnHelper, type DataTableColumn } from "../../../packages/svelte/src/data-table"
import type { ContractUser } from "../types"

const helper = createDataTableColumnHelper<ContractUser>()
export const columns: DataTableColumn<ContractUser>[] = [
  helper.accessor("name", { header: "Name" }),
  helper.accessor("city", { header: "City" }),
  helper.accessor("role", { header: "Role" }),
]
