// components/dashboard/DaysInPrayerCard.tsx
'use client'

import { useState, useEffect } from 'react'
import { HeartHandshake } from 'lucide-react'

// This is the helper component for just the StatCard
function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string | number }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-card flex flex-col items-center text-center">
      <div className="text-primary mb-2">{icon}</div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  )
}

interface DaysInPrayerCardProps {
  firstPrayerDate: Date | null
}

export function DaysInPrayerCard({ firstPrayerDate }: DaysInPrayerCardProps) {
  const [journeyDays, setJourneyDays] = useState(0)

  useEffect(() => {
    if (firstPrayerDate) {
      // This calculation now runs safely in the browser
      const days = Math.ceil(
        (new Date().getTime() - firstPrayerDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      setJourneyDays(days)
    }
  }, [firstPrayerDate])

  return (
    <StatCard icon={<HeartHandshake size={28} />} title="Days in Prayer" value={journeyDays} />
  )
}