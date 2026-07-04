import { Compass, Globe } from 'lucide-react';

interface Props {
  onDiscoverClick: () => void;
}

export default function Hero({ onDiscoverClick }: Props) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-screen flex flex-col items-center justify-center bg-night-800 overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grain opacity-60 pointer-events-none" aria-hidden="true" />

      {/* Decorative floating compass */}
      <div className="absolute top-12 right-12 text-night-600 animate-float opacity-30 hidden lg:block" aria-hidden="true">
        <Compass size={120} />
      </div>
      <div className="absolute bottom-24 left-8 text-night-600 animate-float opacity-20 hidden lg:block" style={{ animationDelay: '2s' }} aria-hidden="true">
        <Globe size={80} />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Logo mark */}
        <div className="flex items-center justify-center gap-3 mb-8" aria-hidden="true">
          <div className="w-12 h-px bg-marigold-500" />
          <span className="font-mono text-xs tracking-[0.3em] text-marigold-400 uppercase">Est. Every Journey</span>
          <div className="w-12 h-px bg-marigold-500" />
        </div>

        <h1
          id="hero-heading"
          className="font-fraunces text-6xl sm:text-7xl lg:text-8xl text-ivory-100 leading-tight mb-6"
        >
          Wander
          <span className="italic text-marigold-400">lore</span>
        </h1>

        <p className="font-fraunces italic text-xl sm:text-2xl text-night-300 mb-4 text-balance">
          Discover hidden gems. Hear their stories. Share the culture.
        </p>

        <p className="font-work-sans text-base text-night-400 max-w-xl mx-auto mb-10 leading-relaxed">
          An AI cultural storyteller that turns local discovery into shareable heritage journeys —
          prioritizing artisans, communities, and the places that don't advertise.
        </p>

        {/* CTA */}
        <button
          type="button"
          onClick={onDiscoverClick}
          className="
            inline-flex items-center gap-3 px-8 py-4
            bg-marigold-500 text-night-900 font-fraunces text-lg font-600
            rounded-2xl border-2 border-marigold-400 shadow-lg
            hover:bg-marigold-400 hover:shadow-marigold-500/20 hover:shadow-2xl hover:-translate-y-1
            transition-all duration-300 focus-visible:ring-2 focus-visible:ring-marigold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800
          "
        >
          <Compass size={20} aria-hidden="true" />
          Begin your journey
        </button>

        {/* Stats */}
        <div
          className="flex flex-wrap items-center justify-center gap-8 mt-16"
          role="list"
          aria-label="Platform statistics"
        >
          {[
            { value: '10', label: 'Hidden destinations' },
            { value: '4+', label: 'Cultural categories' },
            { value: '100%', label: 'Local-first logic' },
          ].map(({ value, label }) => (
            <div key={label} role="listitem" className="text-center">
              <p className="font-fraunces text-3xl text-marigold-400">{value}</p>
              <p className="font-mono text-xs text-night-400 uppercase tracking-wider mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2" aria-hidden="true">
        <div className="flex flex-col items-center gap-1 text-night-500 animate-bounce">
          <span className="font-mono text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-night-500 to-transparent" />
        </div>
      </div>
    </section>
  );
}
