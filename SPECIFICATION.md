# RBC Signals Website Rebuild - Project Specification

## Project Overview

Rebuild https://rbcsignals.com from WordPress to a modern static site using Next.js 14+ (App Router), TypeScript, Tailwind CSS, and Shadcn/UI. The project will modernize the tech stack while preserving existing content, brand identity, URLs (for SEO), and navigation structure.

## Goals

1. **Modernize tech stack** - Move from WordPress to Next.js static site generation
2. **Preserve SEO** - Maintain exact URL structure and metadata
3. **Extract and enhance design** - Keep brand colors/fonts, apply modern styling patterns
4. **Automate content migration** - Build integrated scraper to extract all content, images, and structure
5. **Deploy to Cloudflare Pages** - Fast edge network with zero-config deployment

## Technology Stack

### Core Stack
- **Framework**: Next.js 14+ (App Router) with static export (`output: 'export'`)
- **Language**: TypeScript 5.0+ (strict mode)
- **Styling**: Tailwind CSS + Shadcn/UI component library
- **Content**: Hybrid MDX (pages) + JSON (structured data)
- **Hosting**: Cloudflare Pages
- **Forms**: Tally embeds

### Development Tools
- **Package Manager**: npm
- **Task Runner**: Task (Taskfile.yml)
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode
- **Version Control**: Git

### Scraper Tools
- **Scraping**: Cheerio + Axios (or Puppeteer if JavaScript rendering needed)
- **Image Download**: Axios with stream handling
- **CSS Parsing**: PostCSS or CSS parsing library
- **HTML to Markdown**: Turndown or similar converter

## Content Structure

### Directory Layout
```
rbcsignals/
├── scripts/
│   ├── scraper.ts              # Main scraper orchestrator
│   ├── extract-brand.ts        # Brand assets extractor (colors, fonts, logos)
│   ├── extract-content.ts      # Content scraper (pages, posts)
│   ├── extract-images.ts       # Image downloader
│   ├── extract-navigation.ts   # Menu/nav structure
│   ├── extract-seo.ts          # SEO metadata extractor
│   ├── generate-sitemap.ts     # Sitemap generator and comparator
│   └── types/
│       └── scraped-content.ts  # TypeScript types for scraped data
├── content/
│   ├── pages/                  # Generated MDX (one per page)
│   │   ├── index.mdx           # Homepage
│   │   ├── about.mdx
│   │   ├── contact.mdx
│   │   └── services/
│   │       ├── global-connectivity.mdx
│   │       └── ...
│   └── data/                   # Generated JSON (structured data)
│       ├── navigation.json     # Site navigation structure
│       ├── site-config.json    # Site-wide settings
│       ├── brand.json          # Brand colors, fonts extracted from WP
│       └── analytics.json      # Analytics config used by the site (derived from audit; optional)
├── public/
│   ├── wp-content/             # Legacy WordPress asset paths (preserved for SEO/backlinks)
│   │   └── uploads/
│   │       └── ...
│   ├── images/                 # Curated/normalized images (optional)
│   │   └── ...
│   ├── fonts/                  # Custom fonts (if any)
│   ├── _redirects              # Cloudflare Pages redirects (if needed)
│   └── _headers                # Cloudflare Pages headers (if needed)
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── [[...slug]]/
│   │       └── page.tsx
│   ├── components/             # React components
│   │   ├── ui/                # Shadcn/UI components
│   │   ├── layout/            # Header, Footer, Navigation
│   │   ├── sections/          # Hero, CTA, Features sections
│   │   └── mdx/               # MDX custom components
│   ├── lib/
│   │   ├── mdx.ts             # MDX processing utilities
│   │   ├── content.ts         # Content loading utilities
│   │   └── utils.ts           # General utilities
│   └── styles/
│       └── globals.css         # Global styles + Tailwind imports
├── reports/                    # Generated during scraping
│   ├── migration-report.json   # Conversion status per page
│   ├── url-audit.json          # URL mapping old→new
│   ├── old-sitemap.xml         # WordPress sitemap
│   ├── new-sitemap.xml         # Next.js sitemap
│   ├── analytics-audit.json    # Detected analytics/tracking (raw audit)
│   ├── forms.json              # Documented forms for Tally recreation
│   └── scraper-errors.log      # Non-fatal scraper errors / summary
├── Taskfile.yml
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

### Generated Content Ownership
- `content/pages/` and `content/data/` are considered **generated output**.
- Running the scraper may overwrite generated files.
- Any manual edits should be made by:
  - updating the scraper transforms (preferred), or
  - adding an explicit override mechanism (e.g., `content/overrides/` that the site loads before generated content).

### MDX Page Format
```mdx
---
title: "Global Connectivity Services"
description: "RBC Signals provides global satellite connectivity..."
url: "/services/global-connectivity/"
seo:
  ogTitle: "Global Connectivity | RBC Signals"
  ogDescription: "..."
  ogImage: "/images/og-global-connectivity.jpg"
  twitterCard: "summary_large_image"
