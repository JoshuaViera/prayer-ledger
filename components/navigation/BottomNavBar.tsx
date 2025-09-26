'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, List, Award, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/prayers/active', label: 'Prayers', icon: List },
  { href: '/prayers/add', label: 'Add', icon: PlusCircle },
  { href: '/prayers/answered', label: 'Answered', icon: Award },
]

export function BottomNavBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto">
        {navLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full text-sm font-medium',
                isActive ? 'text-blue-800' : 'text-gray-500 hover:text-blue-700'
              )}
            >
              <link.icon className="h-6 w-6 mb-1" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}