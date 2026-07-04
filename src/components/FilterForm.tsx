import { useState } from 'react';
import { FilterCriteria, Category, ExperienceType, Budget, TimeAvailable, Region } from '../types';
import { getCategoryLabel, getBudgetLabel, getTimeLabel, getRegionLabel, getRegionFlag } from '../lib/recommend';
import { Search, Compass, Wallet, Clock, MapPin } from 'lucide-react';

interface Props {
  onSearch: (criteria: FilterCriteria) => void;
  loading?: boolean;
}

const CATEGORIES: Array<{ value: Category | 'all'; emoji: string }> = [
  { value: 'all', emoji: '🌍' },
  { value: 'heritage', emoji: '🏛️' },
  { value: 'food', emoji: '🍽️' },
  { value: 'art', emoji: '🎨' },
  { value: 'nightlife', emoji: '🎵' },
  { value: 'nature', emoji: '🌿' },
];

const EXPERIENCE_TYPES: Array<{ value: ExperienceType | 'all'; label: string; desc: string }> = [
  { value: 'all', label: 'Any', desc: 'Show everything' },
  { value: 'authentic', label: 'Off the beaten path', desc: 'Local & hidden gems' },
  { value: 'mixed', label: 'Balanced', desc: 'Mix of known & hidden' },
  { value: 'mainstream', label: 'Must-see', desc: 'Iconic & well-known' },
];

const REGIONS: Array<Region | 'all'> = ['all', 'asia', 'europe', 'africa-middle-east', 'americas'];
const BUDGETS: Array<Budget | 'all'> = ['all', 'free', 'budget', 'mid', 'premium'];
const TIMES: Array<TimeAvailable | 'all'> = ['all', 'hour', 'halfday', 'fullday', 'weekend'];

export default function FilterForm({ onSearch, loading }: Props) {
  const [criteria, setCriteria] = useState<FilterCriteria>({
    category: 'all',
    experienceType: 'all',
    budget: 'all',
    time: 'all',
    region: 'all',
  });

  const set = <K extends keyof FilterCriteria>(key: K, val: FilterCriteria[K]) =>
    setCriteria(prev => ({ ...prev, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(criteria);
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Destination discovery form"
      className="bg-ivory-50 border border-ivory-400 rounded-2xl p-6 md:p-8 postcard-shadow space-y-7"
    >
      {/* Category */}
      <fieldset>
        <legend className="flex items-center gap-2 mb-3">
          <Compass size={16} className="text-teal-600" aria-hidden="true" />
          <span className="section-label">What calls to you?</span>
        </legend>
        <div role="group" aria-label="Category selection" className="flex flex-wrap gap-2">
          {CATEGORIES.map(({ value, emoji }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={criteria.category === value}
              onClick={() => set('category', value)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-work-sans font-500
                border-2 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-marigold-500
                ${criteria.category === value
                  ? 'bg-night-800 text-ivory-200 border-night-700'
                  : 'bg-white text-ink-600 border-ivory-400 hover:border-night-400 hover:bg-ivory-100'}
              `}
            >
              <span aria-hidden="true">{emoji}</span>
              {getCategoryLabel(value)}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Region */}
      <fieldset>
        <legend className="flex items-center gap-2 mb-3">
          <MapPin size={16} className="text-teal-600" aria-hidden="true" />
          <span className="section-label">Where in the world?</span>
        </legend>
        <div role="radiogroup" aria-label="Region selection" className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {REGIONS.map(value => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={criteria.region === value}
              onClick={() => set('region', value)}
              className={`
                flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-marigold-500 text-center
                ${criteria.region === value
                  ? 'bg-marigold-500 text-night-900 border-marigold-400 shadow-sm'
                  : 'bg-white text-ink-600 border-ivory-400 hover:border-marigold-300 hover:bg-ivory-100'}
              `}
            >
              <span className="text-xl leading-none" aria-hidden="true">{getRegionFlag(value)}</span>
              <span className="font-work-sans text-xs font-500 leading-tight">{getRegionLabel(value)}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Experience type */}
      <fieldset>
        <legend className="flex items-center gap-2 mb-3">
          <Search size={16} className="text-teal-600" aria-hidden="true" />
          <span className="section-label">Experience depth</span>
        </legend>
        <div role="radiogroup" aria-label="Experience type" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {EXPERIENCE_TYPES.map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={criteria.experienceType === value}
              onClick={() => set('experienceType', value)}
              className={`
                p-3 rounded-xl text-left border-2 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-marigold-500
                ${criteria.experienceType === value
                  ? 'bg-teal-600 text-white border-teal-500'
                  : 'bg-white text-ink-700 border-ivory-400 hover:border-teal-300'}
              `}
            >
              <div className="font-work-sans font-600 text-sm">{label}</div>
              <div className={`text-xs mt-0.5 ${criteria.experienceType === value ? 'text-teal-100' : 'text-ink-400'}`}>{desc}</div>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Budget */}
        <fieldset>
          <legend className="flex items-center gap-2 mb-3">
            <Wallet size={16} className="text-teal-600" aria-hidden="true" />
            <span className="section-label">Budget</span>
          </legend>
          <div role="radiogroup" aria-label="Budget level" className="space-y-2">
            {BUDGETS.map(val => (
              <label key={val} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="budget"
                  value={val}
                  checked={criteria.budget === val}
                  onChange={() => set('budget', val)}
                  className="w-4 h-4 accent-marigold-500"
                />
                <span className={`text-sm font-work-sans transition-colors ${criteria.budget === val ? 'text-ink-800 font-600' : 'text-ink-500 group-hover:text-ink-700'}`}>
                  {getBudgetLabel(val)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Time */}
        <fieldset>
          <legend className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-teal-600" aria-hidden="true" />
            <span className="section-label">Time available</span>
          </legend>
          <div role="radiogroup" aria-label="Time available" className="space-y-2">
            {TIMES.map(val => (
              <label key={val} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="time"
                  value={val}
                  checked={criteria.time === val}
                  onChange={() => set('time', val)}
                  className="w-4 h-4 accent-marigold-500"
                />
                <span className={`text-sm font-work-sans transition-colors ${criteria.time === val ? 'text-ink-800 font-600' : 'text-ink-500 group-hover:text-ink-700'}`}>
                  {getTimeLabel(val)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="
          w-full py-4 bg-night-800 text-ivory-100 font-fraunces text-lg font-600
          rounded-xl border-2 border-night-700 transition-all duration-300
          hover:bg-night-700 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-marigold-500
          disabled:opacity-60 disabled:cursor-not-allowed
          flex items-center justify-center gap-3
        "
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-ivory-300 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            <span>Finding your stories...</span>
          </>
        ) : (
          <>
            <span aria-hidden="true">🧭</span>
            <span>Discover your story</span>
          </>
        )}
      </button>
    </form>
  );
}
