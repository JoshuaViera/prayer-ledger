// components/navigation/BottomNavBar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, List, Award, PlusCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/prayers/active', label: 'Prayers', icon: List },
  { href: '/prayers/add', label: 'Add', icon: PlusCircle },
  { href: '/prayers/answered', label: 'Answered', icon: Award },
  { href: '/profile', label: 'Profile', icon: User },
]

export function BottomNavBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border md:hidden shadow-lg z-20 transition-colors">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto">
        {navLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full text-sm font-medium transition-colors',
                isActive
                  ? 'text-primary' // Active link in primary color
                  : 'text-muted-foreground hover:text-foreground' // Muted inactive, brighter on hover
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