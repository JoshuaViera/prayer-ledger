import { z } from 'zod'

export const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const prayerSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  details: z.string().optional(),
  status: z.enum(['active', 'answered']).default('active'),
})

export type AuthFormData = z.infer<typeof authSchema>
export type PrayerFormData = z.infer<typeof prayerSchema>