export interface ScrapedPage {
  url: string
  title: string
  description: string
  content: string // HTML content
  markdown: string // Converted markdown
  seo: {
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    twitterCard?: string
    canonical?: string
  }
  images: string[] // Image URLs found in content
  forms?: any[] // Forms found on page
  analytics?: any[] // Analytics scripts found on page
  publishedAt?: string
  updatedAt?: string
}

export interface BrandColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

export interface BrandFonts {
  heading: string
  body: string
}

export interface BrandAssets {
  colors: BrandColors
  fonts: BrandFonts
  logo: {
    default: string
    light?: string
  }
}

export interface NavigationItem {
  label: string
  href: string
  items?: NavigationItem[]
}

export interface Navigation {
  header: {
    logo: string
    menu: NavigationItem[]
  }
  footer: {
    copyright: string
    links: NavigationItem[]
  }
}

export interface MigrationStatus {
  url: string
  status: 'success' | 'partial' | 'failed'
  converted: string[]
  flagged: string[]
  errors?: string[]
}
