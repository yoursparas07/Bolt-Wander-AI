import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { validateSearchInput } from '../utils/validate';

interface Props {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Search destinations...' }: Props) {
  const [raw, setRaw] = useState('');
  const [error, setError] = useState<string | null>(null);
  const debouncedRaw = useDebounce(raw, 400);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const result = validateSearchInput(debouncedRaw);
    if (!result.valid) {
      setError(result.error ?? null);
      return;
    }
    setError(null);
    onSearch(result.sanitized);
  }, [debouncedRaw, onSearch]);

  const clear = () => {
    setRaw('');
    setError(null);
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative" role="search">
      <label htmlFor="destination-search" className="sr-only">
        Search destinations by name, city, or country
      </label>

      <div className="relative flex items-center">
        <Search
          size={16}
          className="absolute left-4 text-ink-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id="destination-search"
          type="search"
          value={raw}
          onChange={e => setRaw(e.target.value)}
          placeholder={placeholder}
          maxLength={100}
          autoComplete="off"
          spellCheck="false"
          aria-invalid={!!error}
          aria-describedby={error ? 'search-error' : undefined}
          className={`
            w-full pl-10 pr-10 py-3 rounded-xl border-2 bg-white
            font-work-sans text-sm text-ink-800 placeholder:text-ink-400
            transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-marigold-500
            ${error ? 'border-red-400' : 'border-ivory-400 focus:border-teal-400'}
          `}
        />
        {raw && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="absolute right-3 w-6 h-6 flex items-center justify-center text-ink-400 hover:text-ink-700 transition-colors focus-visible:ring-2 focus-visible:ring-marigold-500 rounded"
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      {error && (
        <p id="search-error" role="alert" className="mt-1.5 text-xs text-red-500 font-work-sans">
          {error}
        </p>
      )}
    </div>
  );
}
