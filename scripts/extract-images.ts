import axios from 'axios'
import * as fs from 'fs/promises'
import * as path from 'path'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'

const BASE_URL = 'https://rbcsignals.com'

export async function downloadImages(imageUrls: string[]): Promise<void> {
  console.log(`📷 Downloading ${imageUrls.length} images...`)

  const downloadedCount = { success: 0, failed: 0 }

  for (const imageUrl of imageUrls) {
    try {
      await downloadImage(imageUrl)
      downloadedCount.success++
    } catch (error) {
      console.warn(`⚠️  Failed to download ${imageUrl}:`, error)
      downloadedCount.failed++
    }
  }

  console.log(
    `✅ Downloaded ${downloadedCount.success} images (${downloadedCount.failed} failed)`
  )
}

async function downloadImage(imageUrl: string): Promise<void> {
  // Determine output path - preserve WordPress paths or use /images/
  let outputPath: string

  if (imageUrl.includes('/wp-content/uploads/')) {
    // Preserve WordPress asset URL structure
    const wpPath = imageUrl.split('/wp-content/uploads/')[1]
    outputPath = path.join('public/wp-content/uploads', wpPath || '')
  } else {
    // Extract filename and save to /images/
    const filename = path.basename(new URL(imageUrl).pathname)
    outputPath = path.join('public/images', filename)
  }

  // Ensure directory exists
  await fs.mkdir(path.dirname(outputPath), { recursive: true })

  // Download image
  const response = await axios.get(imageUrl, {
    responseType: 'stream',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    },
    timeout: 30000,
  })

  // Save to file
  const writer = createWriteStream(outputPath)
  await pipeline(response.data, writer)

  console.log(`  ✓ ${path.basename(outputPath)}`)
}

export async function downloadLogo(logoUrl: string): Promise<string> {
  console.log('🖼️  Downloading logo...')

  try {
    const filename = path.basename(new URL(logoUrl).pathname)
    const outputPath = path.join('public/images', filename)

    await fs.mkdir('public/images', { recursive: true })

    const response = await axios.get(logoUrl, {
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
    })

    const writer = createWriteStream(outputPath)
    await pipeline(response.data, writer)

    console.log(`✅ Logo downloaded: ${filename}`)
    return `/images/${filename}`
  } catch (error) {
    console.error('❌ Failed to download logo:', error)
    return '/images/logo.png' // Fallback
  }
}
