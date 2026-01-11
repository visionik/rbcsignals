import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface CTASectionProps {
  title: string
  description?: string
  ctaText?: string
  ctaHref?: string
}

export function CTASection({
  title,
  description,
  ctaText = 'Get Started',
  ctaHref = '/contact',
}: CTASectionProps) {
  return (
    <section className="bg-primary py-16 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">{title}</h2>
        {description && <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">{description}</p>}
        <Button asChild size="lg" variant="secondary">
          <Link href={ctaHref}>{ctaText}</Link>
        </Button>
      </div>
    </section>
  )
}
