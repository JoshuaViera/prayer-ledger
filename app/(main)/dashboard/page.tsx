// File: app/(main)/dashboard/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { PrayerCard } from '@/components/prayers/prayercard'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { CreatePrayerForm } from '@/components/prayers/CreatePrayerForm'

type Prayer = Database['public']['Tables']['prayers']['Row']

export default function DashboardPage() {
  const [prayers, setPrayers] = useState<Prayer[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const getPrayers = async () => {
      const { data, error } = await supabase
        .from('prayers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching prayers:', error)
      } else {
        setPrayers(data)
      }
    }

    getPrayers()
  }, [supabase])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Your personal prayer journal</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>Add New Prayer</Button>
        </div>

        {showCreateForm && <CreatePrayerForm onClose={() => setShowCreateForm(false)} />}

        <div className="space-y-4">
          {prayers && prayers.length > 0 ? (
            prayers.map((prayer) => (
              <PrayerCard key={prayer.id} prayer={prayer} />
            ))
          ) : (
            <div className="text-center bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500">You haven't added any prayer requests yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}