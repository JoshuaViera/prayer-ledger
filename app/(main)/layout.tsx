// app/(main)/layout.tsx

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SideBar } from '@/components/navigation/SideBar'
import { BottomNavBar } from '@/components/navigation/BottomNavBar'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) { 
    redirect('/login') 
  }

  return (
    <div className="flex min-h-screen">
      <SideBar />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <BottomNavBar />
    </div>
  )
}