'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import navigation from '@/content/data/navigation.json'

function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.pathname
  } catch {
    return url
  }
}

export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Image
            src="/images/logo.png"
            alt="RBC Signals"
            width={200}
            height={45}
            className="h-11 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navigation.header.menu.map((item, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => item.items && setOpenMenu(item.label)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              {item.items ? (
                <>
                  <button className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-primary transition-colors py-2">
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {openMenu === item.label && (
                    <div 
                      className="absolute top-full left-0 pt-2"
                      onMouseEnter={() => setOpenMenu(item.label)}
                      onMouseLeave={() => setOpenMenu(null)}
                    >
                      <div className="w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                        {item.items.map((subitem, subindex) => (
                          <Link
                            key={subindex}
                            href={normalizeUrl(subitem.href || '#')}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={normalizeUrl(item.href || '#')}
                  className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile menu button - simplified for MVP */}
        <button className="rounded-lg p-2 hover:bg-gray-100 md:hidden">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  )
}
