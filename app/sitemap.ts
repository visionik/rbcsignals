import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rbcsignals.com'
  const pagesDir = path.join(process.cwd(), 'content/pages')

  function getAllMdxFiles(dir: string, basePath = ''): string[] {
    const files: string[] = []
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name

      if (entry.isDirectory()) {
        files.push(...getAllMdxFiles(fullPath, relativePath))
      } else if (entry.name.endsWith('.mdx')) {
        files.push(fullPath)
      }
    }

    return files
  }

  const mdxFiles = getAllMdxFiles(pagesDir)
  
  const pages: MetadataRoute.Sitemap = mdxFiles.map((filePath) => {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)
    
    // Convert file path to URL path
    let urlPath = filePath
      .replace(pagesDir, '')
      .replace(/\.mdx$/, '')
      .replace(/\/index$/, '')
    
    if (!urlPath) urlPath = '/'

    return {
      url: `${baseUrl}${urlPath}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: urlPath === '/' ? 1.0 : 0.8,
    }
  })

  return pages
}
