import { supabase } from '../lib/supabase';
import { FilterCriteria } from '../types';

export async function logSearch(
  criteria: FilterCriteria,
  textQuery: string,
  resultsCount: number
): Promise<void> {
  await supabase.from('search_analytics').insert({
    category: criteria.category,
    experience_type: criteria.experienceType,
    budget: criteria.budget,
    time_required: criteria.time,
    region: criteria.region,
    text_query: textQuery,
    results_count: resultsCount,
  });
}
