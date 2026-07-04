import { lazy, Suspense, useRef, useState, useCallback } from 'react';
import Hero from './components/Hero';
import FilterForm from './components/FilterForm';
import ResultsGrid from './components/ResultsGrid';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import SearchBar from './components/SearchBar';
import SkeletonCard from './components/SkeletonCard';
import { FilterCriteria, RecommendationResult } from './types';
import { getRecommendations } from './lib/recommend';
import { destinations } from './data/destinations';
import { useSavedDestinations } from './hooks/useSavedDestinations';
import { logSearch } from './services/analytics';
import { Compass, Bookmark } from 'lucide-react';

const ShareCard = lazy(() => import('./components/ShareCard'));

export default function App() {
  const discoverRef = useRef<HTMLElement>(null);
  const [results, setResults] = useState<RecommendationResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [shareTarget, setShareTarget] = useState<RecommendationResult | null>(null);
  const [textQuery, setTextQuery] = useState('');
  const [lastCriteria, setLastCriteria] = useState<FilterCriteria | null>(null);
  const { savedIds, toggle: toggleSave } = useSavedDestinations();

  const scrollToDiscover = () => {
    discoverRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const runSearch = useCallback(
    (criteria: FilterCriteria, query: string) => {
      setLoading(true);
      setTimeout(() => {
        const recs = getRecommendations(destinations, criteria, 6, query);
        setResults(recs);
        setLoading(false);
        logSearch(criteria, query, recs.length); // fire-and-forget analytics
        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }, 500);
    },
    []
  );

  const handleSearch = (criteria: FilterCriteria) => {
    setLastCriteria(criteria);
    runSearch(criteria, textQuery);
  };

  // When text search changes while results are already showing, re-run with last criteria
  const handleTextSearch = useCallback(
    (query: string) => {
      setTextQuery(query);
      if (lastCriteria && results !== null) {
        const recs = getRecommendations(destinations, lastCriteria, 6, query);
        setResults(recs);
      }
    },
    [lastCriteria, results]
  );

  const handleReset = () => {
    setResults(null);
    setTextQuery('');
    setLastCriteria(null);
    scrollToDiscover();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#discover"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-marigold-500 focus:text-night-900 focus:px-4 focus:py-2 focus:rounded-lg focus:font-work-sans"
      >
        Skip to main content
      </a>

      {/* Fixed nav */}
      <header role="banner" className="fixed top-0 left-0 right-0 z-40 bg-night-900/95 backdrop-blur-md border-b border-night-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-marigold-400" aria-hidden="true" />
            <span className="font-fraunces text-lg text-ivory-200">Wanderlore</span>
          </div>
          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-6" role="list">
              {[
                { label: 'Discover', href: '#discover' },
                { label: 'How it works', href: '#how-it-works' },
                { label: 'About', href: '#about' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <a href={href} className="font-work-sans text-sm text-night-300 hover:text-ivory-200 transition-colors focus-visible:underline">
                    {label}
                  </a>
                </li>
              ))}
              {savedIds.size > 0 && (
                <li>
                  <div className="flex items-center gap-1.5 bg-teal-600/20 border border-teal-500/40 text-teal-400 rounded-full px-3 py-1" aria-label={`${savedIds.size} saved destinations`}>
                    <Bookmark size={12} aria-hidden="true" />
                    <span className="font-mono text-xs">{savedIds.size}</span>
                  </div>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main id="main" role="main">
        <ErrorBoundary>
          {/* Hero */}
          <Hero onDiscoverClick={scrollToDiscover} />

          {/* How it works */}
          <section id="how-it-works">
            <HowItWorks />
          </section>

          {/* Discover */}
          <section
            id="discover"
            ref={discoverRef}
            aria-labelledby="discover-heading"
            className="py-20 bg-ivory-300"
            style={{ scrollMarginTop: '56px' }}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <p className="section-label mb-3">Your journey begins here</p>
                <h2 id="discover-heading" className="font-fraunces text-4xl text-ink-800 mb-3">
                  Find your story
                </h2>
                <p className="font-work-sans text-ink-500 max-w-lg mx-auto text-balance">
                  Tell us what speaks to you. We'll match you with destinations that have real narratives, not travel brochures.
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-4">
                <SearchBar
                  onSearch={handleTextSearch}
                  placeholder="Search by city, country, or interest..."
                />
                <FilterForm onSearch={handleSearch} loading={loading} />
              </div>
            </div>
          </section>

          {/* Results */}
          {(results !== null || loading) && (
            <section
              id="results-section"
              aria-live="polite"
              aria-label="Search results"
              className="py-16 bg-ivory-200"
              style={{ scrollMarginTop: '56px' }}
            >
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <ResultsGrid
                  results={results ?? []}
                  loading={loading}
                  savedIds={savedIds}
                  onSave={r => toggleSave(r.destination)}
                  onShare={setShareTarget}
                  onReset={handleReset}
                />
              </div>
            </section>
          )}

          {/* About */}
          <section id="about" aria-labelledby="about-heading" className="py-20 bg-ivory-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <p className="section-label mb-3">Why Wanderlore</p>
                  <h2 id="about-heading" className="font-fraunces text-4xl text-ink-800 mb-5">
                    Culture isn't a<br />
                    <span className="italic text-teal-600">product to consume.</span>
                  </h2>
                  <p className="font-work-sans text-ink-500 leading-relaxed mb-4">
                    Most travel recommendations optimize for convenience. We optimize for meaning.
                    Every destination in Wanderlore was chosen because it has a real story —
                    one that connects to the people who built it and the communities still living it.
                  </p>
                  <p className="font-work-sans text-ink-500 leading-relaxed mb-6">
                    When you select "authentic experience," our recommendation logic actively
                    prioritizes small businesses, family artisans, and hidden places over
                    chain-adjacent landmarks. Our <strong>City Speaks</strong> feature uses Gemini AI
                    to generate immersive cultural intelligence — hidden secrets, living traditions,
                    and local legends — for every destination.
                  </p>
                  <div className="flex flex-col gap-3">
                    {[
                      'Gemini AI cultural storytelling',
                      'Local-first recommendation logic',
                      'Real-time search with debouncing',
                      'Smart caching — no repeat API calls',
                      'Input validation & XSS protection',
                    ].map(point => (
                      <div key={point} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-marigold-500 flex-shrink-0" aria-hidden="true" />
                        <span className="font-work-sans text-sm text-ink-600">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3" aria-hidden="true">
                  {[
                    'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=400',
                    'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=400',
                    'https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=400',
                    'https://images.pexels.com/photos/5490965/pexels-photo-5490965.jpeg?auto=compress&cs=tinysrgb&w=400',
                  ].map((src, i) => (
                    <div key={i} className={`rounded-xl overflow-hidden aspect-square ${i === 1 ? 'mt-6' : ''}`}>
                      <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </ErrorBoundary>
      </main>

      <Footer />

      {/* Share modal — lazy loaded */}
      {shareTarget && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-night-900/60" aria-hidden="true"><div className="flex items-center justify-center h-full"><SkeletonCard /></div></div>}>
          <ShareCard result={shareTarget} onClose={() => setShareTarget(null)} />
        </Suspense>
      )}
    </div>
  );
}
