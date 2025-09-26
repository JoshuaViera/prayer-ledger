// File: lib/validations.ts

import { z } from 'zod'

export const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// Define the categories in one central place
export const prayerCategories = [
  'General',
  'Personal Growth',
  'Family & Relationships',
  'Health & Healing',
  'Career & Finances',
  'World Events',
  'Church Community',
] as const // 'as const' makes it a readonly tuple for better type inference

export const prayerSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  details: z.string().optional(),
  // Add the category to the schema, ensuring it's one of our defined values
  category: z.enum(prayerCategories),
})

export type AuthFormData = z.infer<typeof authSchema>
export type PrayerFormData = z.infer<typeof prayerSchema>