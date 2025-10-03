// components/prayers/prayerCard.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Database } from '@/lib/database.types'
import { Button } from '../ui/button'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Trash2, Tag, Star, Share2, Check, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { checkInToday, getCheckInStats, type CheckInStats } from '@/lib/check-ins'

type Prayer = Database['public']['Tables']['prayers']['Row']

const categoryStyles: { [key: string]: string } = {
  'Personal Growth': 'border-l-pink-400',
  'Family & Relationships': 'border-l-cyan-400',
  'Health & Healing': 'border-l-emerald-400',
  'Career & Finances': 'border-l-blue-400',
  'World Events': 'border-l-purple-400',
  'Church Community': 'border-l-yellow-400',
  'General': 'border-l-orange-400',
}

const priorityStyles: { [key: string]: string } = {
  'high': 'bg-red-500 text-white shadow-lg',
  'medium': 'bg-yellow-500 text-black shadow-lg',
  'low': 'bg-green-500 text-white shadow-lg',
}

interface PrayerCardProps {
  prayer: Prayer
  onUpdate?: () => void
  onPrayerAnswered?: () => void
}

export function PrayerCard({ prayer, onUpdate, onPrayerAnswered }: PrayerCardProps) {
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()
  const [isCopied, setIsCopied] = useState(false)
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [checkInStats, setCheckInStats] = useState<CheckInStats>({
    totalCheckIns: 0,
    currentStreak: 0,
    lastCheckIn: null,
    hasCheckedInToday: false,
  })

  useEffect(() => {
    loadCheckInStats()
  }, [prayer.id])

  const loadCheckInStats = async () => {
    const stats = await getCheckInStats(prayer.id)
    setCheckInStats(stats)
  }

  const refreshData = () => {
    if (onUpdate) onUpdate()
    else router.refresh()
  }

  const handleCheckIn = async () => {
    setIsCheckingIn(true)
    const success = await checkInToday(prayer.id)
    if (success) {
      await loadCheckInStats()
      refreshData()
    }
    setIsCheckingIn(false)
  }

  const handleShare = async () => {
    const prayerText = `Prayer Request: ${prayer.title}\n\nDetails: ${prayer.details || 'No details provided.'}`
    try {
      await navigator.clipboard.writeText(prayerText)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleUpdateStatus = async () => {
    const { error } = await supabase
      .from('prayers')
      .update({ status: 'answered' })
      .eq('id', prayer.id)
    
    if (error) {
      console.error('Error updating prayer status:', error)
    } else {
      if (onPrayerAnswered) onPrayerAnswered()
      else refreshData()
    }
  }

  const handleDelete = async () => {
    const isConfirmed = window.confirm('Are you sure you want to delete this prayer request?')
    if (isConfirmed) {
      const { error } = await supabase.from('prayers').delete().eq('id', prayer.id)
      if (error) {
        console.error('Error deleting prayer:', error)
      } else {
        refreshData()
      }
    }
  }

  const handleToggleFavorite = async () => {
    const { error } = await supabase
      .from('prayers')
      .update({ is_favorited: !prayer.is_favorited })
      .eq('id', prayer.id)
    
    if (error) {
      console.error('Error updating favorite status:', error)
    } else {
      refreshData()
    }
  }

  const borderColorClass = categoryStyles[prayer.category] || categoryStyles['General']
  const priorityColorClass = priorityStyles[prayer.priority.toLowerCase()] || priorityStyles['medium']

  return (
    <Card className={cn('border-2 border-border border-l-8 shadow-xl hover:shadow-2xl transition-all duration-300 bg-card backdrop-blur-sm', borderColorClass)}>
      <CardHeader className="flex flex-row justify-between items-start bg-gradient-to-r from-card/50 to-secondary/30 rounded-t-lg">
        <div className="flex-1">
          <CardTitle className="text-foreground text-xl font-bold drop-shadow-sm">{prayer.title}</CardTitle>
          {prayer.details && (
            <p className="text-card-foreground/80 text-sm mt-2 bg-muted/30 p-2 rounded">{prayer.details}</p>
          )}
          
          {checkInStats.currentStreak > 0 && (
            <div className="mt-3 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary">{checkInStats.currentStreak} day streak</span>
              </div>
              <span className="text-muted-foreground">
                {checkInStats.totalCheckIns} total check-ins
              </span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full shadow-md ${
              prayer.status === 'active'
                ? 'bg-blue-500 text-white border border-blue-300'
                : 'bg-emerald-500 text-white border border-emerald-300'
            }`}
          >
            {prayer.status}
          </span>
          <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-md ${priorityColorClass}`}>
            {prayer.priority} Priority
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="bg-card/80">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm bg-accent/20 px-3 py-1 rounded-full">
            <Tag className="h-4 w-4 text-accent-foreground" />
            <span className="text-accent-foreground font-medium">{prayer.category}</span>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {prayer.status === 'active' && (
              <Button
                variant={checkInStats.hasCheckedInToday ? "outline" : "default"}
                size="sm"
                onClick={handleCheckIn}
                disabled={checkInStats.hasCheckedInToday || isCheckingIn}
                className={cn(
                  "transition-all",
                  checkInStats.hasCheckedInToday 
                    ? "border-emerald-400 text-emerald-400 cursor-default" 
                    : "bg-primary hover:bg-primary/90"
                )}
              >
                {checkInStats.hasCheckedInToday ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Checked In
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    {isCheckingIn ? 'Checking In...' : 'Check In Today'}
                  </>
                )}
              </Button>
            )}
            
            <Button variant="ghost" size="icon" onClick={handleShare} className="hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 border border-transparent hover:border-cyan-500/50">
              {isCopied ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
            </Button>
            
            <Button variant="ghost" size="icon" onClick={handleToggleFavorite} className="hover:bg-yellow-500/20 text-yellow-400 hover:text-yellow-300 border border-transparent hover:border-yellow-500/50">
              <Star className={cn("h-5 w-5", prayer.is_favorited ? 'fill-yellow-400 text-yellow-400' : 'text-yellow-400')} />
            </Button>
            
            <Button variant="ghost" size="icon" onClick={handleDelete} className="hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-transparent hover:border-red-500/50">
              <Trash2 className="h-4 w-4" />
            </Button>
            
            {prayer.status === 'active' && (
              <Button variant="outline" size="sm" onClick={handleUpdateStatus} className="border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black font-medium shadow-md">
                Mark as Answered
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}