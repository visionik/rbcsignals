import axios from 'axios'
import * as cheerio from 'cheerio'
import TurndownService from 'turndown'
import * as fs from 'fs/promises'
import type { ScrapedPage } from './types/scraped-content'

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
