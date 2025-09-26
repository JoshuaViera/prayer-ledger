'use client'

import { useState, useEffect, useCallback } from 'react'
import { PrayerCard } from '@/components/prayers/prayercard'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/database.types'
import { prayerCategories } from '@/lib/validations'
import Confetti from 'react-confetti'
import { Input } from '@/components/ui/input' // Import the Input component

type Prayer = Database['public']['Tables']['prayers']['Row']
const allCategories = ['All', ...prayerCategories]

export default function ActivePrayersPage() {
  const [prayers, setPrayers] = useState<Prayer[]>([])
  const [activeFilter, setActiveFilter] = useState('All')
  const [showConfetti, setShowConfetti] = useState(false)
  const [searchQuery, setSearchQuery] = useState('') // New state for the search input
  const supabase = createSupabaseBrowserClient()

  const fetchPrayers = useCallback(async () => {
    const { data, error } = await supabase
      .from('prayers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching prayers:', error)
    } else {
      setPrayers(data)
    }
  }, [supabase])

  useEffect(() => {
    fetchPrayers()
  }, [fetchPrayers])

  const handlePrayerAnswered = () => {
    setShowConfetti(true)
    fetchPrayers()
    setTimeout(() => setShowConfetti(false), 5000)
  }

  // Updated filtering logic to include search
  const filteredPrayers = prayers
    .filter((prayer) => {
      // Category filter
      if (activeFilter === 'All') return true
      return prayer.category === activeFilter
    })
    .filter((prayer) => {
      // Search filter (case-insensitive)
      if (searchQuery === '') return true
      const query = searchQuery.toLowerCase()
      return (
        prayer.title.toLowerCase().includes(query) ||
        (prayer.details && prayer.details.toLowerCase().includes(query))
      )
    })

  return (
    <div className="p-4 sm:p-8">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All Prayers</h1>
          <p className="text-gray-600">Your complete prayer journal</p>
        </div>

        {/* New Search Bar */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search prayers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white"
          />
        </div>

        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex space-x-2">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
                  activeFilter === category
                    ? 'bg-primary text-white shadow'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {filteredPrayers && filteredPrayers.length > 0 ? (
            filteredPrayers.map((prayer) => (
              <PrayerCard
                key={prayer.id}
                prayer={prayer}
                onUpdate={fetchPrayers}
                onPrayerAnswered={handlePrayerAnswered}
              />
            ))
          ) : (
            <div className="text-center bg-white p-6 rounded-lg shadow-card">
              <p className="text-gray-500">
                No prayers match your search or filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}