// File: components/prayers/prayerCard.tsx

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Database } from '@/lib/database.types'
import { Button } from '../ui/button'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Trash2, Tag } from 'lucide-react' // Import Tag icon

type Prayer = Database['public']['Tables']['prayers']['Row']

interface PrayerCardProps {
  prayer: Prayer
  onUpdate: () => void
}

export function PrayerCard({ prayer, onUpdate }: PrayerCardProps) {
  const supabase = createSupabaseBrowserClient()

  const handleUpdateStatus = async () => {
    const { error } = await supabase
      .from('prayers')
      .update({ status: 'answered' })
      .eq('id', prayer.id)
    if (error) {
      console.error('Error updating prayer status:', error)
    } else {
      onUpdate()
    }
  }

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this prayer request?'
    )
    if (isConfirmed) {
      const { error } = await supabase
        .from('prayers')
        .delete()
        .eq('id', prayer.id)
      if (error) {
        console.error('Error deleting prayer:', error)
      } else {
        onUpdate()
      }
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle>{prayer.title}</CardTitle>
          {prayer.details && (
            <p className="text-gray-600 text-sm mt-1">{prayer.details}</p>
          )}
        </div>
        <div>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              prayer.status === 'active'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {prayer.status}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          {/* Display Category */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Tag className="h-3 w-3" />
            <span>{prayer.category}</span>
          </div>
          <div className="flex items-center gap-2">
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