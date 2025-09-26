'use client'

import { useState, useEffect, useCallback } from 'react'
import { PrayerCard } from '@/components/prayers/prayercard'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/database.types'
import { Award } from 'lucide-react'
import { Input } from '@/components/ui/input' // Import the Input component

type Prayer = Database['public']['Tables']['prayers']['Row']

export default function AnsweredPrayersPage() {
  const [prayers, setPrayers] = useState<Prayer[]>([])
  const [searchQuery, setSearchQuery] = useState('') // New state for the search input
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

  // New filtering logic to include search
  const filteredPrayers = prayers.filter((prayer) => {
    if (searchQuery === '') return true
    const query = searchQuery.toLowerCase()
    return (
      prayer.title.toLowerCase().includes(query) ||
      (prayer.details && prayer.details.toLowerCase().includes(query))
    )
  })

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <Award className="mx-auto h-12 w-12 text-amber-500 mb-2" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Answered Prayers</h1>
          <p className="text-gray-600">A journal of God's faithfulness.</p>
        </div>

        {/* New Search Bar */}
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search answered prayers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white"
          />
        </div>

        <div className="space-y-4">
          {filteredPrayers && filteredPrayers.length > 0 ? (
            filteredPrayers.map((prayer) => (
              <div key={prayer.id} className="border-2 border-amber-300 rounded-lg shadow-sm">
                <PrayerCard
                  prayer={prayer}
                  onUpdate={fetchPrayers}
                />
              </div>
            ))
          ) : (
            <div className="text-center bg-white p-6 rounded-lg shadow-card">
              <p className="text-gray-500">No answered prayers match your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}