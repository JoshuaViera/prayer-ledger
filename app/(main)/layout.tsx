import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SideBar } from '@/components/navigation/SideBar'
import { BottomNavBar } from '@/components/navigation/BottomNavBar'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { redirect('/login') }

  return (
    <div className="flex min-h-screen">
      <SideBar />
      <main className="flex-1 pb-16 md:pb-0">{children}</main> {/* Ensure main content scrolls properly on mobile */}
      <BottomNavBar />
    </div>
  )
}