import axios from 'axios'
import * as cheerio from 'cheerio'
import * as fs from 'fs/promises'
import * as path from 'path'
import type { BrandAssets } from './types/scraped-content'

const BASE_URL = 'https://rbcsignals.com'

export async function extractBrandAssets(): Promise<BrandAssets> {
  console.log('🎨 Extracting brand assets...')

  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
    })

    const $ = cheerio.load(response.data)
    const colors = await extractColors($, response.data)
    const fonts = extractFonts($, response.data)
    const logo = extractLogo($)

    const brandAssets: BrandAssets = {
      colors,
      fonts,
      logo,
    }

    // Save to content/data/brand.json
    await fs.mkdir('content/data', { recursive: true })
    await fs.writeFile(
      'content/data/brand.json',
      JSON.stringify(brandAssets, null, 2)
    )

    // Generate tailwind config with brand colors
    await generateTailwindConfig(brandAssets)

    console.log('✅ Brand assets extracted successfully')
    return brandAssets
  } catch (error) {
    console.error('❌ Error extracting brand assets:', error)
    throw error
  }
}

async function extractColors(
  $: cheerio.CheerioAPI,
  html: string
): Promise<BrandAssets['colors']> {
  // Try to find inline styles and extract common colors
  const colorMap = new Map<string, number>()

  // Parse inline styles
  $('[style]').each((_, el) => {
    const style = $(el).attr('style') || ''
    const colorMatches = style.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\)/g)
    colorMatches?.forEach((color) => {
      colorMap.set(color, (colorMap.get(color) || 0) + 1)
    })
  })

  // Extract from CSS links
  const cssLinks = $('link[rel="stylesheet"]')
    .map((_, el) => $(el).attr('href'))
    .get()

  for (const href of cssLinks) {
    if (href && href.includes(BASE_URL)) {
      try {
        const cssResponse = await axios.get(href, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' },
        })
        const cssColors = cssResponse.data.match(/#[0-9a-fA-F]{6}/g) || []
        cssColors.forEach((color: string) => {
          colorMap.set(color, (colorMap.get(color) || 0) + 1)
        })
      } catch (err) {
        // Skip failed CSS fetches
      }
    }
  }

  // Sort by frequency and pick most common colors
  const sortedColors = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([color]) => color)

  return {
    primary: sortedColors[0] || '#1a56db',
    secondary: sortedColors[1] || '#0e7490',
    accent: sortedColors[2] || '#f59e0b',
    background: '#ffffff',
    text: '#1f2937',
  }
}

function extractFonts($: cheerio.CheerioAPI, html: string): BrandAssets['fonts'] {
  // Look for Google Fonts or font-family declarations
  let headingFont = 'Inter, sans-serif'
  let bodyFont = 'Inter, sans-serif'

  // Check for Google Fonts
  const googleFontsLink = $('link[href*="fonts.googleapis.com"]').attr('href')
  if (googleFontsLink) {
    const fontMatch = googleFontsLink.match(/family=([^:&]+)/)
    if (fontMatch?.[1]) {
      const fontName = fontMatch[1].replace(/\+/g, ' ')
      headingFont = `${fontName}, sans-serif`
      bodyFont = `${fontName}, sans-serif`
    }
  }

  // Try to extract from inline styles
  const bodyStyle = $('body').attr('style') || ''
  const fontFamilyMatch = bodyStyle.match(/font-family:\s*([^;]+)/)
  if (fontFamilyMatch?.[1]) {
    bodyFont = fontFamilyMatch[1].trim()
  }

  return {
    heading: headingFont,
    body: bodyFont,
  }
}

function extractLogo($: cheerio.CheerioAPI): BrandAssets['logo'] {
  // Look for logo in common locations
  const logoSelectors = [
    'img[class*="logo"]',
    'a.logo img',
    '.site-logo img',
    'header img[alt*="logo" i]',
    'header img',
  ]

  for (const selector of logoSelectors) {
    const logoImg = $(selector).first()
    if (logoImg.length) {
      const src = logoImg.attr('src')
      if (src) {
        return {
          default: src.startsWith('http') ? src : `${BASE_URL}${src}`,
        }
      }
    }
  }

  return {
    default: '/images/logo.png',
  }
}

async function generateTailwindConfig(brandAssets: BrandAssets): Promise<void> {
  const configContent = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '${brandAssets.colors.primary}',
        secondary: '${brandAssets.colors.secondary}',
        accent: '${brandAssets.colors.accent}',
      },
      fontFamily: {
        heading: [${brandAssets.fonts.heading.split(',').map((f) => `'${f.trim()}'`).join(', ')}],
        body: [${brandAssets.fonts.body.split(',').map((f) => `'${f.trim()}'`).join(', ')}],
      },
    },
  },
  plugins: [],
}
`

  await fs.writeFile('tailwind.config.js', configContent)
  console.log('✅ Updated tailwind.config.js with brand colors')
}
