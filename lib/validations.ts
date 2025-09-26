// File: lib/validations.ts

import { z } from 'zod'

export const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const prayerCategories = [
  'General',
  'Personal Growth',
  'Family & Relationships',
  'Health & Healing',
  'Career & Finances',
  'World Events',
  'Church Community',
] as const

export const prayerSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  details: z.string().optional(),
  category: z.enum(prayerCategories),
})

// --- New: Schema for the password update form ---
export const updatePasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // Point the error to the confirmation field
  })

export type AuthFormData = z.infer<typeof authSchema>
export type PrayerFormData = z.infer<typeof prayerSchema>
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>