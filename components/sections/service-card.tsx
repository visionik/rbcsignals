import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface ServiceCardProps {
  title: string
  description: string
  features?: string[]
  href: string
  image?: string
}

export function ServiceCard({ title, description, features, href, image }: ServiceCardProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {image && (
        <div className="aspect-video bg-gradient-to-br from-slate-900 to-blue-900 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      
      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 leading-relaxed mb-6">
          {description}
        </p>
        
        {features && features.length > 0 && (
          <ul className="mb-6 space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-primary mt-0.5">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
        
        <Link href={href}>
          <Button variant="outline" className="group/btn">
            Learn More
            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

interface ServiceGridProps {
  services: ServiceCardProps[]
}

export function ServiceGrid({ services }: ServiceGridProps) {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  )
}
