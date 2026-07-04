import { scoreDestination, getRecommendations, getCategoryLabel, getBudgetLabel, getTimeLabel, getRegionLabel, matchesTextSearch } from './recommend';
import { Destination, FilterCriteria } from '../types';

const mockHeritage: Destination = {
  id: 'test-heritage',
  name: 'Test Heritage Site',
  location: 'Test City',
  country: 'Test Country',
  region: 'asia',
  categories: ['heritage'],
  experienceType: 'authentic',
  budgetLevel: 'free',
  timeRequired: 'hour',
  headline: 'A test headline',
  story: 'A test story',
  localTip: 'A local tip',
  shareCaption: 'A share caption',
  storyBlurb: 'A story blurb',
  image: 'https://example.com/image.jpg',
  localBusiness: 'Test Local Shop',
  localBusinessType: 'Artisan',
  tags: ['ancient', 'pilgrimage'],
  bestFor: 'Everyone',
  hidden: true,
};

const mockFood: Destination = {
  id: 'test-food',
  name: 'Test Food Place',
  location: 'Food City',
  country: 'Food Country',
  region: 'americas',
  categories: ['food'],
  experienceType: 'mainstream',
  budgetLevel: 'premium',
  timeRequired: 'fullday',
  headline: 'Food headline',
  story: 'Food story',
  localTip: 'Food tip',
  shareCaption: 'Food caption',
  storyBlurb: 'Food blurb',
  image: 'https://example.com/food.jpg',
  tags: ['cuisine', 'market'],
  bestFor: 'Foodies',
  hidden: false,
};

const baseFilter: FilterCriteria = {
  category: 'all',
  experienceType: 'all',
  budget: 'all',
  time: 'all',
  region: 'all',
};

// ─── scoreDestination ────────────────────────────────────────────────────────

describe('scoreDestination', () => {
  test('returns a result when category matches', () => {
    const result = scoreDestination(mockHeritage, { ...baseFilter, category: 'heritage' });
    expect(result).not.toBeNull();
    expect(result?.destination.id).toBe('test-heritage');
    expect(result?.score).toBeGreaterThan(0);
  });

  test('returns null when category does not match', () => {
    expect(scoreDestination(mockHeritage, { ...baseFilter, category: 'food' })).toBeNull();
  });

  test('returns null when budget exceeds destination cost', () => {
    expect(scoreDestination(mockFood, { ...baseFilter, budget: 'free' })).toBeNull();
  });

  test('returns null when time requirement exceeds available time', () => {
    expect(scoreDestination(mockFood, { ...baseFilter, time: 'hour' })).toBeNull();
  });

  test('authentic experience adds local business reason', () => {
    const result = scoreDestination(mockHeritage, { ...baseFilter, category: 'heritage', experienceType: 'authentic' });
    expect(result?.matchReasons.some(r => r.includes('local'))).toBe(true);
  });

  test('hidden gem adds bonus reason for authentic searches', () => {
    const result = scoreDestination(mockHeritage, { ...baseFilter, experienceType: 'authentic' });
    expect(result?.matchReasons.some(r => r.toLowerCase().includes('hidden'))).toBe(true);
  });

  test('"all" category matches any destination', () => {
    expect(scoreDestination(mockHeritage, baseFilter)).not.toBeNull();
    expect(scoreDestination(mockFood, baseFilter)).not.toBeNull();
  });

  test('region filter excludes non-matching destinations', () => {
    expect(scoreDestination(mockHeritage, { ...baseFilter, region: 'europe' })).toBeNull();
    expect(scoreDestination(mockFood, { ...baseFilter, region: 'europe' })).toBeNull();
  });

  test('matching region adds score and reason', () => {
    const result = scoreDestination(mockHeritage, { ...baseFilter, region: 'asia' });
    expect(result).not.toBeNull();
    expect(result?.score).toBeGreaterThan(40);
    expect(result?.matchReasons.some(r => r.includes('Asia'))).toBe(true);
  });

  test('"all" region matches any destination', () => {
    expect(scoreDestination(mockHeritage, baseFilter)).not.toBeNull();
    expect(scoreDestination(mockFood, baseFilter)).not.toBeNull();
  });
});

// ─── matchesTextSearch ───────────────────────────────────────────────────────

