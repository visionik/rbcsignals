import axios from 'axios'
import * as cheerio from 'cheerio'
import * as fs from 'fs/promises'

const BASE_URL = 'https://rbcsignals.com'
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

interface MenuItem {
  label: string
  href?: string
  items?: MenuItem[]
}

interface Navigation {
  header: {
    logo: string
    menu: MenuItem[]
  }
  footer: {
    copyright: string
    sections: Array<{
      title: string
      links: Array<{ label: string; href: string }>
    }>
  }
}

/**
 * Extract navigation structure from WordPress site
 */
export async function extractNavigation(): Promise<Navigation> {
  console.log('🧭 Extracting navigation structure...')

  try {
    const response = await axios.get(BASE_URL, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 15000,
    })

    const $ = cheerio.load(response.data)

    // Extract header navigation
    const headerMenu: MenuItem[] = []
    
    // Try common WordPress navigation selectors
    const navSelectors = [
      'nav#site-navigation',
      'nav.main-navigation',
      '.primary-menu',
      'header nav',
      '.navbar',
    ]

    let $nav: cheerio.Cheerio<any> | null = null
    for (const selector of navSelectors) {
      $nav = $(selector)
      if ($nav.length > 0) break
    }

    if ($nav && $nav.length > 0) {
      // Extract menu items (handle nested dropdowns)
      $nav.find('> ul > li, > div > ul > li').each((_, li) => {
        const $li = $(li)
        const $link = $li.find('> a').first()
        const label = $link.text().trim()
        const href = $link.attr('href')

        if (!label) return

        const menuItem: MenuItem = { label }
        
        // Add href if it exists and normalize it
        if (href) {
          menuItem.href = normalizeUrl(href)
        }

        // Check for dropdown/submenu
        const $submenu = $li.find('> ul, > .sub-menu, > .dropdown-menu')
        if ($submenu.length > 0) {
          menuItem.items = []
          $submenu.find('> li').each((_, subli) => {
            const $sublink = $(subli).find('> a').first()
            const sublabel = $sublink.text().trim()
            const subhref = $sublink.attr('href')

            if (sublabel) {
              menuItem.items!.push({
                label: sublabel,
                href: subhref ? normalizeUrl(subhref) : undefined,
              })
            }
          })
        }

        headerMenu.push(menuItem)
      })
    }

    // Extract logo
    let logo = '/images/logo.png'
    const $logo = $('header img, .site-logo img, .custom-logo').first()
    if ($logo.length > 0) {
      const logoSrc = $logo.attr('src')
      if (logoSrc) {
        logo = logoSrc.startsWith('http') ? logoSrc : `${BASE_URL}${logoSrc}`
      }
    }

    // Extract footer navigation
    const footerSections: Array<{ title: string; links: Array<{ label: string; href: string }> }> = []
    
    $('footer .widget, footer .footer-column, footer nav').each((_, widget) => {
      const $widget = $(widget)
      const title = $widget.find('.widget-title, h3, h4, h5').first().text().trim()
      
      if (!title) return

      const links: Array<{ label: string; href: string }> = []
      $widget.find('ul li a, a').each((_, link) => {
        const $link = $(link)
        const label = $link.text().trim()
        const href = $link.attr('href')

        if (label && href && !href.startsWith('#')) {
          links.push({
            label,
            href: normalizeUrl(href),
          })
        }
      })

      if (links.length > 0) {
        footerSections.push({ title, links })
      }
    })

    // Extract copyright
    let copyright = `© ${new Date().getFullYear()} RBC Signals. All rights reserved.`
    const $copyright = $('footer .copyright, footer .site-info, footer p').filter((_, el) => {
      const text = $(el).text()
      return /©|copyright/i.test(text)
    }).first()
    
    if ($copyright.length > 0) {
      copyright = $copyright.text().trim()
    }

    const navigation: Navigation = {
      header: {
        logo,
        menu: headerMenu,
      },
      footer: {
        copyright,
        sections: footerSections,
      },
    }

    // Save to file
    await fs.mkdir('content/data', { recursive: true })
    await fs.writeFile(
      'content/data/navigation.json',
      JSON.stringify(navigation, null, 2)
    )

    console.log(`  ✅ Extracted ${headerMenu.length} header menu items`)
    console.log(`  ✅ Extracted ${footerSections.length} footer sections`)
    console.log('  ✅ Saved to content/data/navigation.json')

    return navigation
  } catch (error) {
    console.error('  ❌ Error extracting navigation:', error)
    throw error
  }
}

function normalizeUrl(url: string): string {
  if (url.startsWith('http')) {
    return url
  }
  if (url.startsWith('/')) {
    return url
  }
  return `/${url}`
}
