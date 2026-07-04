import { TTLCache } from './cache';
import { CITY_LORE_PROMPT } from '../constants/prompts';
import { sanitizeAIOutput } from '../utils/sanitize';
import { supabase } from '../lib/supabase';

export interface CityLore {
  opening: string;
  hiddenSecret: string;
  tradition: string;
  taste: string;
  etiquette: string;
  legend: string;
  experience: string;
}

// L1: in-memory (instant)
const memCache = new TTLCache<CityLore>(15 * 60 * 1000);

const API_KEY = import.meta.env.VITE_GEMINI_KEY as string | undefined;
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

function cacheKey(city: string, place: string): string {
  return `${city.toLowerCase().trim()}::${place.toLowerCase().trim()}`;
}

async function readDbCache(key: string): Promise<CityLore | null> {
  const { data } = await supabase
    .from('lore_cache')
    .select('opening,hidden_secret,tradition,taste,etiquette,legend,experience,expires_at')
    .eq('cache_key', key)
    .maybeSingle();

  if (!data) return null;
  if (new Date(data.expires_at) < new Date()) return null;

  return {
    opening: data.opening,
    hiddenSecret: data.hidden_secret,
    tradition: data.tradition,
    taste: data.taste,
    etiquette: data.etiquette,
    legend: data.legend,
    experience: data.experience,
  };
}

async function writeDbCache(
  key: string,
  city: string,
  country: string,
  placeName: string,
  lore: CityLore
): Promise<void> {
  await supabase.from('lore_cache').upsert(
    {
      cache_key: key,
      city,
      country,
      place_name: placeName,
      opening: lore.opening,
      hidden_secret: lore.hiddenSecret,
      tradition: lore.tradition,
      taste: lore.taste,
      etiquette: lore.etiquette,
      legend: lore.legend,
      experience: lore.experience,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    { onConflict: 'cache_key' }
  );
}

export async function fetchCityLore(
  city: string,
  country: string,
  placeName: string
): Promise<CityLore> {
  const key = cacheKey(city, placeName);

  // L1: memory
  const mem = memCache.get(key);
  if (mem) return mem;

  // L2: database
  const db = await readDbCache(key);
  if (db) {
    memCache.set(key, db);
    return db;
  }

  // L3: Gemini API
  if (!API_KEY) throw new Error('GEMINI_KEY_MISSING');

  const prompt = CITY_LORE_PROMPT(city, country, placeName);

  const res = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.8,
        maxOutputTokens: 600,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const rawText: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  if (!rawText) throw new Error('Empty response from Gemini');

  let parsed: CityLore;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error('Gemini returned malformed JSON');
  }

  const lore: CityLore = {
    opening: sanitizeAIOutput(parsed.opening ?? ''),
    hiddenSecret: sanitizeAIOutput(parsed.hiddenSecret ?? ''),
    tradition: sanitizeAIOutput(parsed.tradition ?? ''),
    taste: sanitizeAIOutput(parsed.taste ?? ''),
    etiquette: sanitizeAIOutput(parsed.etiquette ?? ''),
    legend: sanitizeAIOutput(parsed.legend ?? ''),
    experience: sanitizeAIOutput(parsed.experience ?? ''),
  };

  memCache.set(key, lore);
  writeDbCache(key, city, country, placeName, lore); // fire-and-forget

  return lore;
}

export { memCache as loreCache };
