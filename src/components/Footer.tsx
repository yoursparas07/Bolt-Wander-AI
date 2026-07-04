import { Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="bg-night-900 border-t border-night-700 py-10 px-4"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Compass size={18} className="text-marigold-400" aria-hidden="true" />
          <span className="font-fraunces text-lg text-ivory-200">Wanderlore</span>
        </div>

        <p className="font-work-sans text-xs text-night-400 text-center">
          Built to promote heritage, support local economies, and turn discovery into story.
        </p>

        <nav aria-label="Footer navigation">
          <ul className="flex gap-4" role="list">
            {['About', 'Discover', 'Share'].map(item => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="font-mono text-xs text-night-400 hover:text-marigold-400 transition-colors uppercase tracking-wider focus-visible:underline"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
