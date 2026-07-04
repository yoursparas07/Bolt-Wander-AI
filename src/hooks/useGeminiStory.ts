import { useState, useCallback } from 'react';
import { fetchCityLore, CityLore } from '../services/gemini';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface State {
  lore: CityLore | null;
  status: Status;
  error: string | null;
}

export function useGeminiStory() {
  const [state, setState] = useState<State>({
    lore: null,
    status: 'idle',
    error: null,
  });

  const fetch = useCallback(
    async (city: string, country: string, placeName: string) => {
      setState({ lore: null, status: 'loading', error: null });
      try {
        const lore = await fetchCityLore(city, country, placeName);
        setState({ lore, status: 'success', error: null });
      } catch (err) {
        const message =
          err instanceof Error && err.message === 'GEMINI_KEY_MISSING'
            ? 'AI storytelling requires a Gemini API key. Add VITE_GEMINI_KEY to your .env file.'
            : 'The city is quiet right now. Try again in a moment.';
        setState({ lore: null, status: 'error', error: message });
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ lore: null, status: 'idle', error: null });
  }, []);

  return { ...state, fetch, reset };
}