describe('matchesTextSearch', () => {
  test('empty query matches everything', () => {
    expect(matchesTextSearch(mockHeritage, '')).toBe(true);
    expect(matchesTextSearch(mockFood, '')).toBe(true);
  });

  test('matches on destination name (case insensitive)', () => {
    expect(matchesTextSearch(mockHeritage, 'heritage site')).toBe(true);
    expect(matchesTextSearch(mockHeritage, 'HERITAGE')).toBe(true);
  });

  test('matches on location', () => {
    expect(matchesTextSearch(mockHeritage, 'test city')).toBe(true);
    expect(matchesTextSearch(mockFood, 'food city')).toBe(true);
  });

  test('matches on country', () => {
    expect(matchesTextSearch(mockHeritage, 'test country')).toBe(true);
  });

  test('matches on tags', () => {
    expect(matchesTextSearch(mockHeritage, 'pilgrimage')).toBe(true);
    expect(matchesTextSearch(mockFood, 'market')).toBe(true);
  });

  test('returns false for non-matching query', () => {
    expect(matchesTextSearch(mockHeritage, 'tokyo')).toBe(false);
    expect(matchesTextSearch(mockFood, 'kyoto')).toBe(false);
  });
});

// ─── getRecommendations ──────────────────────────────────────────────────────

describe('getRecommendations', () => {
  const all = [mockHeritage, mockFood];

  test('returns only matching destinations', () => {
    const results = getRecommendations(all, { ...baseFilter, category: 'heritage' });
    expect(results.length).toBe(1);
    expect(results[0].destination.id).toBe('test-heritage');
  });

  test('respects limit parameter', () => {
    const results = getRecommendations(all, baseFilter, 1);
    expect(results.length).toBe(1);
  });

  test('sorts by score descending', () => {
    const results = getRecommendations(all, { ...baseFilter, experienceType: 'authentic' });
    if (results.length >= 2) {
      expect(results[0].score).toBeGreaterThanOrEqual(results[1].score);
    }
  });

  test('returns empty array when no match', () => {
    const results = getRecommendations(all, { ...baseFilter, category: 'nightlife', budget: 'free', time: 'hour' });
    expect(results).toEqual([]);
  });

  test('filters by region', () => {
    const results = getRecommendations(all, { ...baseFilter, region: 'americas' });
    expect(results.every(r => r.destination.region === 'americas')).toBe(true);
  });

  test('text query filters by name', () => {
    const results = getRecommendations(all, baseFilter, 6, 'heritage');
    expect(results.length).toBe(1);
    expect(results[0].destination.id).toBe('test-heritage');
  });

  test('text query filters by tag', () => {
    const results = getRecommendations(all, baseFilter, 6, 'pilgrimage');
    expect(results.length).toBe(1);
  });

  test('empty text query returns all matching', () => {
    const results = getRecommendations(all, baseFilter, 6, '');
    expect(results.length).toBe(2);
  });
});

// ─── label helpers ───────────────────────────────────────────────────────────

describe('label helpers', () => {
  test('getCategoryLabel', () => {
    expect(getCategoryLabel('heritage')).toBe('Heritage');
    expect(getCategoryLabel('food')).toBe('Food & Drink');
    expect(getCategoryLabel('art')).toBe('Art & Craft');
    expect(getCategoryLabel('nightlife')).toBe('Nightlife');
    expect(getCategoryLabel('nature')).toBe('Nature');
    expect(getCategoryLabel('all')).toBe('All Cultures');
  });

  test('getBudgetLabel', () => {
    expect(getBudgetLabel('free')).toBe('Free');
    expect(getBudgetLabel('budget')).toBe('Budget-friendly');
    expect(getBudgetLabel('mid')).toBe('Mid-range');
    expect(getBudgetLabel('premium')).toBe('Premium');
  });

  test('getTimeLabel', () => {
    expect(getTimeLabel('hour')).toBe('1–2 hours');
    expect(getTimeLabel('halfday')).toBe('Half day');
    expect(getTimeLabel('fullday')).toBe('Full day');
    expect(getTimeLabel('weekend')).toBe('Weekend+');
  });

  test('getRegionLabel', () => {
    expect(getRegionLabel('all')).toBe('Anywhere');
    expect(getRegionLabel('asia')).toBe('Asia & Caucasus');
    expect(getRegionLabel('europe')).toBe('Europe');
    expect(getRegionLabel('africa-middle-east')).toBe('Africa & Middle East');
    expect(getRegionLabel('americas')).toBe('The Americas');
  });
});
