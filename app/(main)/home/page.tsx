import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Database } from '@/lib/database.types'
import { Award, BarChart, CheckCircle2, HeartHandshake, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Prayer = Database['public']['Tables']['prayers']['Row']

function calculateStats(prayers: Prayer[]) {
  if (!prayers || prayers.length === 0) {
    return { total: 0, answered: 0, active: 0, firstPrayerDate: null, journeyDays: 0 }
  }
  const answered = prayers.filter((p) => p.status === 'answered').length
  const active = prayers.length - answered
  const firstPrayerDate = new Date(
    prayers.reduce((oldest, p) => {
      const currentDate = new Date(p.created_at)
      return currentDate < oldest ? currentDate : oldest
    }, new Date())
  )
  const journeyDays = Math.ceil((new Date().getTime() - firstPrayerDate.getTime()) / (1000 * 60 * 60 * 24))
  return { total: prayers.length, answered, active, firstPrayerDate, journeyDays }
}

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
  if (!user) { redirect('/login') }

  const { data: prayers } = await supabase.from('prayers').select('*')
  const stats = calculateStats(prayers || [])

  let verse = { text: 'For where two or three are gathered in my name, there am I among them.', reference: 'Matthew 18:20' }
  try {
    const verseResponse = await fetch('https://bible-api.com/romans+12:2', { next: { revalidate: 86400 } })
    const verseData = await verseResponse.json()
    verse = { text: verseData.text.trim(), reference: verseData.reference }
  } catch (error) { console.error("Failed to fetch daily verse:", error) }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-8 rounded-xl shadow-lg mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-lg italic text-indigo-200">"{verse.text}"</p>
          <p className="text-md font-semibold mt-2 text-indigo-300">- {verse.reference}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<BarChart size={28} />} title="Total Prayers" value={stats.total} />
          <StatCard icon={<CheckCircle2 size={28} />} title="Answered" value={stats.answered} />
          <StatCard icon={<Target size={28} />} title="Active Requests" value={stats.active} />
          <StatCard icon={<HeartHandshake size={28} />} title="Days in Prayer" value={stats.journeyDays} />
        </div>
        
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

        {stats.answered > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center items-center gap-2 text-amber-600">
              <Award size={24} />
              <h2 className="text-xl font-semibold">Answered Prayers</h2>
            </div>
            <p className="text-gray-600 my-4">You have {stats.answered} answered prayer{stats.answered > 1 ? 's' : ''}. Give thanks!</p>
            <Button asChild className="bg-amber-500 hover:bg-amber-600">
              <Link href="/prayers/answered">View Your Testimonies</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}