import { RecommendationResult } from '../types';
import RecommendationCard from './RecommendationCard';
import SkeletonCard from './SkeletonCard';
import { Frown, RotateCcw } from 'lucide-react';

interface Props {
  results: RecommendationResult[];
  loading?: boolean;
  savedIds: Set<string>;
  onSave: (result: RecommendationResult) => void;
  onShare: (r: RecommendationResult) => void;
  onReset: () => void;
}

const SKELETON_COUNT = 3;

export default function ResultsGrid({ results, loading, savedIds, onSave, onShare, onReset }: Props) {
  if (loading) {
    return (
      <section aria-label="Loading destinations" aria-busy="true">
        <div className="flex items-center justify-between mb-6">
          <div className="h-3 w-32 bg-ivory-400 rounded-full animate-pulse" />
        </div>
        <ul className="grid gap-6 grid-auto-fill-card" role="list" aria-label="Loading destinations">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <li key={i}>
              <SkeletonCard />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (results.length === 0) {
    return (
      <section aria-label="No results" className="text-center py-16 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-ivory-300 rounded-full mb-4">
          <Frown size={28} className="text-ink-400" aria-hidden="true" />
        </div>
        <h3 className="font-fraunces text-2xl text-ink-700 mb-2">No destinations matched</h3>
        <p className="text-ink-400 text-sm mb-6 max-w-sm mx-auto">
          Try broadening your filters or adjusting your search — fewer constraints reveal more stories.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-work-sans font-600 hover:bg-teal-700 transition-colors focus-visible:ring-2 focus-visible:ring-marigold-500"
        >
          <RotateCcw size={14} aria-hidden="true" />
          Reset filters
        </button>
      </section>
    );
  }

  return (
    <section aria-label={`${results.length} destination recommendations`}>
      <div className="flex items-center justify-between mb-6">
        <p className="font-mono text-xs text-ink-400 uppercase tracking-widest">
          <span className="text-teal-600 font-500">{results.length}</span> stories found
        </p>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-ink-400 hover:text-teal-600 transition-colors focus-visible:underline"
          aria-label="Clear results and start a new search"
        >
          <RotateCcw size={12} aria-hidden="true" />
          New search
        </button>
      </div>

      <ul
        className="grid gap-6 grid-auto-fill-card"
        role="list"
        aria-label="Destination recommendations"
      >
        {results.map((result, i) => (
          <li key={result.destination.id} className="animate-fade-up" style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both', opacity: 0 }}>
            <RecommendationCard
              result={result}
              index={i}
              isSaved={savedIds.has(result.destination.id)}
              onSave={() => onSave(result)}
              onShare={onShare}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
