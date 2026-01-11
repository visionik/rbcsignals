'use client'

import { useEffect } from 'react'

interface TallyFormProps {
  formId: string
  height?: number
}

/**
 * Tally form embed component
 * 
 * Required fields based on WordPress Contact Form 7:
 * - First name (text)
 * - Last name (text)
 * - Email (email)
 * - Company/institution (text)
 * - Country (text)
 * - Message (textarea)
 * 
 * To use:
 * 1. Create a Tally form at https://tally.so
 * 2. Add the fields listed above
 * 3. Get the form ID from the Tally share URL
 * 4. Replace 'YOUR_FORM_ID' in the contact page
 */
export function TallyForm({ formId, height = 500 }: TallyFormProps) {
  useEffect(() => {
    // Load Tally embed script
    const script = document.createElement('script')
    script.src = 'https://tally.so/widgets/embed.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="w-full">
      <iframe
        data-tally-src={`https://tally.so/embed/${formId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
        loading="lazy"
        width="100%"
        height={height}
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        title="Contact Form"
        className="rounded-lg"
      />
    </div>
  )
}

/**
 * Fallback contact form using native HTML
 * Use this until Tally form is created
 */
export function ContactFormFallback() {
  return (
    <form className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-2">
            First name
          </label>
          <input
            type="text"
            id="first-name"
            name="first-name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="First name"
          />
        </div>
        <div>
          <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-2">
            Last name
          </label>
          <input
            type="text"
            id="last-name"
            name="last-name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Last name"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="your@email.com"
          required
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
          Company/institution
        </label>
        <input
          type="text"
          id="company"
          name="company"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Your company"
        />
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
          Country
        </label>
        <input
          type="text"
          id="country"
          name="country"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Your country"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Your message"
          required
        />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> This is a placeholder form. Replace with Tally embed by:
        </p>
        <ol className="text-sm text-amber-800 list-decimal list-inside mt-2 space-y-1">
          <li>Creating a Tally form at tally.so</li>
          <li>Adding the fields shown above</li>
          <li>Replacing ContactFormFallback with TallyForm component</li>
        </ol>
      </div>

      <button
        type="submit"
        disabled
        className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
      >
        Submit (Form not connected)
      </button>
    </form>
  )
}
