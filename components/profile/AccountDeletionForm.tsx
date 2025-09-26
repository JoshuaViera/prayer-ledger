'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function AccountDeletionForm() {
  const [confirmText, setConfirmText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const supabase = createSupabaseBrowserClient()
  const router = useRouter()

  const handleDeleteAccount = async () => {
    setIsLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('Could not identify the current user. Please try logging in again.')
      setIsLoading(false)
      return
    }

    const userId = user.id

    try {
      // First, delete all of the user's prayers
      const { error: prayersError } = await supabase
        .from('prayers')
        .delete()
        .eq('user_id', userId)

      if (prayersError) {
        setError('Failed to delete prayer data: ' + prayersError.message)
        setIsLoading(false)
        return
      }

      // Then delete the user account from the authentication system
      // IMPORTANT: supabase.auth.admin.deleteUser() will fail on the client-side
      // by default as it requires admin privileges. You should call a Supabase
      // Edge Function to perform this action securely.
      const { error: userError } = await supabase.rpc('delete_user')

      if (userError) {
        setError('Failed to delete account: ' + userError.message)
      } else {
        // On successful deletion, sign out and redirect
        await supabase.auth.signOut()
        router.push('/login?message=Account successfully deleted')
        router.refresh()
      }
    } catch (err: any) {
      setError('An unexpected error occurred: ' + err.message)
    }

    setIsLoading(false)
  }

  if (showConfirmDialog) {
    return (
      <div className="space-y-4 p-4 border border-destructive/20 rounded-lg bg-destructive/5">
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle size={20} />
          <h3 className="font-semibold">Delete Account</h3>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong>This action cannot be undone.</strong> This will permanently delete your account and all associated data:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>All prayer requests (active and answered)</li>
            <li>All prayer statistics and achievements</li>
            <li>Your account information</li>
          </ul>
        </div>

        <div>
          <label htmlFor="delete-confirm" className="text-sm font-medium text-muted-foreground">
            Type "DELETE MY ACCOUNT" to confirm:
          </label>
          <Input
            id="delete-confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE MY ACCOUNT"
            className="mt-1"
          />
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setShowConfirmDialog(false)
              setConfirmText('')
              setError('')
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={confirmText !== 'DELETE MY ACCOUNT' || isLoading}
          >
            {isLoading ? 'Deleting Account...' : 'Delete Account Permanently'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        <p>Once you delete your account, there is no going back. Please be certain.</p>
      </div>
      
      <Button
        variant="destructive"
        onClick={() => setShowConfirmDialog(true)}
        className="bg-destructive hover:bg-destructive/90"
      >
        Delete Account
      </Button>
    </div>
  )
}