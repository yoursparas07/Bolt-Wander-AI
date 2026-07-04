import { useEffect, useRef } from 'react';
import { X, Sparkles, Eye, Utensils, Flame, Star, MapPin, AlertTriangle, Loader } from 'lucide-react';
import { CityLore } from '../services/gemini';
import { Destination } from '../types';

interface Props {
  destination: Destination;
  lore: CityLore | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  onClose: () => void;
  onRetry: () => void;
}

const LORE_SECTIONS: Array<{
  key: keyof CityLore;
  label: string;
  Icon: React.ComponentType<any>;
  color: string;
}> = [
  { key: 'opening', label: 'The city speaks', Icon: Sparkles, color: 'text-marigold-600' },
  { key: 'hiddenSecret', label: 'Hidden secret', Icon: Eye, color: 'text-teal-600' },
  { key: 'tradition', label: 'Living tradition', Icon: Flame, color: 'text-night-600' },
  { key: 'taste', label: 'Taste this', Icon: Utensils, color: 'text-marigold-700' },
  { key: 'etiquette', label: 'Show respect', Icon: Star, color: 'text-ink-500' },
  { key: 'legend', label: 'The legend', Icon: MapPin, color: 'text-teal-700' },
  { key: 'experience', label: 'Do this', Icon: Sparkles, color: 'text-night-700' },
];

export default function CityLoreModal({ destination: d, lore, status, error, onClose, onRetry }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lore-dialog-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div className="absolute inset-0 bg-night-900/75 backdrop-blur-sm" aria-hidden="true" onClick={onClose} />

      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full sm:max-w-2xl max-h-[90vh] bg-white sm:rounded-2xl overflow-hidden flex flex-col postcard-shadow animate-fade-up focus:outline-none"
        style={{ animationFillMode: 'both' }}
      >
        {/* Header */}
        <div className="relative h-40 flex-shrink-0 overflow-hidden">
          <img src={d.image} alt={d.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-night-900/95 via-night-900/50 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close City Lore"
            className="absolute top-3 right-3 w-8 h-8 bg-night-900/60 text-white rounded-full flex items-center justify-center hover:bg-night-900 transition-colors focus-visible:ring-2 focus-visible:ring-marigold-500"
          >
            <X size={16} aria-hidden="true" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="font-mono text-xs text-marigold-300 tracking-widest uppercase mb-1">
              {d.location} · {d.country}
            </p>
            <h2 id="lore-dialog-title" className="font-fraunces text-2xl text-white">
              {d.name}
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <Sparkles size={12} className="text-marigold-400" aria-hidden="true" />
              <span className="font-mono text-xs text-marigold-400 uppercase tracking-wider">
                AI Cultural Intelligence — Powered by Gemini
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-16 gap-4" aria-live="polite">
              <Loader size={28} className="text-marigold-500 animate-spin" aria-hidden="true" />
              <p className="font-fraunces italic text-ink-500 text-sm">
                The city is finding its voice...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4" role="alert">
              <AlertTriangle size={28} className="text-marigold-500" aria-hidden="true" />
              <p className="font-fraunces text-lg text-ink-700">The city is quiet right now.</p>
              <p className="font-work-sans text-sm text-ink-400 max-w-sm">{error}</p>
              <button
                type="button"
                onClick={onRetry}
                className="px-5 py-2.5 bg-night-800 text-ivory-100 rounded-xl text-sm font-work-sans font-600 hover:bg-night-700 transition-colors focus-visible:ring-2 focus-visible:ring-marigold-500"
              >
                Try again
              </button>
            </div>
          )}

          {status === 'success' && lore && (
            <div className="p-6 space-y-5">
              {LORE_SECTIONS.map(({ key, label, Icon, color }) => {
                const text = lore[key];
                if (!text) return null;
                const isOpening = key === 'opening';
                return (
                  <div key={key} className={isOpening ? 'bg-night-800 rounded-xl p-5' : 'border-b border-ivory-300 pb-5 last:border-0'}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={13} className={isOpening ? 'text-marigold-400' : color} aria-hidden="true" />
                      <span className={`font-mono text-xs uppercase tracking-wider ${isOpening ? 'text-marigold-400' : 'text-ink-400'}`}>
                        {label}
                      </span>
                    </div>
                    <p className={`font-fraunces leading-relaxed ${isOpening ? 'italic text-ivory-100 text-base' : 'text-ink-700 text-sm'}`}>
                      {text}
                    </p>
                  </div>
                );
              })}

              <p className="font-mono text-xs text-ink-300 text-center pt-2">
                Generated by Gemini AI · Not a substitute for local knowledge
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
