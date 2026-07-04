import { useEffect, useRef } from 'react';
import { RecommendationResult } from '../types';
import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface Props {
  result: RecommendationResult;
  onClose: () => void;
}

export default function ShareCard({ result, onClose }: Props) {
  const { destination: d } = result;
  const dialogRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(d.shareCaption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard not available — graceful fallback
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-night-900/70 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Card */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden postcard-shadow animate-fade-up focus:outline-none"
        style={{ animationFillMode: 'both' }}
      >
        {/* Header image */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={d.image}
            alt={`${d.name} — culture share card`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night-900/90 via-night-900/30 to-transparent" />

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close share card"
            className="absolute top-3 right-3 w-8 h-8 bg-night-900/60 text-white rounded-full flex items-center justify-center hover:bg-night-900 transition-colors focus-visible:ring-2 focus-visible:ring-marigold-500"
          >
            <X size={16} aria-hidden="true" />
          </button>

          {/* Header text */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="font-mono text-xs text-marigold-300 tracking-widest uppercase mb-1">
              {d.location} · {d.country}
            </p>
            <h2 id="share-dialog-title" className="font-fraunces text-2xl text-white">
              {d.name}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Story blurb */}
          <div className="bg-ivory-200 rounded-xl p-4 border-l-4 border-marigold-500">
            <p className="font-mono text-xs text-marigold-700 mb-2 uppercase tracking-wider">Story blurb</p>
            <p className="font-fraunces italic text-ink-700 text-sm leading-relaxed">
              {d.storyBlurb}
            </p>
          </div>

          {/* Caption */}
          <div>
            <p className="section-label mb-2">Ready-to-post caption</p>
            <div className="bg-night-50 border border-night-200 rounded-xl p-4">
              <p className="text-sm text-ink-700 font-work-sans leading-relaxed whitespace-pre-line">
                {d.shareCaption}
              </p>
            </div>
          </div>

          {/* Local business callout */}
          {d.localBusiness && (
            <div className="flex items-start gap-3 bg-teal-50 border border-teal-200 rounded-xl p-3">
              <span className="text-xl mt-0.5" aria-hidden="true">🏪</span>
              <div>
                <p className="font-mono text-xs text-teal-700 uppercase tracking-wide">Support local</p>
                <p className="text-sm text-ink-700 font-600 mt-0.5">{d.localBusiness}</p>
                <p className="text-xs text-ink-500">{d.localBusinessType}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCopy}
              aria-live="polite"
              aria-label={copied ? 'Caption copied to clipboard' : 'Copy caption to clipboard'}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                font-work-sans text-sm font-600 transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-marigold-500
                ${copied
                  ? 'bg-teal-600 text-white'
                  : 'bg-marigold-500 text-night-900 hover:bg-marigold-600'}
              `}
            >
              {copied ? (
                <>
                  <Check size={14} aria-hidden="true" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={14} aria-hidden="true" />
                  Copy caption
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-ivory-300 text-ink-700 rounded-xl text-sm font-work-sans hover:bg-ivory-400 transition-colors focus-visible:ring-2 focus-visible:ring-marigold-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
