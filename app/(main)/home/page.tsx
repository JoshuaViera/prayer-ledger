import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Database } from '@/lib/database.types'
import { Award, BarChart, CheckCircle2, Flame, HeartHandshake, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PrayerCard } from '@/components/prayers/prayercard'
import { DaysInPrayerCard } from '@/components/dashboard/DaysInPrayerCard' // Import our new component

type Prayer = Database['public']['Tables']['prayers']['Row']

function calculateStats(prayers: Prayer[]) {
  if (!prayers || prayers.length === 0) {
    return { total: 0, answered: 0, active: 0, firstPrayerDate: null }
  }
  const answered = prayers.filter((p) => p.status === 'answered').length
  const active = prayers.length - answered
  const firstPrayerDate = new Date(
    prayers.reduce((oldest, p) => {
      const currentDate = new Date(p.created_at)
      return currentDate < oldest ? currentDate : oldest
    }, new Date())
  )
  // Remove the journeyDays calculation from here
  return { total: prayers.length, answered, active, firstPrayerDate }
}

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string | number }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-card flex flex-col items-center text-center">
      <div className="text-primary mb-2">{icon}</div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  )
}

export default async function HomePage() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { redirect('/login') }

  const { data: prayers } = await supabase.from('prayers').select('*').order('created_at', { ascending: false })
  const stats = calculateStats(prayers || [])
  const answeredPrayers = (prayers || []).filter(p => p.status === 'answered');
  const streak = calculateStreak(prayers || []);

  let verse = { text: 'For where two or three are gathered in my name, there am I among them.', reference: 'Matthew 18:20' }
  try {
    const verseResponse = await fetch('https://bible-api.com/romans+12:2', { next: { revalidate: 86400 } })
    const verseData = await verseResponse.json()
    verse = { text: verseData.text.trim(), reference: verseData.reference }
  } catch (error) { console.error("Failed to fetch daily verse:", error) }

  function calculateStreak(prayers: Prayer[]) { // Moved this function inside for consistency
    if (!prayers || prayers.length === 0) return 0;
    const activityDates = new Set(prayers.map(p => new Date(p.updated_at).toISOString().split('T')[0]));
    let streak = 0;
    let today = new Date();
    if (activityDates.has(today.toISOString().split('T')[0])) {
      streak = 1;
      let yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      while (activityDates.has(yesterday.toISOString().split('T')[0])) {
        streak++;
        yesterday.setDate(yesterday.getDate() - 1);
      }
    }
    return streak;
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-primary to-indigo-600 text-white p-8 rounded-lg shadow-lg mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-lg italic text-indigo-200">"{verse.text}"</p>
          <p className="text-md font-semibold mt-2 text-indigo-300">- {verse.reference}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard icon={<BarChart size={28} />} title="Total Prayers" value={stats.total} />
          <StatCard icon={<CheckCircle2 size={28} />} title="Answered" value={stats.answered} />
          <StatCard icon={<Target size={28} />} title="Active Requests" value={stats.active} />
          <DaysInPrayerCard firstPrayerDate={stats.firstPrayerDate} /> {/* Use the new component */}
          <StatCard icon={<Flame size={28} />} title="Prayer Streak" value={`${streak} Day${streak === 1 ? '' : 's'}`} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-card text-center">
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
        {answeredPrayers.length > 0 && (
          <div className="mt-8">
            <div className="text-center mb-6">
              <Award className="mx-auto h-8 w-8 text-amber-500 mb-2" />
              <h2 className="text-3xl font-bold text-gray-800">Testimonies</h2>
              <p className="text-gray-500">A journal of your answered prayers.</p>
            </div>
            <div className="space-y-4">
              {answeredPrayers.map((prayer) => (
                <div key={prayer.id} className="border-l-4 border-amber-400">
                  <PrayerCard prayer={prayer} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}