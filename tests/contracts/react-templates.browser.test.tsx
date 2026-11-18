// The React render adapter for the phase 10g-1 contracts: the templates.
import { render } from "vitest-browser-react"
import { createDataTableColumnHelper } from "@glob-ui/data-table"
import { DashboardTemplate } from "../../templates/dashboard/dashboard-template"
import { ListPageTemplate } from "../../templates/list-page/list-page-template"
import { DetailPageTemplate } from "../../templates/detail-page/detail-page-template"
import { templatesParityContract } from "./templates-parity.contract"
import { templatesContract } from "./templates.contract"
import type { ContractInvoice, TemplatesAdapter } from "./types"

const helper = createDataTableColumnHelper<ContractInvoice>()
const columns = [helper.accessor("id", { header: "Invoice" }), helper.accessor("client", { header: "Client" })]

const react: TemplatesAdapter = {
  name: "react",
  async dashboard({ rows = 0, content, actions, ...props }) {
    await render(
      <div data-testid="template">
        <DashboardTemplate {...props} actions={actions ? <button type="button">New</button> : undefined}>
          {content ? <p>{content}</p> : null}
          {Array.from({ length: rows }, (_, i) => (
            <p key={i}>Row {i}</p>
          ))}
        </DashboardTemplate>
      </div>
    )
  },
  async listPage({ actions, ...props }) {
    await render(
      <div data-testid="template">
        <ListPageTemplate {...props} columns={columns} aria-label="Invoices table" actions={actions ? <button type="button">New</button> : undefined} />
      </div>
    )
  },
  async detailPage({ aside, content, actions, ...props }) {
    await render(
      <div data-testid="template">
        <DetailPageTemplate
          {...props}
          aside={aside ? <p>{aside}</p> : undefined}
          actions={actions ? <button type="button">Edit</button> : undefined}
        >
          {content ? <p>{content}</p> : null}
        </DetailPageTemplate>
      </div>
    )
  },
}

templatesParityContract(react)
templatesContract(react)
