import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Script from 'next/script'

export const metadata: Metadata = {
  metadataBase: new URL('https://rbcsignals.com'),
  title: {
    default: 'RBC Signals | Global Satellite Connectivity Solutions',
    template: '%s | RBC Signals',
  },
  description: 'Leading provider of ground station as a service (GSaaS), global connectivity, and spectrum services for commercial LEO, GEO, and government satellite operators.',
  keywords: ['satellite', 'ground station', 'GSaaS', 'LEO', 'GEO', 'connectivity', 'spectrum services'],
  authors: [{ name: 'RBC Signals' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rbcsignals.com',
    siteName: 'RBC Signals',
    title: 'RBC Signals | Global Satellite Connectivity Solutions',
    description: 'Leading provider of ground station as a service (GSaaS), global connectivity, and spectrum services.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RBC Signals | Global Satellite Connectivity Solutions',
    description: 'Leading provider of ground station as a service (GSaaS), global connectivity, and spectrum services.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RBC Signals',
    url: 'https://rbcsignals.com',
    logo: 'https://rbcsignals.com/images/logo.png',
    description: 'Leading provider of ground station as a service (GSaaS), global connectivity, and spectrum services for satellite operators.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
  }

  return (
    <html lang="en">
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RN4VSD29BY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RN4VSD29BY');
          `}
        </Script>
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
