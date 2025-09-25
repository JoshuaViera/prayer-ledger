// components/prayers/prayercard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Prayer } from '@/types'

interface PrayerCardProps {
  prayer: Prayer
}

export function PrayerCard({ prayer }: PrayerCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{prayer.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {prayer.details && <p className="text-gray-600">{prayer.details}</p>}
        <div className="mt-4">
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
      </CardContent>
    </Card>
  )
}