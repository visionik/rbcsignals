import axios from 'axios'
import * as cheerio from 'cheerio'
import TurndownService from 'turndown'
import * as fs from 'fs/promises'
import * as path from 'path'
import type { ScrapedPage } from './types/scraped-content'
import { extractForms } from './extract-forms'
import { extractAnalytics } from './extract-analytics'

const BASE_URL = 'https://rbcsignals.com'

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
})

export async function extractHomepage(): Promise<ScrapedPage> {
  console.log('📄 Extracting homepage content...')

  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
    })

    const $ = cheerio.load(response.data)
    
    // Extract SEO metadata
    const title = $('title').text() || $('meta[property="og:title"]').attr('content') || 'RBC Signals'
    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') || ''
    
    const seo = {
      ogTitle: $('meta[property="og:title"]').attr('content'),
      ogDescription: $('meta[property="og:description"]').attr('content'),
      ogImage: $('meta[property="og:image"]').attr('content'),
      twitterCard: $('meta[name="twitter:card"]').attr('content'),
      canonical: $('link[rel="canonical"]').attr('href'),
    }

    // Extract main content (skip header, footer, nav)
    $('header, footer, nav, script, style, .sidebar').remove()
    const mainContent = $('main').html() || $('article').html() || $('body').html() || ''
    
    // Extract images
    const images: string[] = []
    $('img').each((_, el) => {
      const src = $(el).attr('src')
      if (src) {
        images.push(src.startsWith('http') ? src : `${BASE_URL}${src}`)
      }
    })

    // Convert to markdown
    const markdown = turndownService.turndown(mainContent)

    const scrapedPage: ScrapedPage = {
      url: BASE_URL,
      title,
      description,
      content: mainContent,
      markdown,
      seo,
      images,
    }

    // Generate MDX file
    await generateMDXFile(scrapedPage)

    console.log('✅ Homepage content extracted successfully')
    return scrapedPage
  } catch (error) {
    console.error('❌ Error extracting homepage:', error)
    throw error
  }
}

async function generateMDXFile(page: ScrapedPage): Promise<void> {
  const frontmatter = `---
title: "${page.title.replace(/"/g, '\\"')}"
description: "${page.description.replace(/"/g, '\\"')}"
url: "/"
seo:
  ogTitle: "${page.seo.ogTitle || page.title}"
  ogDescription: "${page.seo.ogDescription || page.description}"
  ogImage: "${page.seo.ogImage || '/images/og-image.jpg'}"
  twitterCard: "${page.seo.twitterCard || 'summary_large_image'}"
layout: "homepage"
---

`

  const mdxContent = frontmatter + page.markdown

  await fs.mkdir('content/pages', { recursive: true })
  await fs.writeFile('content/pages/index.mdx', mdxContent)
  
  console.log('✅ Generated content/pages/index.mdx')
}

/**
 * Extract content from a single URL
 */
export async function extractPage(url: string, retries = 0): Promise<ScrapedPage | null> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
      timeout: 15000,
      maxRedirects: 5,
    })

    const $ = cheerio.load(response.data)
    const html = response.data
    
    // Extract SEO metadata
    const title = $('title').text() || $('meta[property="og:title"]').attr('content') || 'RBC Signals'
    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') || ''
    
    const seo = {
      ogTitle: $('meta[property="og:title"]').attr('content'),
      ogDescription: $('meta[property="og:description"]').attr('content'),
      ogImage: $('meta[property="og:image"]').attr('content'),
      twitterCard: $('meta[name="twitter:card"]').attr('content'),
      canonical: $('link[rel="canonical"]').attr('href'),
    }

    // Extract main content (skip header, footer, nav)
    $('header, footer, nav, script, style, .sidebar').remove()
    const mainContent = $('main').html() || $('article').html() || $('.content').html() || $('body').html() || ''
    
    // Extract images
    const images: string[] = []
    $('img').each((_, el) => {
      const src = $(el).attr('src')
      if (src) {
        images.push(src.startsWith('http') ? src : `${BASE_URL}${src}`)
      }
    })

    // Convert to markdown
    const markdown = turndownService.turndown(mainContent)

    // Extract forms
    const forms = extractForms(url, html)

    // Extract analytics
    const analytics = extractAnalytics(html)

    const scrapedPage: ScrapedPage = {
      url,
      title,
      description,
      content: mainContent,
      markdown,
      seo,
      images,
      forms,
      analytics,
    }

    return scrapedPage
  } catch (error) {
    if (retries < 3) {
      await sleep(2000)
      return extractPage(url, retries + 1)
    }
    console.error(`❌ Failed to extract ${url}:`, (error as Error).message)
    return null
  }
}

