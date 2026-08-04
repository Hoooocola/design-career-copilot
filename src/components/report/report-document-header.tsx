"use client"

import { useLocale } from "@/components/providers/locale-provider"
import type { Locale } from "@/lib/i18n"

interface ReportDocumentHeaderProps {
  assessmentDate: Date
}

function formatAssessmentDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function ReportDocumentHeader({ assessmentDate }: ReportDocumentHeaderProps) {
  const { locale, messages } = useLocale()
  const doc = messages.report.document

  return (
    <header className="report-doc-header">
      <div className="report-doc-header__rules" aria-hidden="true">
        <span className="report-doc-header__rule" />
        <span className="report-doc-header__rule report-doc-header__rule--accent" />
      </div>

      <div className="report-doc-header__body">
        <div className="report-doc-header__primary">
          <h1 className="report-doc-title">{doc.title}</h1>
          <p className="report-doc-subtitle">{doc.subtitle}</p>
        </div>

        <dl className="report-doc-meta">
          <dt>{doc.assessmentDate}</dt>
          <dd>{formatAssessmentDate(assessmentDate, locale)}</dd>
        </dl>
      </div>

      <div className="report-doc-header__rules report-doc-header__rules--bottom" aria-hidden="true">
        <span className="report-doc-header__rule" />
      </div>
    </header>
  )
}
