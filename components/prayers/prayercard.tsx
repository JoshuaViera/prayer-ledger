// File: components/prayers/prayerCard.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Database } from '@/lib/database.types'
import { Button } from '../ui/button'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

type Prayer = Database['public']['Tables']['prayers']['Row']

interface PrayerCardProps {
  prayer: Prayer
  onUpdate: () => void // Callback to tell the dashboard to refresh
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
      onUpdate() // Trigger the refresh on the dashboard
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle>{prayer.title}</CardTitle>
          {prayer.details && <p className="text-gray-600 text-sm mt-1">{prayer.details}</p>}
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
        {prayer.status === 'active' && (
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={handleUpdateStatus}>
              Mark as Answered
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}