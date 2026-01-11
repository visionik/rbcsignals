import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/components/mdx-components'

interface PageProps {
  params: Promise<{
    slug: string[]
  }>
}

async function getPageContent(slug: string[]) {
  const slugPath = slug.join('/')
  const possiblePaths = [
    path.join(process.cwd(), 'content/pages', `${slugPath}.mdx`),
    path.join(process.cwd(), 'content/pages', slugPath, 'index.mdx'),
  ]

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)
      return { frontmatter: data, content, filePath }
    }
  }

  return null
}

export async function generateStaticParams() {
  const pagesDir = path.join(process.cwd(), 'content/pages')
  
  function getAllMdxFiles(dir: string, basePath = ''): string[][] {
    const files: string[][] = []
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name

      if (entry.isDirectory()) {
        files.push(...getAllMdxFiles(fullPath, relativePath))
      } else if (entry.name.endsWith('.mdx') && entry.name !== 'index.mdx') {
        // Convert file path to slug array
        const slug = relativePath.replace(/\.mdx$/, '').split('/')
        files.push(slug)
      }
    }

    return files
  }

  const slugs = getAllMdxFiles(pagesDir)
  return slugs.map(slug => ({ slug }))
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const pageData = await getPageContent(slug)

  if (!pageData) {
    notFound()
  }

  const { frontmatter, content } = pageData
  const layout = frontmatter.layout || 'default'

  return (
    <article className="min-h-screen">
      {/* Page Header */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {frontmatter.title}
          </h1>
          {frontmatter.description && (
            <p className="text-xl text-gray-300 max-w-3xl">
              {frontmatter.description}
            </p>
          )}
        </div>
      </header>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-12">
        <div className={getLayoutClass(layout)}>
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      </div>
    </article>
  )
}

function getLayoutClass(layout: string): string {
  switch (layout) {
    case 'service':
    case 'customer':
    case 'about':
      return 'prose prose-lg max-w-4xl mx-auto'
    case 'post':
      return 'prose prose-lg max-w-3xl mx-auto'
    case 'contact':
      return 'max-w-5xl mx-auto'
    default:
      return 'prose prose-lg max-w-4xl mx-auto'
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const pageData = await getPageContent(slug)

  if (!pageData) {
    return {
      title: 'Page Not Found',
    }
  }

  const { frontmatter } = pageData

  return {
    title: frontmatter.title || 'RBC Signals',
    description: frontmatter.description || '',
    openGraph: {
      title: frontmatter.seo?.ogTitle || frontmatter.title,
      description: frontmatter.seo?.ogDescription || frontmatter.description,
      images: frontmatter.seo?.ogImage ? [frontmatter.seo.ogImage] : [],
    },
    twitter: {
      card: frontmatter.seo?.twitterCard || 'summary_large_image',
      title: frontmatter.seo?.ogTitle || frontmatter.title,
      description: frontmatter.seo?.ogDescription || frontmatter.description,
    },
  }
}
