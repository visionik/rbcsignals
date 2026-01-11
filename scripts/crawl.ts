import axios from 'axios'
import * as cheerio from 'cheerio'
import { parseStringPromise } from 'xml2js'

const BASE_URL = 'https://rbcsignals.com'

// Polite crawling settings
const CRAWL_DELAY_MS = 1000 // 1 second between requests
const MAX_RETRIES = 3
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

// URL patterns to exclude
const EXCLUDE_PATTERNS = [
  /\/wp-admin\//,
  /\/wp-content\//,
  /\/wp-includes\//,
  /\/feed\//,
  /\/wp-json\//,
  /\.(xml|json|css|js|jpg|jpeg|png|gif|svg|pdf)$/i,
  /\/page\/\d+\/$/, // pagination
  /#/, // anchor links
]

interface CrawlResult {
  urls: Set<string>
  sitemapUrls: Set<string>
}

/**
 * Discover all URLs from WordPress sitemap
 */
export async function discoverFromSitemap(): Promise<Set<string>> {
  console.log('🗺️  Discovering URLs from sitemap...')
  const urls = new Set<string>()

  try {
    // Try sitemap index first
    const sitemapIndexUrl = `${BASE_URL}/sitemap_index.xml`
    const response = await axios.get(sitemapIndexUrl, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 10000,
    })

    const parsed = await parseStringPromise(response.data)

    // Check if it's a sitemap index
    if (parsed.sitemapindex?.sitemap) {
      console.log('  Found sitemap index')
      
      // Fetch each child sitemap
      for (const sitemap of parsed.sitemapindex.sitemap) {
        const sitemapUrl = sitemap.loc[0]
        console.log(`  Fetching ${sitemapUrl}`)
        
        await sleep(CRAWL_DELAY_MS)
        const sitemapResponse = await axios.get(sitemapUrl, {
          headers: { 'User-Agent': USER_AGENT },
          timeout: 10000,
        })

        const sitemapParsed = await parseStringPromise(sitemapResponse.data)
        if (sitemapParsed.urlset?.url) {
          for (const url of sitemapParsed.urlset.url) {
            urls.add(url.loc[0])
          }
        }
      }
    } else if (parsed.urlset?.url) {
      // Single sitemap
      console.log('  Found single sitemap')
      for (const url of parsed.urlset.url) {
        urls.add(url.loc[0])
      }
    }

    console.log(`  ✅ Found ${urls.size} URLs from sitemap`)
  } catch (error) {
    console.log('  ⚠️  Sitemap not found or failed to parse, will rely on crawling')
  }

  return urls
}

/**
 * Crawl a page and extract internal links
 */
async function crawlPage(url: string, retries = 0): Promise<string[]> {
  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 15000,
      maxRedirects: 5,
    })

    const $ = cheerio.load(response.data)
    const links: string[] = []

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href')
      if (!href) return

      // Normalize URL
      let fullUrl: string
      try {
        if (href.startsWith('http')) {
          fullUrl = href
        } else if (href.startsWith('/')) {
          fullUrl = `${BASE_URL}${href}`
        } else if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
          return // skip
        } else {
          fullUrl = new URL(href, url).href
        }

        // Only include same-domain links
        if (!fullUrl.startsWith(BASE_URL)) return

        // Remove fragment
        fullUrl = fullUrl.split('#')[0]

        // Check exclusion patterns
        if (EXCLUDE_PATTERNS.some(pattern => pattern.test(fullUrl))) return

        links.push(fullUrl)
      } catch (e) {
        // Invalid URL, skip
      }
    })

    return links
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.log(`  ⚠️  Retry ${retries + 1}/${MAX_RETRIES} for ${url}`)
      await sleep(CRAWL_DELAY_MS * 2) // longer delay on retry
      return crawlPage(url, retries + 1)
    }
    console.error(`  ❌ Failed to crawl ${url}:`, (error as Error).message)
    return []
  }
}

/**
 * Recursively crawl site starting from base URL
 */
export async function crawlSite(startUrls: Set<string>): Promise<Set<string>> {
  console.log('🕷️  Crawling site for additional URLs...')
  
  const discovered = new Set<string>(startUrls)
  const visited = new Set<string>()
  const queue = Array.from(startUrls)

  while (queue.length > 0) {
    const url = queue.shift()!
    if (visited.has(url)) continue

    visited.add(url)
    console.log(`  [${visited.size}/${discovered.size}] ${url}`)

    await sleep(CRAWL_DELAY_MS)
    const links = await crawlPage(url)

    for (const link of links) {
      if (!discovered.has(link)) {
        discovered.add(link)
        queue.push(link)
      }
    }
  }

  console.log(`  ✅ Crawled ${visited.size} pages, discovered ${discovered.size} unique URLs`)
  return discovered
}

/**
 * Main discovery function - combines sitemap and crawling
 */
export async function discoverAllUrls(): Promise<Set<string>> {
  // Start with sitemap
  const sitemapUrls = await discoverFromSitemap()

  // If sitemap found, use it as base
  if (sitemapUrls.size > 0) {
    console.log('Using sitemap URLs as base')
    return sitemapUrls
  }

  // Otherwise start crawling from homepage
  console.log('No sitemap found, starting recursive crawl from homepage')
  return crawlSite(new Set([BASE_URL]))
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
