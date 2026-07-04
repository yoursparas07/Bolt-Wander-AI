import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getSessionId } from '../utils/session';
import { Destination } from '../types';

export function useSavedDestinations() {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const sessionId = getSessionId();

  useEffect(() => {
    supabase
      .from('saved_destinations')
      .select('destination_id')
      .eq('session_id', sessionId)
      .then(({ data }) => {
        if (data) setSavedIds(new Set(data.map(r => r.destination_id)));
        setLoading(false);
      });
  }, [sessionId]);

  const toggle = useCallback(
    async (destination: Destination) => {
      const isSaved = savedIds.has(destination.id);

      // Optimistic update
      setSavedIds(prev => {
        const next = new Set(prev);
        isSaved ? next.delete(destination.id) : next.add(destination.id);
        return next;
      });

      if (isSaved) {
        await supabase
          .from('saved_destinations')
          .delete()
          .eq('session_id', sessionId)
          .eq('destination_id', destination.id);
      } else {
        await supabase.from('saved_destinations').insert({
          session_id: sessionId,
          destination_id: destination.id,
          destination_name: destination.name,
          destination_location: destination.location,
          destination_country: destination.country,
          destination_image: destination.image,
        });
      }
    },
    [savedIds, sessionId]
  );

  return { savedIds, loading, toggle };
}
