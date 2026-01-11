#!/usr/bin/env tsx

import { extractBrandAssets } from './extract-brand'
import { extractHomepage, extractAllPages, generateAllMDXFiles } from './extract-content'
import { downloadImages, downloadLogo, downloadAllImages } from './extract-images'
import { discoverAllUrls } from './crawl'
import { extractNavigation } from './extract-navigation'
import { generateAllReports } from './generate-reports'

async function main() {
  const args = process.argv.slice(2)
  const isHomepageOnly = args.includes('--pages=homepage')

  console.log('🚀 RBC Signals Website Scraper')
  console.log('================================')

  if (isHomepageOnly) {
    console.log('Mode: Homepage only (Phase 1 MVP)\n')
  } else {
    console.log('Mode: Full site scrape (Phase 2)\n')
  }

  try {
    if (isHomepageOnly) {
      // Phase 1: Homepage only
      // Step 1: Extract brand assets (colors, fonts, logo)
      console.log('\n📦 Step 1: Extracting brand assets...')
      const brandAssets = await extractBrandAssets()

      // Step 2: Download logo
      console.log('\n📦 Step 2: Downloading logo...')
      await downloadLogo(brandAssets.logo.default)

      // Step 3: Extract homepage content
      console.log('\n📦 Step 3: Extracting homepage content...')
      const homepage = await extractHomepage()

      // Step 4: Download homepage images
      console.log('\n📦 Step 4: Downloading homepage images...')
      await downloadImages(homepage.images)

      // Success summary
      console.log('\n✨ Scraping completed successfully!')
      console.log('================================')
      console.log('Generated files:')
      console.log('  - content/data/brand.json')
      console.log('  - content/pages/index.mdx')
      console.log('  - tailwind.config.js (updated)')
      console.log(`  - Downloaded ${homepage.images.length} images`)
      console.log('\nNext steps:')
      console.log('  1. Run: npm run dev')
      console.log('  2. Open: http://localhost:3000')
      console.log('  3. Build homepage components (Task 3)')
    } else {
      // Phase 2: Full site
      // Step 1: Extract brand assets
      console.log('\n📦 Step 1: Extracting brand assets...')
      const brandAssets = await extractBrandAssets()
      await downloadLogo(brandAssets.logo.default)

      // Step 2: Extract navigation
      console.log('\n📦 Step 2: Extracting navigation structure...')
      await extractNavigation()

      // Step 3: Discover all URLs
      console.log('\n📦 Step 3: Discovering all pages...')
      const urls = await discoverAllUrls()
      const urlArray = Array.from(urls)

      // Step 4: Extract all page content
      console.log('\n📦 Step 4: Extracting all page content...')
      const pages = await extractAllPages(urlArray)

      // Step 5: Generate MDX files
      console.log('\n📦 Step 5: Generating MDX files...')
      await generateAllMDXFiles(pages)

      // Step 6: Download all images
      console.log('\n📦 Step 6: Downloading all images...')
      const allImages = new Set<string>()
      for (const page of pages.values()) {
        page.images.forEach(img => allImages.add(img))
      }
      await downloadAllImages(Array.from(allImages))

      // Step 7: Generate reports
      console.log('\n📦 Step 7: Generating reports...')
      await generateAllReports(pages)

      // Success summary
      console.log('\n✨ Full site scraping completed successfully!')
      console.log('================================')
      console.log('Statistics:')
      console.log(`  - ${pages.size} pages extracted`)
      console.log(`  - ${allImages.size} images downloaded`)
      console.log('\nGenerated files:')
      console.log('  - content/data/brand.json')
      console.log('  - content/data/navigation.json')
      console.log(`  - content/pages/*.mdx (${pages.size} files)`)
      console.log('  - reports/migration-report.json')
      console.log('  - reports/url-audit.json')
      console.log('  - reports/forms.json')
      console.log('  - reports/analytics-audit.json')
      console.log('\nNext steps:')
      console.log('  1. Review reports/ directory for migration status')
      console.log('  2. Build component library (Task 7)')
      console.log('  3. Implement dynamic routing (Task 8)')
    }
  } catch (error) {
    console.error('\n❌ Scraping failed:', error)
    process.exit(1)
  }
}

main()
