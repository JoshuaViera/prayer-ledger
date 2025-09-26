'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { updatePasswordSchema, type UpdatePasswordFormData } from '@/lib/validations'
import type { User } from '@supabase/supabase-js'

export function UpdatePasswordForm() {
  const [user, setUser] = useState<User | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; content: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [supabase])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
  })

  const onSubmit = async (data: UpdatePasswordFormData) => {
    setIsLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.updateUser({ password: data.password })

    if (error) {
      setMessage({ type: 'error', content: error.message })
    } else {
      setMessage({ type: 'success', content: 'Your password has been updated successfully.' })
      reset()
    }
    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-lg shadow-card">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your account settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold">Email Address</h3>
          <p className="text-gray-600">{user ? user.email : 'Loading...'}</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h3 className="font-semibold">Update Password</h3>
          <div>
            <Input
              {...register('password')}
              type="password"
              placeholder="New Password"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>
          <div>
            <Input
              {...register('confirmPassword')}
              type="password"
              placeholder="Confirm New Password"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
        {message && (
          <div
            className={`p-3 rounded-md text-sm ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message.content}
          </div>
        )}
      </CardContent>
    </Card>
  )
}