/**
 * Extract all pages from a list of URLs
 */
export async function extractAllPages(urls: string[]): Promise<Map<string, ScrapedPage>> {
  console.log(`\n📄 Extracting content from ${urls.length} pages...`)
  
  const pages = new Map<string, ScrapedPage>()
  let successCount = 0
  let failCount = 0

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    console.log(`  [${i + 1}/${urls.length}] ${url}`)
    
    const page = await extractPage(url)
    if (page) {
      pages.set(url, page)
      successCount++
    } else {
      failCount++
    }

    // Polite delay between requests
    if (i < urls.length - 1) {
      await sleep(1000)
    }
  }

  console.log(`\n  ✅ Successfully extracted ${successCount} pages`)
  if (failCount > 0) {
    console.log(`  ⚠️  Failed to extract ${failCount} pages`)
  }

  return pages
}

/**
 * Generate MDX files for all pages
 */
export async function generateAllMDXFiles(pages: Map<string, ScrapedPage>): Promise<void> {
  console.log(`\n📝 Generating MDX files for ${pages.size} pages...`)
  
  await fs.mkdir('content/pages', { recursive: true })
  let count = 0

  for (const [url, page] of pages) {
    const filePath = urlToFilePath(url)
    const frontmatter = `---
title: "${page.title.replace(/"/g, '\\"')}"
description: "${page.description.replace(/"/g, '\\"')}"
url: "${urlToPath(url)}"
seo:
  ogTitle: "${page.seo.ogTitle || page.title}"
  ogDescription: "${page.seo.ogDescription || page.description}"
  ogImage: "${page.seo.ogImage || '/images/og-image.jpg'}"
  twitterCard: "${page.seo.twitterCard || 'summary_large_image'}"
layout: "${inferLayout(url)}"
---

`

    const mdxContent = frontmatter + page.markdown

    const fullPath = path.join('content/pages', filePath)
    await fs.mkdir(path.dirname(fullPath), { recursive: true })
    await fs.writeFile(fullPath, mdxContent)
    count++
  }

  console.log(`  ✅ Generated ${count} MDX files`)
}

/**
 * Convert WordPress URL to file path
 */
function urlToFilePath(url: string): string {
  const urlObj = new URL(url)
  let pathname = urlObj.pathname

  // Remove trailing slash
  if (pathname.endsWith('/') && pathname.length > 1) {
    pathname = pathname.slice(0, -1)
  }

  // Homepage
  if (pathname === '' || pathname === '/') {
    return 'index.mdx'
  }

  // Convert to file path
  return pathname.slice(1) + '.mdx'
}

/**
 * Convert WordPress URL to Next.js path
 */
function urlToPath(url: string): string {
  const urlObj = new URL(url)
  return urlObj.pathname
}

/**
 * Infer layout from URL pattern
 */
function inferLayout(url: string): string {
  const urlObj = new URL(url)
  const pathname = urlObj.pathname

  if (pathname === '/' || pathname === '') return 'homepage'
  if (pathname.includes('/services/')) return 'service'
  if (pathname.includes('/customers/')) return 'customer'
  if (pathname.includes('/about')) return 'about'
  if (pathname.includes('/contact')) return 'contact'
  if (pathname.includes('/news/') || pathname.includes('/blog/')) return 'post'
  
  return 'default'
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
