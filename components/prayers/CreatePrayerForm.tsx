// File: components/prayers/CreatePrayerForm.tsx

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { prayerSchema, type PrayerFormData } from '@/lib/validations'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useState } from 'react'

interface CreatePrayerFormProps {
  onSuccess: () => void
}

export function CreatePrayerForm({ onSuccess }: CreatePrayerFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createSupabaseBrowserClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PrayerFormData>({
    resolver: zodResolver(prayerSchema),
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
    })

    if (insertError) {
      setError(insertError.message)
      setIsLoading(false)
    } else {
      onSuccess() // Call the success handler from the parent
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Add a New Prayer Request</CardTitle>
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
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={onSuccess} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Prayer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}