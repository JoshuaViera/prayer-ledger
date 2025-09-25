// app/(main)/dashboard/page.tsx
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PrayerCard } from '@/components/prayers/prayercard'
import type { Prayer } from '@/types'

export default async function DashboardPage() {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: prayers } = await supabase
    .from('prayers')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Your personal prayer journal</p>
        </div>

        <div className="space-y-4">
          {prayers && prayers.length > 0 ? (
            prayers.map((prayer) => (
              <PrayerCard key={prayer.id} prayer={prayer as unknown as Prayer} />
            ))
          ) : (
            <div className="text-center bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500">You haven't added any prayer requests yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}