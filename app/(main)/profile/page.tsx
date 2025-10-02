// app/(main)/profile/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Calendar, BarChart3, Target, Award, Trash2 } from 'lucide-react'
import type { Database } from '@/lib/database.types'
import { UpdatePasswordForm } from '@/components/auth/UpdatePasswordForm'
import { AccountDeletionForm } from '@/components/profile/AccountDeletionForm'

type Prayer = Database['public']['Tables']['prayers']['Row']

interface ProfileStats {
  totalPrayers: number
  answeredPrayers: number
  activePrayers: number
  joinDate: string
  daysSinceJoining: number
  longestStreak: number
  currentStreak: number
}

function calculateProfileStats(prayers: Prayer[], userCreatedAt: string): ProfileStats {
  const totalPrayers = prayers.length
  const answeredPrayers = prayers.filter(p => p.status === 'answered').length
  const activePrayers = prayers.filter(p => p.status === 'active').length
  
  const joinDate = new Date(userCreatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  const daysSinceJoining = Math.floor(
    (new Date().getTime() - new Date(userCreatedAt).getTime()) / (1000 * 60 * 60 * 24)
  )
  
  // Note: This is a simplified streak calculation.
  // A more robust solution would handle gaps in days.
  const activityDates = new Set(
    prayers.map(p => new Date(p.created_at).toISOString().split('T')[0])
  )
  
  let currentStreak = 0
  const today = new Date()
  
  if (activityDates.has(today.toISOString().split('T')[0])) {
    currentStreak = 1
    let checkDate = new Date()
    checkDate.setDate(today.getDate() - 1)
    
    while (activityDates.has(checkDate.toISOString().split('T')[0])) {
      currentStreak++
      checkDate.setDate(checkDate.getDate() - 1)
    }
  }
  
  return {
    totalPrayers,
    answeredPrayers,
    activePrayers,
    joinDate,
    daysSinceJoining,
    longestStreak: currentStreak, // Placeholder: A more complex calculation is needed for longest streak
    currentStreak
  }
}

function StatCard({ icon, title, value, subtitle }: { 
  icon: React.ReactNode
  title: string
  value: string | number
  subtitle?: string 
}) {
  return (
    <div className="bg-card p-4 rounded-lg shadow-card border border-border">
      <div className="flex items-center gap-3">
        <div className="text-primary">{icon}</div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground/70">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Fetch user's prayers for stats
  const { data: prayers } = await supabase
    .from('prayers')
    .select('*')
    .order('created_at', { ascending: false })
  
  const stats = calculateProfileStats(prayers || [], user.created_at)

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account and view your commitment journey</p>
        </div>

        {/* Personal Information & Security */}
        <div className="grid md:grid-cols-2 gap-8">
          <UpdatePasswordForm />
          
          {/* Prayer Journey Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Your commitment Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <StatCard 
                  icon={<BarChart3 size={16} />}
                  title="Total"
                  value={stats.totalPrayers}
                />
                <StatCard 
                  icon={<Award size={16} />}
                  title="Answered"
                  value={stats.answeredPrayers}
                />
                <StatCard 
                  icon={<Target size={16} />}
                  title="Active"
                  value={stats.activePrayers}
                />
                <StatCard 
                  icon={<Calendar size={16} />}
                  title="Streak"
                  value={`${stats.currentStreak}d`}
                  subtitle={stats.daysSinceJoining > 0 ? `${stats.daysSinceJoining} days member` : ''}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AccountDeletionForm />
          </CardContent>
        </Card>

      </div>
    </div>
  )
}