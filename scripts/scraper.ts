#!/usr/bin/env tsx

import { extractBrandAssets } from './extract-brand'
import { extractHomepage } from './extract-content'
import { downloadImages, downloadLogo } from './extract-images'

async function main() {
  const args = process.argv.slice(2)
  const isHomepageOnly = args.includes('--pages=homepage')

  console.log('🚀 RBC Signals Website Scraper')
  console.log('================================')

  if (isHomepageOnly) {
    console.log('Mode: Homepage only (Phase 1 MVP)\n')
  } else {
    console.log('Mode: Full site scrape (Phase 2)\n')
    console.log('⚠️  Full site scraping not yet implemented')
    console.log('   Run with --pages=homepage for Phase 1\n')
    process.exit(1)
  }

  try {
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
  } catch (error) {
    console.error('\n❌ Scraping failed:', error)
    process.exit(1)
  }
}

main()
