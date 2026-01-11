import { Rocket, Globe, Shield, Zap } from 'lucide-react'

interface Feature {
  icon: React.ReactNode | string
  title: string
  description: string
}

const defaultFeatures: Feature[] = [
  {
    icon: <Globe className="h-6 w-6" />,
    title: 'Global Coverage',
    description: 'Worldwide satellite connectivity for your mission-critical applications.',
  },
  {
    icon: <Rocket className="h-6 w-6" />,
    title: 'LEO & GEO Support',
    description: 'Flexible satellite solutions for commercial and government customers.',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Secure & Reliable',
    description: '99.9% uptime with enterprise-grade security and redundancy.',
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Ground Station as a Service',
    description: 'On-demand access to our global network of ground stations.',
  },
]

interface FeatureGridProps {
  features?: Feature[]
  columns?: 2 | 3 | 4
}

export function FeatureGrid({ features = defaultFeatures, columns = 4 }: FeatureGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 ${gridCols[columns]} gap-8`}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-primary to-blue-600 text-white group-hover:scale-110 transition-transform duration-300">
                  {typeof feature.icon === 'string' ? (
                    <span className="text-3xl">{feature.icon}</span>
                  ) : (
                    feature.icon
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
