// app/(main)/home/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Database } from '@/lib/database.types'
import { Award, BarChart, CheckCircle2, Flame, HeartHandshake, Lightbulb, ShieldCheck, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Prayer = Database['public']['Tables']['prayers']['Row']

// --- New: Define types for better type safety ---
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType; // Use React.ElementType for component types
  isUnlocked: (stats: Stats) => boolean; // isUnlocked now expects Stats type
}

interface Stats {
  total: number;
  answered: number;
  active: number;
  firstPrayerDate: Date | null;
  journeyDays: number;
  streak: number;
}

// --- Explicitly type prayerPrompts as string[] ---
const prayerPrompts: string[] = [
  "What are you most grateful for today?",
  "Who is someone you can pray for this week?",
  "What is a personal challenge where you need guidance?",
  "How can you be a blessing to someone else today?",
  "What area of your life needs healing or peace?",
  "Reflect on a moment you felt close to God recently.",
  "What area of your life needs healing or peace?"
];

// --- Type achievements with the new Achievement interface ---
const achievements: Achievement[] = [
  { id: 'streak_7', title: 'Week of Faith', description: 'Maintained a 7-day prayer streak!', icon: Flame, isUnlocked: (stats) => stats.streak >= 7 },
  { id: 'answered_1', title: 'First Testimony', description: 'You marked your first prayer as answered!', icon: Award, isUnlocked: (stats) => stats.answered >= 1 },
  { id: 'answered_10', title: 'Faithful Follower', description: 'You have 10 answered prayers!', icon: ShieldCheck, isUnlocked: (stats) => stats.answered >= 10 },
];

// --- Explicitly type return of checkAchievements ---
function checkAchievements(stats: Stats): Achievement[] {
  return achievements.filter(ach => ach.isUnlocked(stats));
}

function calculateStreak(prayers: Prayer[]): number {
  if (!prayers || prayers.length === 0) return 0;
  const activityDates = new Set(prayers.map(p => new Date(p.updated_at).toISOString().split('T')[0]));
  let streak = 0;
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  if (activityDates.has(todayStr)) {
    streak = 1;
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    let yesterdayStr = yesterday.toISOString().split('T')[0];

    while (activityDates.has(yesterdayStr)) {
      streak++;
      yesterday.setDate(yesterday.getDate() - 1);
      yesterdayStr = yesterday.toISOString().split('T')[0];
    }
  }
  return streak;
}

// --- Explicitly type return of calculateStats ---
function calculateStats(prayers: Prayer[]): Stats {
  if (!prayers || prayers.length === 0) {
    return { total: 0, answered: 0, active: 0, firstPrayerDate: null, journeyDays: 0, streak: 0 }
  }
  const answered = prayers.filter((p) => p.status === 'answered').length
  const active = prayers.length - answered
  
  // Find the oldest prayer date
  const oldestPrayer = prayers.reduce((oldest, p) => {
    const currentDate = new Date(p.created_at);
    if (!oldest || currentDate < oldest) {
      return currentDate;
    }
    return oldest;
  }, null as Date | null); // Initialize with null, then type as Date | null

  const firstPrayerDate = oldestPrayer;
  const journeyDays = firstPrayerDate 
    ? Math.ceil((new Date().getTime() - firstPrayerDate.getTime()) / (1000 * 60 * 60 * 24)) 
    : 0;

  const streak = calculateStreak(prayers);

  return { total: prayers.length, answered, active, firstPrayerDate, journeyDays, streak }
}

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string | number }) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-card flex flex-col items-center text-center border border-border transition-colors">
      <div className="text-primary mb-2">{icon}</div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  )
}

export default async function HomePage() {
  const supabase = await createSupabaseServerClient() // Added await here!
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { redirect('/login') }

  const { data: prayers } = await supabase.from('prayers').select('*').order('created_at', { ascending: false })
  
  // Ensure stats is not null before passing to checkAchievements
  const stats = calculateStats(prayers || [])
  const earnedAchievements = checkAchievements(stats);

  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const dailyPrompt = prayerPrompts[dayOfYear % prayerPrompts.length];

  let verse = { text: 'For where two or three are gathered in my name, there am I among them.', reference: 'Matthew 18:20' }
  try {
    const verseResponse = await fetch('https://bible-api.com/romans+12:2', { next: { revalidate: 86400 } })
    const verseData = await verseResponse.json()
    verse = { text: verseData.text.trim(), reference: verseData.reference }
  } catch (error) { console.error("Failed to fetch daily verse:", error) }

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-primary to-indigo-700 text-white p-8 rounded-lg shadow-xl mb-8 text-center border border-primary/20">
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-lg italic text-indigo-100">"{verse.text}"</p>
          <p className="text-md font-semibold mt-2 text-indigo-200">- {verse.reference}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard icon={<BarChart size={28} />} title="Total Prayers" value={stats.total} />
          <StatCard icon={<CheckCircle2 size={28} />} title="Answered" value={stats.answered} />
          <StatCard icon={<Target size={28} />} title="Active Requests" value={stats.active} />
          <StatCard icon={<HeartHandshake size={28} />} title="Days in Prayer" value={stats.journeyDays} />
          <StatCard icon={<Flame size={28} />} title="Prayer Streak" value={`${stats.streak} Day${stats.streak === 1 ? '' : 's'}`} />
        </div>
        
        {earnedAchievements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 text-center">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {earnedAchievements.map(ach => (
                <div key={ach.id} className="bg-card p-4 rounded-lg shadow-card flex items-center border border-border transition-colors">
                  <div className="bg-primary/20 p-3 rounded-full mr-4">
                    <ach.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{ach.title}</h3>
                    <p className="text-sm text-muted-foreground">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-card p-6 rounded-lg shadow-card text-center mb-8 border border-border transition-colors">
          <h2 className="text-xl font-semibold text-foreground mb-4">What would you like to do?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Link href="/prayers/add">Add a New Vow</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/10 transition-colors">
              <Link href="/prayers/active">View All Commitments</Link>
            </Button>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-card text-center border border-border transition-colors">
            <div className="flex justify-center items-center gap-2 text-primary">
              <Lightbulb size={24} />
              <h2 className="text-xl font-semibold">Daily Reflection</h2>
            </div>
            <p className="text-muted-foreground my-4 italic">"{dailyPrompt}"</p>
        </div>
      </div>
    </div>
  )
}