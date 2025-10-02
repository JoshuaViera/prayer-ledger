// components/prayers/prayerCard.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Database } from '@/lib/database.types'
import { Button } from '../ui/button'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Trash2, Tag, Star, Share2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Prayer = Database['public']['Tables']['prayers']['Row']

// Updated category border colors for maximum visibility
const categoryStyles: { [key: string]: string } = {
  'Personal Growth': 'border-l-pink-400',        // Hot pink
  'Family & Relationships': 'border-l-cyan-400',  // Bright cyan
  'Health & Healing': 'border-l-emerald-400',     // Bright emerald
  'Career & Finances': 'border-l-blue-400',       // Bright blue
  'World Events': 'border-l-purple-400',          // Bright purple
  'Church Community': 'border-l-yellow-400',      // Bright yellow
  'General': 'border-l-orange-400',               // Bright orange
}

// Updated priority badge colors - much more distinct
const priorityStyles: { [key: string]: string } = {
  'High': 'bg-red-500 text-white shadow-lg',      // Bright red with shadow
  'Medium': 'bg-yellow-500 text-black shadow-lg', // Bright yellow with black text
  'Low': 'bg-green-500 text-white shadow-lg',     // Bright green with shadow
}

interface PrayerCardProps {
  prayer: Prayer
  onUpdate?: () => void
  onPrayerAnswered?: () => void // Keep for confetti trigger
}

export function PrayerCard({ prayer, onUpdate, onPrayerAnswered }: PrayerCardProps) {
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()
  const [isCopied, setIsCopied] = useState(false)

  const refreshData = () => {
    if (onUpdate) onUpdate()
    else router.refresh()
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
  const priorityColorClass = priorityStyles[prayer.priority] || priorityStyles['Medium']

  return (
    // Card with much more distinct styling
    <Card className={cn('border-2 border-border border-l-8 shadow-xl hover:shadow-2xl transition-all duration-300 bg-card backdrop-blur-sm', borderColorClass)}>
      <CardHeader className="flex flex-row justify-between items-start bg-gradient-to-r from-card/50 to-secondary/30 rounded-t-lg">
        <div>
          <CardTitle className="text-foreground text-xl font-bold drop-shadow-sm">{prayer.title}</CardTitle>
          {prayer.details && (
            <p className="text-card-foreground/80 text-sm mt-2 bg-muted/30 p-2 rounded">{prayer.details}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          {/* Status badge colors - much brighter and more distinct */}
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full shadow-md ${
              prayer.status === 'active'
                ? 'bg-blue-500 text-white border border-blue-300' // Bright blue for active
                : 'bg-emerald-500 text-white border border-emerald-300' // Bright emerald for answered
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
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm bg-accent/20 px-3 py-1 rounded-full">
            <Tag className="h-4 w-4 text-accent-foreground" />
            <span className="text-accent-foreground font-medium">{prayer.category}</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Share Button - bright with distinct hover */}
            <Button variant="ghost" size="icon" onClick={handleShare} className="hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 border border-transparent hover:border-cyan-500/50">
              {isCopied ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
            </Button>
            {/* Favorite Button - gold/yellow theme */}
            <Button variant="ghost" size="icon" onClick={handleToggleFavorite} className="hover:bg-yellow-500/20 text-yellow-400 hover:text-yellow-300 border border-transparent hover:border-yellow-500/50">
              <Star className={cn("h-5 w-5", prayer.is_favorited ? 'fill-yellow-400 text-yellow-400' : 'text-yellow-400')} />
            </Button>
            {/* Delete Button - red theme */}
            <Button variant="ghost" size="icon" onClick={handleDelete} className="hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-transparent hover:border-red-500/50">
              <Trash2 className="h-4 w-4" />
            </Button>
            {prayer.status === 'active' && (
              // Mark as Answered Button - bright green theme
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