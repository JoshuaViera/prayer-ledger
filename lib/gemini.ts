import { ChatMessage, VowCompleteResponse } from '@/types/chat';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const SYSTEM_PROMPT = `You are a thoughtful vow articulation assistant for Daily Vow, an app that helps people make meaningful personal commitments.
Your role is to:
1. Ask 3-5 clarifying questions to help users transform vague intentions into specific, actionable vows
2. Be warm, encouraging, and supportive - but not preachy
3. Focus on clarity, specificity, and realistic commitments
4. Help users identify what they're truly committing to and WHY it matters

Vow categories: General, Personal Growth, Family & Relationships, Health & Healing, Career & Finances, World Events, Church Community

When you have enough information (after 3-5 exchanges), respond with JSON in this EXACT format:
{
  "type": "vow_complete",
  "title": "Short actionable title (max 60 chars)",
  "details": "2-3 sentences explaining why this matters and the specific commitment parameters",
  "category": "one of the categories above"
}

Guidelines:
- Keep questions SHORT (1-2 sentences max)
- Be conversational and human
- If commitment has specific metrics (daily, 3x/week), include in details
- Title should be clear and actionable
- After 5 questions, generate the vow even if not perfect

Start by asking what area of life they want to make a commitment in.`;

interface GeminiMessage {
  role: string;
  parts: { text: string }[];
}

export async function chatWithAssistant(
  conversationHistory: ChatMessage[]): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Add NEXT_PUBLIC_GEMINI_API_KEY to .env.local');
  }
  try {
    const contents: GeminiMessage[] = [
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT }]
      },
      {
        role: 'model',
        parts: [{ text: 'Understood. I will help users articulate meaningful commitments.' }]
      }
    ];

    conversationHistory.forEach((msg) => {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    });

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('No response from Gemini API');
    }
    return text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

export function parseVowFromResponse(response: string): VowCompleteResponse | null {
  try {
    const jsonMatch = response.match(/\{[\s\S]*"type"\s*:\s*"vow_complete"[\s\S]*\}/);
    
    if (!jsonMatch) {
      return null;
    }

    const vowData = JSON.parse(jsonMatch[0]) as VowCompleteResponse;

    if (
      vowData.type === 'vow_complete' &&
      vowData.title &&
      vowData.details &&
      vowData.category
    ) {
      return vowData;
    }
    return null;
  } catch (error) {
    console.error('Error parsing vow data:', error);
    return null;
  }
}