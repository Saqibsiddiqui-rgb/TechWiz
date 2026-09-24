/**
 * Campus Coin "AI" categorization assistant (mock).
 * In production this would call an ML/LLM service. Here, a keyword model plus the student's
 * own corrections produce a suggestion. Suggestions are advisory: the student can always override.
 */
const KEYWORDS: Record<string, string[]> = {
  food: ['cafe', 'café', 'canteen', 'foodpanda', 'biryani', 'pizza', 'burger', 'chai', 'paratha', 'lunch', 'dinner', 'breakfast',
    'grocer', 'imtiaz', 'naheed', 'mess', 'kfc', 'mcdonald', 'shawarma', 'dhaba', 'bakery', 'snack', 'restaurant', 'food'],
  transport: ['bus', 'metro', 'careem', 'uber', 'bykea', 'indrive', 'rickshaw', 'petrol', 'fuel', 'ride', 'train', 'fare', 'peoples bus', 'green line'],
  hostel: ['hostel', 'rent', 'laundry', 'utilities', 'electricity', 'room', 'warden', 'gas bill'],
  academics: ['book', 'tuition', 'stationery', 'fee', 'course', 'notes', 'printing', 'calculator', 'semester', 'exam', 'lab'],
  subscriptions: ['netflix', 'spotify', 'icloud', 'youtube', 'prime', 'chatgpt', 'canva', 'subscription', 'google one', 'disney'],
  entertainment: ['movie', 'cinema', 'nueplex', 'cinepax', 'bowling', 'concert', 'ticket', 'game', 'outing', 'qawwali', 'trip', 'arcade'],
  misc: ['top-up', 'top up', 'photocop', 'recharge', 'haircut', 'gift for', 'donation', 'misc'],
  allowance: ['allowance', 'pocket money', 'from abbu', 'from ammi', 'from dad', 'from mom'],
  job: ['salary', 'tutoring', 'tuition class', 'freelance', 'fiverr', 'upwork', 'part-time', 'internship', 'stipend'],
  scholarship: ['scholarship', 'grant', 'ehsaas', 'hec', 'merit'],
  gift: ['gift', 'eidi', 'eid', 'birthday'],
};

export interface Suggestion { categoryId: string; confidence: number; learned: boolean }

export function suggestCategory(
  description: string,
  type: 'income' | 'expense',
  corrections: Record<string, string>,
  validIds: string[],
): Suggestion | null {
  const text = description.trim().toLowerCase();
  if (text.length < 3) return null;

  // 1) Learned corrections always win: the student taught us this one.
  const learnedKey = Object.keys(corrections).find((k) => text.includes(k) || k.includes(text));
  if (learnedKey && validIds.includes(corrections[learnedKey])) {
    return { categoryId: corrections[learnedKey], confidence: 0.97, learned: true };
  }

  // 2) Keyword model
  let best: Suggestion | null = null;
  for (const [cat, words] of Object.entries(KEYWORDS)) {
    if (!validIds.includes(cat)) continue;
    const hits = words.filter((w) => text.includes(w)).length;
    if (hits && (!best || hits > best.confidence)) best = { categoryId: cat, confidence: hits, learned: false };
  }
  if (!best) return type === 'income' ? { categoryId: 'other-income', confidence: 0.4, learned: false } : null;
  return { ...best, confidence: Math.min(0.95, 0.72 + best.confidence * 0.1) };
}

/** Normalises a description into a correction key, e.g. "Campus Cafe #2" -> "campus cafe" */
export const correctionKey = (description: string) =>
  description.toLowerCase().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim().split(' ').slice(0, 2).join(' ');
