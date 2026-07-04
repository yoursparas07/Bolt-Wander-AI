import { useState } from 'react';
import { RecommendationResult } from '../types';
import CategoryStamp from './CategoryStamp';
import CityLoreModal from './CityLoreModal';
import { getBudgetLabel, getTimeLabel } from '../lib/recommend';
import { useGeminiStory } from '../hooks/useGeminiStory';
import { MapPin, Clock, Wallet, Sparkles, Share2, ChevronDown, ChevronUp, Mic2, Bookmark, BookmarkCheck } from 'lucide-react';

interface Props {
  result: RecommendationResult;
  index: number;
  isSaved: boolean;
  onSave: () => void;
  onShare: (result: RecommendationResult) => void;
}

export default function RecommendationCard({ result, index, isSaved, onSave, onShare }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showLore, setShowLore] = useState(false);
  const { lore, status, error, fetch: fetchLore, reset } = useGeminiStory();

  const { destination: d, matchReasons } = result;
  const primaryCategory = d.categories[0];

  const handleCitySpeak = () => {
    setShowLore(true);
    if (status === 'idle') {
      fetchLore(d.location, d.country, d.name);
    }
  };

  const handleClose = () => {
    setShowLore(false);
    reset();
  };

  const handleRetry = () => {
    fetchLore(d.location, d.country, d.name);
  };

  return (
    <>
      <article
        aria-label={`Destination: ${d.name}, ${d.location}`}
        className="bg-white rounded-2xl overflow-hidden postcard-shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Image header */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={d.image}
            alt={`View of ${d.name} in ${d.location}, ${d.country}`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night-900/80 via-transparent to-transparent" />

          <div className="absolute top-3 right-3 animate-stamp">
            <CategoryStamp category={primaryCategory} size="md" />
          </div>

          <div
            aria-label={`Result number ${index + 1}`}
            className="absolute top-3 left-3 w-7 h-7 bg-marigold-500 text-night-900 rounded-full flex items-center justify-center font-mono text-xs font-500"
          >
            {String(index + 1).padStart(2, '0')}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="font-mono text-xs text-marigold-300 tracking-widest uppercase mb-1">
              {d.location} · {d.country}
            </p>
            <h3 className="font-fraunces text-xl text-white leading-tight">{d.name}</h3>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p className="font-fraunces italic text-ink-700 text-base leading-snug">
            "{d.headline}"
          </p>

          <div className="flex flex-wrap gap-2" role="list" aria-label="Destination details">
            <span role="listitem" className="flex items-center gap-1 text-xs font-mono text-ink-500 bg-ivory-300 px-2.5 py-1 rounded-full">
              <Wallet size={11} aria-hidden="true" />
              {getBudgetLabel(d.budgetLevel)}
            </span>
            <span role="listitem" className="flex items-center gap-1 text-xs font-mono text-ink-500 bg-ivory-300 px-2.5 py-1 rounded-full">
              <Clock size={11} aria-hidden="true" />
              {getTimeLabel(d.timeRequired)}
            </span>
            <span role="listitem" className="flex items-center gap-1 text-xs font-mono text-ink-500 bg-ivory-300 px-2.5 py-1 rounded-full">
              <MapPin size={11} aria-hidden="true" />
              {d.bestFor.split(',')[0]}
            </span>
          </div>

          {matchReasons.length > 0 && (
            <div aria-label="Why this was recommended">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles size={12} className="text-marigold-500" aria-hidden="true" />
                <span className="font-mono text-xs text-marigold-600 tracking-wide uppercase">Why it matches</span>
              </div>
              <ul className="space-y-1" role="list">
                {matchReasons.slice(0, 3).map((reason, i) => (
                  <li key={i} className="text-xs text-ink-500 flex items-start gap-1.5">
                    <span className="text-teal-500 mt-0.5" aria-hidden="true">→</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-ivory-200 rounded-xl p-4 border-l-4 border-teal-500">
            <p className="font-fraunces text-sm text-ink-700 leading-relaxed italic">
              {d.storyBlurb}
            </p>
          </div>

          {/* Expandable full story */}
          <div>
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={`story-${d.id}`}
              onClick={() => setExpanded(v => !v)}
              className="flex items-center gap-2 text-sm font-work-sans text-teal-600 hover:text-teal-700 transition-colors focus-visible:underline"
            >
              {expanded ? (
                <><ChevronUp size={14} aria-hidden="true" /><span>Hide full story</span></>
              ) : (
                <><ChevronDown size={14} aria-hidden="true" /><span>Read the full story</span></>
              )}
            </button>

            {expanded && (
              <div id={`story-${d.id}`} role="region" aria-label={`Full story for ${d.name}`}>
                <p className="mt-3 text-sm text-ink-600 font-work-sans leading-relaxed">{d.story}</p>
                <div className="mt-3 p-3 bg-marigold-50 rounded-lg border border-marigold-200">
                  <p className="font-mono text-xs text-marigold-700 font-500 mb-1">LOCAL TIP</p>
                  <p className="text-xs text-ink-600">{d.localTip}</p>
                </div>
                {d.localBusiness && (
                  <div className="mt-2 flex items-start gap-2 text-xs text-teal-700">
                    <MapPin size={11} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span>Support local: <strong>{d.localBusiness}</strong> — {d.localBusinessType}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {/* City Speaks — Gemini AI */}
            <button
              type="button"
              onClick={handleCitySpeak}
              aria-label={`Hear ${d.location} speak — AI cultural intelligence`}
              className="
                flex-1 flex items-center justify-center gap-2 py-2.5 px-4
                bg-marigold-500 text-night-900 rounded-xl text-sm font-work-sans font-600
                hover:bg-marigold-400 transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-marigold-600
              "
            >
              <Mic2 size={14} aria-hidden="true" />
              City Speaks
            </button>

            {/* Save */}
            <button
              type="button"
              onClick={onSave}
              aria-label={isSaved ? `Remove ${d.name} from saved` : `Save ${d.name}`}
              aria-pressed={isSaved}
              className={`
                flex items-center justify-center w-10 h-10 rounded-xl text-sm transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-marigold-500
                ${isSaved
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : 'bg-ivory-300 text-ink-500 hover:bg-ivory-400'}
              `}
            >
              {isSaved
                ? <BookmarkCheck size={16} aria-hidden="true" />
                : <Bookmark size={16} aria-hidden="true" />}
            </button>

            <button
              type="button"
              onClick={() => onShare(result)}
              aria-label={`Share culture card for ${d.name}`}
              className="
                flex items-center justify-center w-10 h-10
                bg-night-800 text-ivory-100 rounded-xl text-sm
                hover:bg-night-700 transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-marigold-500
              "
            >
              <Share2 size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </article>

      {showLore && (
        <CityLoreModal
          destination={d}
          lore={lore}
          status={status}
          error={error}
          onClose={handleClose}
          onRetry={handleRetry}
        />
      )}
    </>
  );
}
