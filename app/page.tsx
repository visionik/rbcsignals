import { Hero } from '@/components/sections/hero'
import { CTASection } from '@/components/sections/cta-section'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <Hero
        title="Innovative Satellite Data Communications Solutions"
        subtitle="Simplified communications and monitoring in VHF, UHF, L, S, C, X, Ku, Ka and optical bands"
        ctaText="How it works"
        ctaHref="/customers/commercial-leo"
      />

      {/* Features Section */}
      <section className="border-b bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Why RBC Signals</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Industry-leading satellite ground station services trusted by operators worldwide
            </p>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            <div className="group">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg transition-transform group-hover:scale-110">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold">Global Coverage</h3>
              <p className="text-lg leading-relaxed text-gray-600">
                30+ ground stations strategically positioned worldwide for maximum satellite visibility and reliable communications
              </p>
            </div>

            <div className="group">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-orange-600 text-white shadow-lg transition-transform group-hover:scale-110">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold">Flexibility</h3>
              <p className="text-lg leading-relaxed text-gray-600">
                Multi-band support from VHF to Ka-band with adaptable solutions for LEO, MEO, and GEO satellite constellations
              </p>
            </div>

            <div className="group">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-yellow-600 text-white shadow-lg transition-transform group-hover:scale-110">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold">Pay-as-you-go</h3>
              <p className="text-lg leading-relaxed text-gray-600">
                Cost-effective, transparent pricing model with no long-term commitments — pay only for the passes you use
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-primary">30+</div>
              <div className="text-lg font-medium text-gray-700">Ground Stations</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-primary">10</div>
              <div className="text-lg font-medium text-gray-700">Frequency Bands</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-primary">99.9%</div>
              <div className="text-lg font-medium text-gray-700">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-primary">24/7</div>
              <div className="text-lg font-medium text-gray-700">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Latest News</h2>
            <p className="text-lg text-gray-600">Stay updated with our latest announcements and industry insights</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-xl">
              <div className="p-8">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  May 28, 2025
                </div>
                <h3 className="mb-4 text-xl font-bold leading-tight group-hover:text-primary">
                  RBC Signals signs engineering contracts with Go Global Comms Ltd
                </h3>
                <p className="mb-6 leading-relaxed text-gray-600">
                  Expanding global GSaaS capacity through strategic partnership to enhance service delivery
                </p>
                <Button asChild variant="ghost" className="group-hover:bg-blue-50">
                  <Link href="#">Read more →</Link>
                </Button>
              </div>
            </article>

            <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-xl">
              <div className="p-8">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  May 27, 2025
                </div>
                <h3 className="mb-4 text-xl font-bold leading-tight group-hover:text-primary">
                  ESA and RBC Signals UK kick off STORM project
                </h3>
                <p className="mb-6 leading-relaxed text-gray-600">
                  Dynamic satellite spectrum management initiative to revolutionize orbital communications
                </p>
                <Button asChild variant="ghost" className="group-hover:bg-blue-50">
                  <Link href="#">Read more →</Link>
                </Button>
              </div>
            </article>

            <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-xl">
              <div className="p-8">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  March 12, 2025
                </div>
                <h3 className="mb-4 text-xl font-bold leading-tight group-hover:text-primary">
                  RBC Signals Expands Global Ground Station Network
                </h3>
                <p className="mb-6 leading-relaxed text-gray-600">
                  Acquisition of 10 antennas from Microsoft significantly strengthens worldwide coverage
                </p>
                <Button asChild variant="ghost" className="group-hover:bg-blue-50">
                  <Link href="#">Read more →</Link>
                </Button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to Get Started?"
        description="Connect with our team to discuss your satellite communications needs"
        ctaText="Contact Us"
        ctaHref="/contact"
      />
    </>
  )
}
