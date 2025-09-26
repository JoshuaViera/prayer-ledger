'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, List, Award, PlusCircle, LogOut, BookOpenText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navLinks = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/prayers/active', label: 'All Prayers', icon: List },
  { href: '/prayers/answered', label: 'Answered', icon: Award },
  { href: '/prayers/add', label: 'Add Prayer', icon: PlusCircle },
]

export function SideBar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-20 border-b">
        <BookOpenText className="h-8 w-8 text-indigo-600" />
        <span className="ml-2 text-2xl font-bold text-gray-800">Prayer Ledger</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center px-4 py-3 text-gray-700 rounded-lg',
                isActive
                  ? 'bg-indigo-100 text-indigo-700 font-semibold'
                  : 'hover:bg-gray-100'
              )}
            >
              <link.icon className="h-5 w-5 mr-3" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="px-4 py-6 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  )
}