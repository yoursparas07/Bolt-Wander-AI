import { Destination, FilterCriteria, RecommendationResult } from '../types';

const BUDGET_SCORE: Record<string, number> = {
  free: 1,
  budget: 2,
  mid: 3,
  premium: 4,
};

const TIME_SCORE: Record<string, number> = {
  hour: 1,
  halfday: 2,
  fullday: 3,
  weekend: 4,
};

export function matchesTextSearch(destination: Destination, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    destination.name.toLowerCase().includes(q) ||
    destination.location.toLowerCase().includes(q) ||
    destination.country.toLowerCase().includes(q) ||
    destination.tags.some(t => t.toLowerCase().includes(q)) ||
    destination.categories.some(c => c.toLowerCase().includes(q))
  );
}

function budgetFits(destBudget: string, filterBudget: string): boolean {
  if (filterBudget === 'all') return true;
  return BUDGET_SCORE[destBudget] <= BUDGET_SCORE[filterBudget];
}

function timeFits(destTime: string, filterTime: string): boolean {
  if (filterTime === 'all') return true;
  return TIME_SCORE[destTime] <= TIME_SCORE[filterTime];
}

export function scoreDestination(
  destination: Destination,
  criteria: FilterCriteria
): RecommendationResult | null {
  const reasons: string[] = [];
  let score = 0;

  // Hard filters first
  if (!budgetFits(destination.budgetLevel, criteria.budget)) return null;
  if (!timeFits(destination.timeRequired, criteria.time)) return null;
  if (criteria.region !== 'all' && destination.region !== criteria.region) return null;

  // Category match (primary driver)
  if (criteria.category === 'all' || destination.categories.includes(criteria.category as any)) {
    score += 40;
    if (criteria.category !== 'all') {
      reasons.push(`Matches your ${criteria.category} interest`);
    }
  } else {
    return null;
  }

  // Experience type match
  if (criteria.experienceType === 'all') {
    score += 20;
  } else if (destination.experienceType === criteria.experienceType) {
    score += 30;
    reasons.push(`${criteria.experienceType === 'authentic' ? 'Off the beaten path' : criteria.experienceType === 'mainstream' ? 'Well-known landmark' : 'Balanced experience'}`);
  } else if (destination.experienceType === 'mixed') {
    score += 15;
  } else {
    score += 5;
  }

  // Budget bonus (prefer free/cheaper when budget is tight)
  if (criteria.budget !== 'all') {
    const budgetDiff = BUDGET_SCORE[criteria.budget] - BUDGET_SCORE[destination.budgetLevel];
    score += Math.min(budgetDiff * 5, 15);
    if (destination.budgetLevel === 'free') reasons.push('Free to visit');
    else if (budgetDiff > 0) reasons.push('Within your budget');
  }

  // Authentic experience bonus for local-first filter
  if (criteria.experienceType === 'authentic' && destination.localBusiness) {
    score += 10;
    reasons.push(`Supports local: ${destination.localBusiness}`);
  }

  // Hidden gem bonus when seeking authentic
  if (destination.hidden && criteria.experienceType === 'authentic') {
    score += 8;
    reasons.push('Hidden gem — few tourists know this');
  }

  // Time fit bonus
  if (criteria.time !== 'all') {
    const timeDiff = TIME_SCORE[criteria.time] - TIME_SCORE[destination.timeRequired];
    if (timeDiff === 0) {
      score += 10;
      reasons.push('Perfect for your available time');
    } else if (timeDiff > 0) {
      score += 5;
    }
  }

  // Region match bonus
  if (criteria.region !== 'all') {
    score += 15;
    reasons.push(`In ${getRegionLabel(criteria.region)}`);
  }

  return { destination, score, matchReasons: reasons };
}

export function getRecommendations(
  destinations: Destination[],
  criteria: FilterCriteria,
  limit = 6,
  textQuery = ''
): RecommendationResult[] {
  const results: RecommendationResult[] = [];

  for (const dest of destinations) {
    if (!matchesTextSearch(dest, textQuery)) continue;
    const result = scoreDestination(dest, criteria);
    if (result) results.push(result);
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    heritage: 'Heritage',
    food: 'Food & Drink',
    art: 'Art & Craft',
    nightlife: 'Nightlife',
    nature: 'Nature',
    all: 'All Cultures',
  };
  return labels[category] ?? category;
}

export function getBudgetLabel(budget: string): string {
  const labels: Record<string, string> = {
    free: 'Free',
    budget: 'Budget-friendly',
    mid: 'Mid-range',
    premium: 'Premium',
    all: 'Any budget',
  };
  return labels[budget] ?? budget;
}

export function getTimeLabel(time: string): string {
  const labels: Record<string, string> = {
    hour: '1–2 hours',
    halfday: 'Half day',
    fullday: 'Full day',
    weekend: 'Weekend+',
    all: 'Any length',
  };
  return labels[time] ?? time;
}

export function getRegionLabel(region: string): string {
  const labels: Record<string, string> = {
    all: 'Anywhere',
    asia: 'Asia & Caucasus',
    europe: 'Europe',
    'africa-middle-east': 'Africa & Middle East',
    americas: 'The Americas',
  };
  return labels[region] ?? region;
}

export function getRegionFlag(region: string): string {
  const flags: Record<string, string> = {
    all: '🌍',
    asia: '🏯',
    europe: '🏰',
    'africa-middle-east': '🕌',
    americas: '🌎',
  };
  return flags[region] ?? '📍';
}
