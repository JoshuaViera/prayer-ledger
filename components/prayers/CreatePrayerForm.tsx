// File: components/prayers/CreatePrayerForm.tsx

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { prayerSchema, prayerCategories, type PrayerFormData } from '@/lib/validations'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useState } from 'react'

export function CreatePrayerForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PrayerFormData>({
    resolver: zodResolver(prayerSchema),
    defaultValues: {
      category: 'General', // Set a default value for the dropdown
    },
  })

  const onSubmit = async (data: PrayerFormData) => {
    setIsLoading(true)
    setError(null)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('You must be logged in to create a prayer request.')
      setIsLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('prayers').insert({
      title: data.title,
      details: data.details,
      user_id: user.id,
      category: data.category, // Include the category in the data we send
    })

    if (insertError) {
      setError(insertError.message)
      setIsLoading(false)
    } else {
      router.push('/prayers/active')
      router.refresh()
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-center text-3xl">Add a New Prayer</CardTitle>
        <p className="text-center text-gray-500">What's on your heart today?</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input {...register('title')} placeholder="Prayer Title (e.g., 'For my family')" />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <Input {...register('details')} placeholder="Details (optional)" />
            {errors.details && <p className="text-sm text-red-600 mt-1">{errors.details.message}</p>}
          </div>

          {/* New Category Dropdown */}
          <div>
            <select
              {...register('category')}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            >
              {prayerCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>}
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push('/home')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Prayer'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}