layout: "service"
publishedAt: "2024-01-15"
updatedAt: "2025-01-10"
---

# Global Connectivity Services

Content here...

<CTASection title="Get Started" />
```

### JSON Data Format Examples

**navigation.json**
```json
{
  "header": {
    "logo": "/images/logo.png",
    "menu": [
      {
        "label": "Customers",
        "items": [
          {"label": "Commercial LEO", "href": "/customers/commercial-leo/"},
          {"label": "Government", "href": "/customers/government/"},
          {"label": "Commercial GEO", "href": "/customers/commercial-geo/"}
        ]
      },
      {
        "label": "Services",
        "items": [
          {"label": "Global Connectivity", "href": "/services/global-connectivity/"},
          {"label": "GSaaS", "href": "/services/gsaas/"},
          {"label": "Spectrum Services", "href": "/services/spectrum-services/"}
        ]
      },
      {"label": "Contact", "href": "/contact/"}
    ]
  },
  "footer": {
    "copyright": "© 2025 RBC Signals. All rights reserved.",
    "links": [...]
  }
}
```

**brand.json**
```json
{
  "colors": {
    "primary": "#1a56db",
    "secondary": "#0e7490",
    "accent": "#f59e0b",
    "background": "#ffffff",
    "text": "#1f2937"
  },
  "fonts": {
    "heading": "Inter, sans-serif",
    "body": "Inter, sans-serif"
  },
  "logo": {
    "default": "/images/logo.png",
    "light": "/images/logo-light.png"
  }
}
```

## Scraper Requirements

### Core Functionality

#### 0. Discovery & Crawl Inputs
- Use WordPress sitemaps as the canonical URL list (sitemap index + child sitemaps)
- Augment with crawling internal links to catch orphaned pages
- Support allow/deny patterns (e.g., exclude `/wp-admin/`, feeds, etc.)
- Be polite: concurrency limit + retries with backoff, and set a consistent User-Agent

#### 1. Content Extraction
- Scrape all pages from WordPress site recursively
- Follow internal links to discover all pages
- Extract page HTML content, title, meta tags
- Convert HTML to Markdown/MDX format
- Preserve heading hierarchy and structure

#### 2. Navigation Structure
- Extract WordPress menu structure (primary menu, footer menu)
- Preserve exact hierarchy and relationships
- Generate `navigation.json` with all menu items and dropdowns

#### 3. Brand Asset Extraction
- Parse CSS files to extract:
  - Color palette (primary, secondary, accent, backgrounds)
  - Typography (font families, sizes, weights)
- Download logo images and favicon
- Generate `brand.json` and `tailwind.config.js` color/font config

#### 4. Image Handling
- Download all images referenced in content (including CSS background images where feasible)
- Preserve original filenames and, when possible, original WordPress paths
- Prefer preserving legacy asset URLs by writing to `public/wp-content/uploads/...` so existing references like `/wp-content/uploads/...` continue to work
- Only rewrite image references when necessary; record any rewrites in `reports/migration-report.json`
- Skip downloading external CDN images by default (leave as external URLs)

#### 5. SEO Metadata Preservation
- Extract all meta tags (title, description, keywords)
- Extract Open Graph tags (og:title, og:description, og:image)
- Extract Twitter Card tags
- Preserve canonical URLs
- Store in MDX frontmatter

#### 6. URL Mapping & Sitemap
- Generate URL mapping: WordPress URL → Next.js file path
- Create comparison sitemaps:
  - `old-sitemap.xml` (from WordPress)
  - `new-sitemap.xml` (generated from MDX files)
- Generate `url-audit.json` with status of each URL (preserved/redirected/missing)

#### 7. WordPress-Specific Element Handling (Smart Conversion)
- **Auto-convert**:
  - Images → `<Image>` components with proper sizing
  - Galleries → `<Gallery>` component with array of images
  - Buttons → Shadcn Button components
  - Headings, lists, links → Standard Markdown
  - Embedded videos (YouTube, Vimeo) → `<VideoEmbed>` component
- **Flag for manual review**:
  - Contact forms → Document fields, note "Replace with Tally"
  - Custom shortcodes → Preserve HTML in `<div dangerouslySetInnerHTML>`
  - Plugin-specific features → Document in migration report
- Generate `migration-report.json` with:
  - Per-page conversion status
  - List of auto-converted elements
  - List of flagged elements needing manual work

#### 8. Analytics & Tracking Audit
- Detect and document all analytics scripts (Google Analytics, Tag Manager, etc.)
- Extract tracking IDs and configuration
- Store the raw audit in `reports/analytics-audit.json` for reference during Next.js implementation
- Optionally derive a cleaned runtime config in `content/data/analytics.json` once analytics decisions are made

#### 9. Form Documentation
- Document all forms found on site:
  - Form fields (name, type, required/optional)
  - Field labels and placeholders
  - Submit button text
  - Form validation rules (if visible in HTML)
- Generate `forms.json` with structured form data for Tally recreation

### Scraper Output Artifacts

After scraping completes, the following should be generated:

1. **Content files**:
   - `content/pages/*.mdx` (all pages)
   - `content/data/*.json` (structured data)

2. **Media assets**:
   - `public/wp-content/uploads/*` (downloaded WordPress media, preserving URLs)
   - `public/images/*` (optional curated/normalized images)
   - `public/fonts/*` (if custom fonts)

3. **Configuration**:
   - `tailwind.config.js` (with extracted brand colors/fonts)
   - `next.config.js` (static export config, including trailing slash policy)
   - `public/_redirects` and `public/_headers` for Cloudflare Pages (if needed)

4. **Reports** (in `reports/` directory):
   - `migration-report.json` - Conversion status per page
   - `url-audit.json` - URL mapping and verification
   - `old-sitemap.xml` - WordPress sitemap
   - `new-sitemap.xml` - Next.js sitemap
   - `analytics-audit.json` - Detected analytics/tracking (raw audit)
   - `forms.json` - Documented forms for Tally recreation
   - `scraper-errors.log` - Non-fatal scraper errors / summary

### Scraper Error Handling

- Log all errors to `reports/scraper-errors.log`
- Continue scraping on non-fatal errors
- Generate summary report of:
  - Pages successfully scraped
  - Pages with errors
  - Missing images (404s)
  - Broken internal links

## Next.js Site Requirements

### Core Features

#### 1. Static Site Generation
- Configure `next.config.js` with `output: 'export'`
- Preserve WordPress-style URLs (recommend `trailingSlash: true` so `/path/` renders as `/path/index.html`)
- Be explicit about slash behavior (consider `skipTrailingSlashRedirect: true` to avoid auto-redirecting `href`s)
- Generate static HTML for all routes at build time (no runtime server)
- Treat export mode as “static hosting”: features requiring a Next.js server runtime are out of scope (SSR, Middleware, Server Actions, etc.)
- Implement redirects/headers at the Cloudflare Pages layer (e.g., `_redirects`, `_headers`, or Pages rules/functions)

#### 2. Dynamic Routes from MDX
- Read all MDX files from `content/pages/`
- Use an App Router catch-all route (`app/[[...slug]]/page.tsx`) so nested URLs like `/services/global-connectivity/` are supported
- Use `generateStaticParams` to enumerate *all* routes at build time from the MDX file tree
- Ensure missing routes render a static 404 page

#### 3. MDX Processing
- Use `@next/mdx` or `next-mdx-remote` for MDX rendering
- Support custom components in MDX (CTA, Gallery, VideoEmbed, etc.)
- Render frontmatter metadata as page metadata

#### 4. Layout System
- Create reusable layouts:
  - Default layout (Header + Footer + content)
  - Homepage layout (Hero + sections)
  - Service page layout (Hero + features + CTA)
- Select layout based on MDX frontmatter `layout` field

#### 5. Navigation
- Load navigation structure from `content/data/navigation.json`
- Render dynamic header menu with dropdowns
- Highlight active page in navigation
- Render footer links

#### 6. Image Optimization
- Use `<Image>` where it improves layout stability/LCP, but note: in `output: 'export'` mode the default Next.js image optimizer is not available
- Default approach: configure `images: { unoptimized: true }` and rely on good source assets + Cloudflare caching
- Optional enhancement: configure a custom `next/image` loader (external optimization service) if image optimization becomes a priority

#### 7. SEO Implementation
- Generate `<head>` metadata from MDX frontmatter
- Create `sitemap.xml` at build time
- Create `robots.txt`
- Preserve canonical host + trailing slash policy (www vs non-www, `/path/` vs `/path`) via Cloudflare Pages redirects
- Implement JSON-LD structured data for organization/business

#### 8. Form Integration
- Embed Tally forms on contact page
- Use Tally embed code with React integration
- Style Tally form to match site design (if customization available)

#### 9. Analytics Integration
- Conditionally load analytics based on `content/data/analytics.json`
- Support Google Analytics 4 via `next/script`
- Ensure GDPR compliance if needed (cookie consent)

#### 10. Design System
- Configure Tailwind with extracted brand colors from scraper
- Install and configure Shadcn/UI components
- Create custom components matching WordPress design patterns:
  - Hero sections
  - Feature grids
  - CTA blocks
  - Service cards
  - Customer logos
  - Testimonials (if present)

### Component Library

#### Shadcn/UI Components to Install
- Button
- Card
- Navigation Menu
- Separator
- Typography utilities

#### Custom Components to Build
- `<Header />` - Site header with logo and navigation
- `<Footer />` - Site footer with links and copyright
- `<Hero />` - Hero section (image, title, subtitle, CTA)
- `<CTASection />` - Call-to-action block
- `<FeatureGrid />` - Grid of features with icons
- `<ServiceCard />` - Service overview card
- `<Gallery />` - Image gallery (lightbox optional)
- `<VideoEmbed />` - YouTube/Vimeo embed wrapper
- `<MDXComponents />` - Custom components available in MDX

### Performance Requirements
- Lighthouse score targets:
  - Performance: ≥90
  - Accessibility: ≥95
  - Best Practices: ≥95
  - SEO: 100
- First Contentful Paint: <1.5s
- Total bundle size: <500KB (gzipped)

## Testing & Quality Assurance

### Automated Testing
- TypeScript type checking (`tsc --noEmit`)
- ESLint for code quality
- Prettier for code formatting
- Build verification (ensures static export completes without errors)

### Manual Testing Checklist
- All pages load correctly
- Navigation works on all pages
- Images display correctly
- Forms (Tally embeds) work
- Mobile responsive on all pages
- Cross-browser testing (Chrome, Firefox, Safari, Edge)

### Pre-Deployment Verification
- Run `task check` (lint, type check, build)
- Verify `url-audit.json` shows all URLs preserved
- Compare old and new sitemaps
- Test all navigation links
- Verify analytics tracking (if implemented)

## Deployment

### Cloudflare Pages Setup
1. Connect GitHub repository to Cloudflare Pages
2. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `out/`
   - Node.js version: 20.x
3. Set environment variables (if any)
4. Configure custom domain: rbcsignals.com
5. Enable automatic deployments on push to `main`

### DNS Configuration
- Point domain to Cloudflare Pages
- Ensure SSL/TLS certificate is active
- Configure redirects if needed (www → non-www or vice versa)

### Rollback Plan
- Keep WordPress site running initially
- Test new site on Cloudflare Pages preview URL
- Switch DNS only after full verification
- Keep WordPress backup for 30 days in case of rollback

## Project Phases

### Phase 1: MVP (Homepage Only)
**Goal**: Validate approach with minimal working site

**Tasks**:
1. **Project Setup** (1 task, no deps)
   - Initialize Next.js project with TypeScript
   - Install dependencies (Tailwind, Shadcn/UI, MDX)
   - Configure `next.config.js` for static export
   - Set up Taskfile with basic tasks
   - Configure ESLint, Prettier, TypeScript strict mode

2. **Basic Scraper** (1 task, no deps)
   - Create scraper structure in `scripts/`
   - Implement homepage scraping only
   - Extract brand assets (colors, fonts, logo)
   - Download homepage images
   - Generate `content/pages/index.mdx`
   - Generate `content/data/brand.json`
   - Generate `tailwind.config.js` with brand colors

3. **Next.js Foundation** (depends on tasks 1, 2)
   - Create basic layout components (Header, Footer)
   - Implement MDX rendering for homepage
   - Configure Tailwind with brand colors
   - Install initial Shadcn/UI components
   - Create Hero and CTA components
   - Build homepage using scraped content

4. **Cloudflare Deployment** (depends on task 3)
   - Connect repository to Cloudflare Pages
   - Configure build settings
   - Deploy homepage to preview URL
   - Verify static export works correctly

**Deliverable**: Working homepage deployed to Cloudflare Pages

---

### Phase 2: Full Site Migration
**Goal**: Complete content migration and navigation

**Tasks**:
5. **Complete Scraper Implementation** (depends on task 2)
   - Implement recursive page crawling
   - Extract all pages and convert to MDX
   - Extract navigation structure → `navigation.json`
   - Extract SEO metadata for all pages
   - Implement smart WordPress element conversion
   - Document forms → `forms.json`
   - Audit analytics scripts → `reports/analytics-audit.json`
   - Generate migration report
   - Generate URL mapping and sitemaps
   - Download all images

6. **Run Full Site Scrape** (depends on task 5)
   - Execute scraper against entire WordPress site
   - Use conservative concurrency + retries with backoff to avoid Cloudflare/WAF rate limiting; if blocked/challenged, slow down and resume
   - Review `migration-report.json` for issues
   - Verify `url-audit.json` shows all URLs mapped
   - Check `scraper-errors.log` for failures
   - Manually fix any critical scraping issues

7. **Component Library Expansion** (depends on task 3)
   - Create all custom components:
     - FeatureGrid, ServiceCard, Gallery, VideoEmbed
   - Configure MDX custom components
   - Create additional layouts (service, about)
   - Style components to match WordPress design

8. **Dynamic Routing Implementation** (depends on tasks 6, 7)
   - Implement `[[...slug]]` catch-all dynamic route
   - Load all MDX files and generate routes
   - Implement layout selection from frontmatter
   - Build navigation from `navigation.json`
   - Implement breadcrumbs (if needed)

9. **Tally Form Integration** (depends on task 8)
   - Review `forms.json`
   - Create Tally form matching contact form fields
   - Embed Tally on contact page
   - Style integration to match site design

10. **SEO Implementation** (depends on task 8)
    - Generate metadata from MDX frontmatter
    - Create sitemap.xml generator
    - Create robots.txt
    - Implement JSON-LD structured data
    - Verify Open Graph tags render correctly

**Deliverable**: Complete site with all pages, navigation, and forms

---

### Phase 3: Polish & Optimization
**Goal**: Performance, accessibility, and final touches

**Tasks**:
11. **Analytics Integration** (depends on task 10, can run parallel)
    - Review `reports/analytics-audit.json` and decide what to implement in `content/data/analytics.json`
    - Implement Google Analytics 4 (or detected analytics)
    - Test tracking events
    - Add cookie consent if required

12. **Performance Optimization** (depends on task 10, can run parallel)
    - Optimize images (ensure correct sizing/compression; if using `images.unoptimized`, pre-optimize critical images or adopt a custom loader/CDN)
    - Review bundle size and code-split if needed
    - Run Lighthouse audit
    - Fix any performance issues
    - Verify all pages load <2s

13. **Accessibility Audit** (depends on task 10, can run parallel)
    - Run axe DevTools audit
    - Fix accessibility issues (alt text, ARIA labels, keyboard nav)
    - Verify color contrast ratios
    - Test with screen reader

14. **Cross-Browser Testing** (depends on tasks 11, 12, 13)
    - Test on Chrome, Firefox, Safari, Edge
    - Test mobile responsive on iOS and Android
    - Fix any browser-specific issues

15. **Final QA & Launch** (depends on task 14)
    - Complete manual testing checklist
    - Run `task check` and verify all passes
    - Deploy to production on Cloudflare Pages
    - Configure custom domain
    - Verify production site live
    - Monitor for 24 hours for issues

**Deliverable**: Production-ready site live at rbcsignals.com

---

## Task Dependencies Summary

```
Phase 1 (MVP):
  1. Project Setup (no deps)
  2. Basic Scraper (no deps)
  3. Next.js Foundation (deps: 1, 2)
  4. Cloudflare Deployment (deps: 3)

Phase 2 (Full Site):
  5. Complete Scraper Implementation (deps: 2)
  6. Run Full Site Scrape (deps: 5)
  7. Component Library Expansion (deps: 3)
  8. Dynamic Routing Implementation (deps: 6, 7)
  9. Tally Form Integration (deps: 8)
  10. SEO Implementation (deps: 8)

Phase 3 (Polish):
  11. Analytics Integration (deps: 10) [parallel-capable]
  12. Performance Optimization (deps: 10) [parallel-capable]
  13. Accessibility Audit (deps: 10) [parallel-capable]
  14. Cross-Browser Testing (deps: 11, 12, 13)
  15. Final QA & Launch (deps: 14)
```

**Parallel work opportunities**:
- Tasks 1 and 2 can run in parallel (different people/agents)
- Tasks 11, 12, 13 can run in parallel (different people/agents)

---

## Task Targets (Taskfile.yml)

Note: This is an illustrative Taskfile skeleton. The real `Taskfile.yml` should follow the Task style guide and include `version`, shell safety, and a `default` task.

```yaml
version: '3'

set: [errexit, nounset, pipefail]

tasks:
  default:
    desc: List available tasks
    cmds:
      - task --list

  dev:
    desc: Start Next.js development server
    cmds:
      - npm run dev

  build:
    desc: Build static site (Next.js export)
    cmds:
      - npm run build

  preview:
    desc: Preview built site locally
    cmds:
      - npx serve out

  scrape:
    desc: Run full site scraper
    cmds:
      - tsx scripts/scraper.ts

  scrape:homepage:
    desc: Run scraper for homepage only (Phase 1)
    cmds:
      - tsx scripts/scraper.ts --pages=homepage

  scrape:watch:
    desc: Run scraper in watch mode for development
    cmds:
      - tsx watch scripts/scraper.ts

  ts:fmt:
    desc: Format code with Prettier (writes)
    cmds:
      - npx prettier --write .

  ts:fmt:check:
    desc: Check formatting with Prettier (no writes)
    cmds:
      - npx prettier --check .

  ts:lint:
    desc: Lint code with ESLint
    cmds:
      - npx eslint src scripts

  ts:type:
    desc: TypeScript type checking
    cmds:
      - tsc --noEmit

  check:
    desc: Run all quality checks (pre-commit)
    deps:
      - ts:fmt:check
      - ts:lint
      - ts:type
      - build

  clean:
    desc: Clean build artifacts and generated output
    cmds:
      - rm -rf out/ .next/ content/ public/images/ public/wp-content/ reports/

  audit:url:
    desc: Show URL audit report
    cmds:
      - jq . reports/url-audit.json

  audit:migration:
    desc: Show migration report
    cmds:
      - jq . reports/migration-report.json
```

---

## Risk Mitigation

### SEO Risks
- **Risk**: URL structure changes break SEO
- **Mitigation**: 1:1 URL preservation + sitemap comparison + url-audit.json verification

### Content Loss Risk
- **Risk**: Scraper misses content or misformats it
- **Mitigation**: Generate migration-report.json showing conversion status, manual review of flagged items

### Design Inconsistency Risk
- **Risk**: New site looks too different from current site
- **Mitigation**: Extract brand assets automatically, apply to Tailwind config, use same color palette

### Form Functionality Risk
- **Risk**: Tally form doesn't match WordPress Contact Form 7 functionality
- **Mitigation**: Document all fields in forms.json, recreate exact structure in Tally, test before launch

### Performance Risk
- **Risk**: Next.js site is slower than WordPress
- **Mitigation**: Static site generation is inherently fast, use Cloudflare edge network, run Lighthouse audits

### Deployment Risk
- **Risk**: Cloudflare Pages deployment fails or has issues
- **Mitigation**: Keep WordPress running during transition, test on preview URL first, DNS switch only after verification

---

## Success Criteria

### Technical
- ✅ All WordPress URLs preserved (verified via url-audit.json)
- ✅ All pages render correctly with proper styling
- ✅ Navigation works identically to WordPress site
- ✅ Images load correctly and are appropriately optimized (sized/compressed) for performance
- ✅ Contact form (Tally) functions correctly
- ✅ SEO metadata preserved on all pages
- ✅ Site builds without errors (`task check` passes)
- ✅ Lighthouse scores meet targets (Performance ≥90, Accessibility ≥95, SEO 100)

### Business
- ✅ Site maintains or improves page load speed vs WordPress
- ✅ No SEO ranking drops after launch (monitor for 30 days)
- ✅ Form submissions work reliably
- ✅ Site is easier to maintain than WordPress (developer experience)
- ✅ Hosting costs reduced (Cloudflare Pages free tier vs WordPress hosting)

---

## Future Enhancements (Out of Scope for Initial Launch)

- Blog/news section with dynamic content
- Customer portal with authentication
- Interactive tools (calculators, configurators)
- Multi-language support (i18n)
- A/B testing framework
- Advanced analytics and conversion tracking
- CMS integration (Contentful, Sanity) for non-technical content editing
- E2E testing suite (Playwright)
- Visual regression testing

---

## Notes

- This specification assumes the WordPress site remains accessible during development for scraping
- All work should follow standards in `warping/` directory (TypeScript standards, Taskfile best practices, etc.)
- Address user as "Vis" per `warping/user.md`
- Use hyphens in filenames per project conventions
- Commit messages should follow Conventional Commits format
- All secrets (API keys, etc.) go in `secrets/` directory, never committed to git
