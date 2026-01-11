import * as cheerio from 'cheerio'

interface AnalyticsScript {
  type: string
  id?: string
  code: string
  location: 'head' | 'body'
}

/**
 * Extract analytics and tracking scripts from page HTML
 */
export function extractAnalytics(html: string): AnalyticsScript[] {
  const $ = cheerio.load(html)
  const scripts: AnalyticsScript[] = []

  // Patterns to detect analytics providers
  const patterns = [
    { name: 'Google Analytics (gtag.js)', pattern: /gtag\(|googletagmanager\.com\/gtag/i },
    { name: 'Google Analytics (analytics.js)', pattern: /google-analytics\.com\/analytics\.js|ga\('create'/i },
    { name: 'Google Tag Manager', pattern: /googletagmanager\.com\/gtm\.js/i },
    { name: 'Facebook Pixel', pattern: /connect\.facebook\.net\/.*\/fbevents\.js|fbq\(/i },
    { name: 'Hotjar', pattern: /static\.hotjar\.com/i },
    { name: 'Mixpanel', pattern: /cdn\.mxpnl\.com|mixpanel\./i },
    { name: 'Segment', pattern: /cdn\.segment\.com/i },
    { name: 'Plausible', pattern: /plausible\.io/i },
    { name: 'Matomo', pattern: /matomo\.js|piwik\.js/i },
  ]

  // Check script tags
  $('script').each((_, el) => {
    const $script = $(el)
    const src = $script.attr('src')
    const content = $script.html() || ''
    const location = $script.closest('head').length > 0 ? 'head' : 'body'

    for (const { name, pattern } of patterns) {
      if (pattern.test(src || '') || pattern.test(content)) {
        // Extract tracking ID
        let id: string | undefined

        if (name.includes('Google Analytics') || name.includes('Google Tag Manager')) {
          // Extract GA or GTM ID
          const gaMatch = (src || content).match(/(UA-\d+-\d+|G-[A-Z0-9]+|GTM-[A-Z0-9]+)/i)
          if (gaMatch) {
            id = gaMatch[1]
          }
        } else if (name === 'Facebook Pixel') {
          // Extract FB Pixel ID
          const fbMatch = content.match(/fbq\('init',\s*'(\d+)'/i)
          if (fbMatch) {
            id = fbMatch[1]
          }
        }

        scripts.push({
          type: name,
          id,
          code: src || content.substring(0, 200), // truncate inline scripts
          location,
        })

        break // Only match once per script
      }
    }
  })

  // Check noscript tags for GTM/FB
  $('noscript').each((_, el) => {
    const content = $(el).html() || ''
    if (/googletagmanager\.com/i.test(content)) {
      scripts.push({
        type: 'Google Tag Manager (noscript)',
        code: content.substring(0, 200),
        location: 'body',
      })
    } else if (/facebook\.com\/tr/i.test(content)) {
      scripts.push({
        type: 'Facebook Pixel (noscript)',
        code: content.substring(0, 200),
        location: 'body',
      })
    }
  })

  return scripts
}
