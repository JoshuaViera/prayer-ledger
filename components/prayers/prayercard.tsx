'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Database } from '@/lib/database.types'
import { Button } from '../ui/button'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Trash2, Tag, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

type Prayer = Database['public']['Tables']['prayers']['Row']

const categoryStyles: { [key: string]: string } = {
  'Personal Growth': 'border-l-rose-500',
  'Family & Relationships': 'border-l-teal-500',
  'Health & Healing': 'border-l-green-500',
  'Career & Finances': 'border-l-sky-500',
  'World Events': 'border-l-violet-500',
  'Church Community': 'border-l-amber-500',
  'General': 'border-l-gray-400',
}

const priorityStyles: { [key: string]: string } = {
  'High': 'bg-red-100 text-red-800',
  'Medium': 'bg-yellow-100 text-yellow-800',
  'Low': 'bg-gray-100 text-gray-800',
}

interface PrayerCardProps {
  prayer: Prayer
}

export function PrayerCard({ prayer }: PrayerCardProps) {
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()

  const handleUpdateStatus = async () => {
    const { error } = await supabase
      .from('prayers')
      .update({ status: 'answered' })
      .eq('id', prayer.id)
    
    if (error) { console.error('Error updating prayer status:', error) } 
    else { router.refresh() }
  }

  const handleDelete = async () => {
    const isConfirmed = window.confirm('Are you sure you want to delete this prayer request?')
    if (isConfirmed) {
      const { error } = await supabase.from('prayers').delete().eq('id', prayer.id)
      if (error) { console.error('Error deleting prayer:', error) } 
      else { router.refresh() }
    }
  }

  const handleToggleFavorite = async () => {
    const { error } = await supabase
      .from('prayers')
      .update({ is_favorited: !prayer.is_favorited })
      .eq('id', prayer.id)
    
    if (error) { console.error('Error updating favorite status:', error) } 
    else { router.refresh() }
  }

  const borderColorClass = categoryStyles[prayer.category] || categoryStyles['General']
  const priorityColorClass = priorityStyles[prayer.priority] || priorityStyles['Medium']

  return (
    <Card className={cn('border-l-4', borderColorClass)}>
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle>{prayer.title}</CardTitle>
          {prayer.details && (
            <p className="text-gray-600 text-sm mt-1">{prayer.details}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              prayer.status === 'active'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-amber-100 text-amber-800' 
            }`}
          >
            {prayer.status}
          </span>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityColorClass}`}>
            {prayer.priority} Priority
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Tag className="h-3 w-3" />
            <span>{prayer.category}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleToggleFavorite}>
              <Star className={`h-5 w-5 text-yellow-500 ${prayer.is_favorited ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
            {prayer.status === 'active' && (
              <Button variant="outline" size="sm" onClick={handleUpdateStatus}>
                Mark as Answered
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}