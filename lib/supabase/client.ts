// lib/supabase/client.ts

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type Database = {
  public: {
    Tables: {
      prayers: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          title: string
          details: string | null
          status: 'active' | 'answered'
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          title: string
          details?: string | null
          status?: 'active' | 'answered'
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          title?: string
          details?: string | null
          status?: 'active' | 'answered'
        }
      }
    }
  }
}