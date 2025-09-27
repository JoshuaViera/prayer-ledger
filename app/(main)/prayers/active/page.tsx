
// app/(main)/prayers/active/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { PrayerCard } from '@/components/prayers/prayercard'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/database.types'
import { Target } from 'lucide-react'
import { Input } from '@/components/ui/input'

type Prayer = Database['public']['Tables']['prayers']['Row']

export default function ActivePrayersPage() {
  const [prayers, setPrayers] = useState<Prayer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createSupabaseBrowserClient()

  const fetchPrayers = useCallback(async () => {
    const { data, error } = await supabase
      .from('prayers')
      .select('*')
      .eq('status', 'active') // Fixed: Changed from 'answered' to 'active'
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching active vows:', error)
    } else {
      setPrayers(data)
    }
  }, [supabase])

  useEffect(() => {
    fetchPrayers()
  }, [fetchPrayers])

  // Filtering logic to include search
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
          <Target className="mx-auto h-12 w-12 text-blue-500 mb-2" />
          <h1 className="text-4xl font-bold text-foreground mb-2">Active Vows</h1>
          <p className="text-muted-foreground">Your Current Commitments</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search active vows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-4">
          {filteredPrayers && filteredPrayers.length > 0 ? (
            filteredPrayers.map((prayer) => (
              <div key={prayer.id}>
                <PrayerCard
                  prayer={prayer}
                  onUpdate={fetchPrayers}
                />
              </div>
            ))
          ) : (
            <div className="text-center bg-card p-6 rounded-lg shadow-card">
              <p className="text-muted-foreground">
                {searchQuery ? 'No active commitments match your search.' : 'No active vows yet. Add your first vow!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}