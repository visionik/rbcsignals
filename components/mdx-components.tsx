import { Button } from '@/components/ui/button'
import { CTASection } from '@/components/sections/cta-section'
import { FeatureGrid } from '@/components/sections/feature-grid'
import { ServiceCard, ServiceGrid } from '@/components/sections/service-card'
import { Gallery } from '@/components/sections/gallery'
import { VideoEmbed } from '@/components/sections/video-embed'
import { TallyForm, ContactFormFallback } from '@/components/forms/tally-form'

export const mdxComponents = {
  // Custom components available in MDX
  Button,
  CTASection,
  FeatureGrid,
  ServiceCard,
  ServiceGrid,
  Gallery,
  VideoEmbed,
  TallyForm,
  ContactFormFallback,
  
  // Enhanced HTML elements
  h1: ({ children }: any) => (
    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 mt-8">
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 mt-8">
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 mt-6">
      {children}
    </h3>
  ),
  h4: ({ children }: any) => (
    <h4 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2 mt-4">
      {children}
    </h4>
  ),
  p: ({ children }: any) => (
    <p className="text-lg text-gray-700 leading-relaxed mb-4">
      {children}
    </p>
  ),
  ul: ({ children }: any) => (
    <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700">
      {children}
    </ol>
  ),
  li: ({ children }: any) => (
    <li className="text-gray-700">
      {children}
    </li>
  ),
  a: ({ children, href }: any) => (
    <a
      href={href}
      className="text-primary hover:text-blue-700 underline transition-colors"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-primary pl-4 italic text-gray-700 my-4">
      {children}
    </blockquote>
  ),
  code: ({ children }: any) => (
    <code className="bg-gray-100 rounded px-2 py-1 text-sm font-mono text-gray-800">
      {children}
    </code>
  ),
  pre: ({ children }: any) => (
    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4">
      {children}
    </pre>
  ),
  img: ({ src, alt }: any) => (
    <img
      src={src}
      alt={alt}
      className="rounded-lg w-full my-6 shadow-md"
    />
  ),
}
