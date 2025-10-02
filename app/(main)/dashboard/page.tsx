//  /app/(main)/dashboard/page.tsx

import { redirect } from 'next/navigation'

export default function OldDashboardPage() {
  redirect('/home')
}