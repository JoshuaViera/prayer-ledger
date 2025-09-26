// File: /app/(main)/home/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Database } from '@/lib/database.types'
import { BarChart, CheckCircle2, HeartHandshake, Target } from 'lucide-react' // Corrected icon name
import { Button } from '@/components/ui/button'

type Prayer = Database['public']['Tables']['prayers']['Row']

// Helper function to calculate stats
function calculateStats(prayers: Prayer[]) {
  if (!prayers || prayers.length === 0) {
    return {
      total: 0,
      answered: 0,
      active: 0,
      firstPrayerDate: null,
      journeyDays: 0,
    }
  }

  const answered = prayers.filter((p) => p.status === 'answered').length
  const active = prayers.length - answered
  const firstPrayerDate = new Date(
    prayers.reduce((oldest, p) => {
      const currentDate = new Date(p.created_at)
      return currentDate < oldest ? currentDate : oldest
    }, new Date())
  )
  const journeyDays = Math.ceil(
    (new Date().getTime() - firstPrayerDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  return { total: prayers.length, answered, active, firstPrayerDate, journeyDays }
}

// Helper component for stat cards
function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string | number }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
      <div className="text-blue-900 mb-2">{icon}</div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  )
}

export default async function HomePage() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all prayers for the user
  const { data: prayers } = await supabase.from('prayers').select('*')
  const stats = calculateStats(prayers || [])

  // Fetch a daily verse
  let verse = { text: 'For where two or three are gathered in my name, there am I among them.', reference: 'Matthew 18:20' }
  try {
    const verseResponse = await fetch('https://bible-api.com/romans+12:2', { next: { revalidate: 86400 } }) // Re-fetch once a day
    const verseData = await verseResponse.json()
    verse = { text: verseData.text.trim(), reference: verseData.reference }
  } catch (error) {
    console.error("Failed to fetch daily verse:", error)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-8 rounded-xl shadow-lg mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-lg italic text-indigo-200">"{verse.text}"</p>
          <p className="text-md font-semibold mt-2 text-indigo-300">- {verse.reference}</p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<BarChart size={28} />} title="Total Prayers" value={stats.total} />
          <StatCard icon={<CheckCircle2 size={28} />} title="Answered" value={stats.answered} />
          <StatCard icon={<Target size={28} />} title="Active Requests" value={stats.active} />
          <StatCard icon={<HeartHandshake size={28} />} title="Days in Prayer" value={stats.journeyDays} />
        </div>
        
        {/* Action Buttons */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">What would you like to do?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="flex-1">
              <Link href="/prayers/add">Add a New Prayer</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="flex-1">
              <Link href="/prayers/active">View All Prayers</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}