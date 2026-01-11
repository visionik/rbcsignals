import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function Header() {
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

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/customers" className="text-sm font-semibold text-gray-700 transition-colors hover:text-primary">
            Customers
          </Link>
          <Link href="/services" className="text-sm font-semibold text-gray-700 transition-colors hover:text-primary">
            Services
          </Link>
          <Link href="/about" className="text-sm font-semibold text-gray-700 transition-colors hover:text-primary">
            About
          </Link>
          <Button asChild size="sm">
            <Link href="/contact">Contact Us</Link>
          </Button>
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
