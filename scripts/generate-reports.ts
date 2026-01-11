import * as fs from 'fs/promises'
import type { ScrapedPage } from './types/scraped-content'

interface MigrationReport {
  totalPages: number
  successfulPages: number
  pagesWithForms: number
  pagesWithAnalytics: number
  pages: Array<{
    url: string
    title: string
    filepath: string
    status: 'success' | 'failed'
    forms: number
    analytics: string[]
    images: number
  }>
}

interface URLMapping {
  wordpressUrl: string
  nextjsPath: string
  status: 'preserved' | 'redirected'
}

interface FormsReport {
  totalForms: number
  forms: Array<{
    url: string
    formId?: string
    fieldCount: number
    fields: any[]
  }>
}

interface AnalyticsReport {
  detectedScripts: Array<{
    type: string
    id?: string
    occurrences: number
  }>
  pages: Array<{
    url: string
    scripts: any[]
  }>
}

/**
 * Generate migration report from scraped pages
 */
export async function generateMigrationReport(pages: Map<string, ScrapedPage>): Promise<void> {
  console.log('\n📊 Generating migration report...')

  const report: MigrationReport = {
    totalPages: pages.size,
    successfulPages: pages.size,
    pagesWithForms: 0,
    pagesWithAnalytics: 0,
    pages: [],
  }

  for (const [url, page] of pages) {
    const hasForms = page.forms && page.forms.length > 0
    const hasAnalytics = page.analytics && page.analytics.length > 0

    if (hasForms) report.pagesWithForms++
    if (hasAnalytics) report.pagesWithAnalytics++

    report.pages.push({
      url,
      title: page.title,
      filepath: urlToFilePath(url),
      status: 'success',
      forms: page.forms?.length || 0,
      analytics: page.analytics?.map((a: any) => a.type) || [],
      images: page.images.length,
    })
  }

  await fs.mkdir('reports', { recursive: true })
  await fs.writeFile(
    'reports/migration-report.json',
    JSON.stringify(report, null, 2)
  )

  console.log('  ✅ Generated reports/migration-report.json')
}

/**
 * Generate URL audit report
 */
export async function generateURLAudit(pages: Map<string, ScrapedPage>): Promise<void> {
  console.log('\n🔗 Generating URL audit...')

  const mappings: URLMapping[] = []

  for (const [url, page] of pages) {
    const urlObj = new URL(url)
    mappings.push({
      wordpressUrl: url,
      nextjsPath: urlObj.pathname,
      status: 'preserved',
    })
  }

  await fs.mkdir('reports', { recursive: true })
  await fs.writeFile(
    'reports/url-audit.json',
    JSON.stringify({ mappings, total: mappings.length }, null, 2)
  )

  console.log(`  ✅ Generated reports/url-audit.json (${mappings.length} URLs)`)
}

/**
 * Generate forms documentation
 */
export async function generateFormsReport(pages: Map<string, ScrapedPage>): Promise<void> {
  console.log('\n📋 Generating forms documentation...')

  const formsReport: FormsReport = {
    totalForms: 0,
    forms: [],
  }

  for (const [url, page] of pages) {
    if (page.forms && page.forms.length > 0) {
      for (const form of page.forms) {
        formsReport.forms.push({
          url,
          formId: form.formId,
          fieldCount: form.fields.length,
          fields: form.fields,
        })
        formsReport.totalForms++
      }
    }
  }

  await fs.mkdir('reports', { recursive: true })
  await fs.writeFile(
    'reports/forms.json',
    JSON.stringify(formsReport, null, 2)
  )

  console.log(`  ✅ Generated reports/forms.json (${formsReport.totalForms} forms)`)
}

/**
 * Generate analytics audit
 */
export async function generateAnalyticsAudit(pages: Map<string, ScrapedPage>): Promise<void> {
  console.log('\n📈 Generating analytics audit...')

  // Aggregate analytics scripts
  const scriptCounts = new Map<string, { type: string; id?: string; count: number }>()

  const pagesWithAnalytics: Array<{ url: string; scripts: any[] }> = []

  for (const [url, page] of pages) {
    if (page.analytics && page.analytics.length > 0) {
      pagesWithAnalytics.push({
        url,
        scripts: page.analytics,
      })

      for (const script of page.analytics) {
        const key = `${script.type}-${script.id || 'none'}`
        const existing = scriptCounts.get(key)
        if (existing) {
          existing.count++
        } else {
          scriptCounts.set(key, { type: script.type, id: script.id, count: 1 })
        }
      }
    }
  }

  const analyticsReport: AnalyticsReport = {
    detectedScripts: Array.from(scriptCounts.values()),
    pages: pagesWithAnalytics,
  }

  await fs.mkdir('reports', { recursive: true })
  await fs.writeFile(
    'reports/analytics-audit.json',
    JSON.stringify(analyticsReport, null, 2)
  )

  console.log(`  ✅ Generated reports/analytics-audit.json`)
  console.log(`     Found ${scriptCounts.size} unique script types across ${pagesWithAnalytics.length} pages`)
}

/**
 * Generate all reports
 */
export async function generateAllReports(pages: Map<string, ScrapedPage>): Promise<void> {
  await generateMigrationReport(pages)
  await generateURLAudit(pages)
  await generateFormsReport(pages)
  await generateAnalyticsAudit(pages)
}

function urlToFilePath(url: string): string {
  const urlObj = new URL(url)
  let pathname = urlObj.pathname

  if (pathname.endsWith('/') && pathname.length > 1) {
    pathname = pathname.slice(0, -1)
  }

  if (pathname === '' || pathname === '/') {
    return 'content/pages/index.mdx'
  }

  return `content/pages${pathname}.mdx`
}
