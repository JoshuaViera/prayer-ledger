import { prayerCategories } from '@/lib/validations';

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export interface VowData {
  title: string;
  details: string;
  category: typeof prayerCategories[number];
}

export interface VowCompleteResponse {
  type: 'vow_complete';
  title: string;
  details: string;
  category: string;
}