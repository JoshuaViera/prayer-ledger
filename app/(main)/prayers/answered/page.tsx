'use client'

import { useState, useEffect, useCallback } from 'react'
import { PrayerCard } from '@/components/prayers/prayercard'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/database.types'
import { Award } from 'lucide-react'

type Prayer = Database['public']['Tables']['prayers']['Row']

export default function AnsweredPrayersPage() {
  const [prayers, setPrayers] = useState<Prayer[]>([])
  const supabase = createSupabaseBrowserClient()

  const fetchPrayers = useCallback(async () => {
    const { data, error } = await supabase
      .from('prayers')
      .select('*')
      .eq('status', 'answered')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching answered prayers:', error)
    } else {
      setPrayers(data)
    }
  }, [supabase])

  useEffect(() => {
    fetchPrayers()
  }, [fetchPrayers])

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <Award className="mx-auto h-12 w-12 text-amber-500 mb-2" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Completed Commitments</h1>
          <p className="text-gray-600">A journal of God's faithfulness.</p>
        </div>
        <div className="space-y-4">
          {prayers && prayers.length > 0 ? (
            prayers.map((prayer) => (
              <div key={prayer.id} className="border-2 border-amber-300 rounded-lg shadow-sm">
                <PrayerCard
                  prayer={prayer}
                  onUpdate={fetchPrayers} // <-- Pass the refresh function here
                />
              </div>
            ))
          ) : (
            <div className="text-center bg-white p-6 rounded-lg shadow-card">
              <p className="text-gray-500">You havent completed any vows yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}