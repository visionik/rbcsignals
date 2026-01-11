import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-gradient-to-br from-gray-900 to-slate-800 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">Customers</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/customers/commercial-leo" className="transition-colors hover:text-white">
                  Commercial LEO
                </Link>
              </li>
              <li>
                <Link href="/customers/government" className="transition-colors hover:text-white">
                  Government
                </Link>
              </li>
              <li>
                <Link href="/customers/commercial-geo" className="transition-colors hover:text-white">
                  Commercial GEO
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">Services</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/services/global-connectivity" className="transition-colors hover:text-white">
                  Global Connectivity
                </Link>
              </li>
              <li>
                <Link href="/services/gsaas" className="transition-colors hover:text-white">
                  GSaaS
                </Link>
              </li>
              <li>
                <Link href="/services/spectrum-services" className="transition-colors hover:text-white">
                  Spectrum Services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="transition-colors hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/news" className="transition-colors hover:text-white">
                  News
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">Connect</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://twitter.com/rbcsignals" className="transition-colors hover:text-white">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/company/rbcsignals" className="transition-colors hover:text-white">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm">
          <p>© {currentYear} RBC Signals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
