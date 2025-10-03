// lib/check-ins.ts
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export interface CheckInStats {
  totalCheckIns: number;
  currentStreak: number;
  lastCheckIn: Date | null;
  hasCheckedInToday: boolean;
}

/**
 * Check if user has checked in today for a specific vow
 */
export async function hasCheckedInToday(vowId: string): Promise<boolean> {
  const supabase = createSupabaseBrowserClient();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const { data, error } = await supabase
    .from('check_ins')
    .select('id')
    .eq('vow_id', vowId)
    .gte('checked_in_at', `${today}T00:00:00`)
    .lte('checked_in_at', `${today}T23:59:59`)
    .limit(1);

  if (error) {
    console.error('Error checking today\'s check-in:', error);
    return false;
  }

  return (data?.length ?? 0) > 0;
}

/**
 * Create a check-in for today
 */
export async function checkInToday(vowId: string): Promise<boolean> {
  const supabase = createSupabaseBrowserClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // Check if already checked in today
  const alreadyCheckedIn = await hasCheckedInToday(vowId);
  if (alreadyCheckedIn) return false;

  const { error } = await supabase
    .from('check_ins')
    .insert({
      vow_id: vowId,
      user_id: user.id,
    });

  if (error) {
    console.error('Error creating check-in:', error);
    return false;
  }

  return true;
}

/**
 * Calculate streak and stats for a vow
 */
export async function getCheckInStats(vowId: string): Promise<CheckInStats> {
  const supabase = createSupabaseBrowserClient();

  const { data: checkIns, error } = await supabase
    .from('check_ins')
    .select('checked_in_at')
    .eq('vow_id', vowId)
    .order('checked_in_at', { ascending: false });

  if (error || !checkIns || checkIns.length === 0) {
    return {
      totalCheckIns: 0,
      currentStreak: 0,
      lastCheckIn: null,
      hasCheckedInToday: false,
    };
  }

  // Calculate streak
  const dates = checkIns.map(c => new Date(c.checked_in_at || '').toISOString().split('T')[0]);
  const uniqueDates = [...new Set(dates)]; // Remove duplicates
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < uniqueDates.length; i++) {
    const checkDate = new Date(uniqueDates[i]);
    checkDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === i) {
      streak++;
    } else {
      break;
    }
  }

  const lastCheckIn = checkIns[0].checked_in_at ? new Date(checkIns[0].checked_in_at) : null;
  const todayStr = new Date().toISOString().split('T')[0];
  const hasCheckedInToday = uniqueDates[0] === todayStr;

  return {
    totalCheckIns: checkIns.length,
    currentStreak: streak,
    lastCheckIn,
    hasCheckedInToday,
  };
}