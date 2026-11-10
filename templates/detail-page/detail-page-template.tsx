import type { ReactNode } from "react"
import { PageLayout, PageHeader } from "@glob-ui/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@glob-ui/card"

// Edit: this is yours. The back link text and the aside heading are fixed for every detail page.
const BACK_LABEL = "Back"
const ASIDE_TITLE = "Details"

export interface DetailPageTemplateProps {
  title: ReactNode
  /** A breadcrumb trail above the title. */
  breadcrumbs?: ReactNode
  /** Where the back link goes. Omit it to hide the link. */
  backHref?: string
  actions?: ReactNode
  children?: ReactNode
  /** Facts about the item, in a card that stays in view from `lg`. */
  aside?: ReactNode
}

/** A detail page: a header with breadcrumbs and a back link, the content, and a sticky aside card. */
export function DetailPageTemplate({ title, breadcrumbs, backHref, actions, children, aside }: DetailPageTemplateProps) {
  return (
    <PageLayout
      aside={
        aside ? (
          <div data-template-part="prop" data-template-name="facts about the item">
            <Card data-template-part="fixed" data-template-name="card frame">
              <CardHeader>
                <CardTitle as="h2">{ASIDE_TITLE}</CardTitle>
              </CardHeader>
              <CardContent>{aside}</CardContent>
            </Card>
          </div>
        ) : undefined
      }
      header={
        <div data-template-part="fixed" data-template-name="breadcrumbs, back link">
          <PageHeader
            title={<span data-template-part="prop" data-template-name="title">{title}</span>}
            breadcrumbs={
              backHref || breadcrumbs ? (
                <div className="flex flex-col gap-1">
                  {breadcrumbs}
                  {backHref ? (
                    <a href={backHref} className="w-fit text-glob-text-secondary underline-offset-4 hover:underline">
                      ← {BACK_LABEL}
                    </a>
                  ) : null}
                </div>
              ) : undefined
            }
            actions={actions ? <div data-template-part="prop" data-template-name="actions">{actions}</div> : undefined}
          />
        </div>
      }
    >
      <div data-template-part="prop" data-template-name="children" className="flex min-w-0 flex-col gap-6">
        {children}
      </div>
    </PageLayout>
  )
}
