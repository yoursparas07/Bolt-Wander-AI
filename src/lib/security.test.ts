import { validateSearchInput } from '../utils/validate';
import { sanitizeAIOutput } from '../utils/sanitize';
import { TTLCache } from '../services/cache';

// ─── validateSearchInput ─────────────────────────────────────────────────────

describe('validateSearchInput', () => {
  test('empty string is valid with empty sanitized', () => {
    const result = validateSearchInput('');
    expect(result.valid).toBe(true);
    expect(result.sanitized).toBe('');
  });

  test('whitespace-only is valid with empty sanitized', () => {
    const result = validateSearchInput('   ');
    expect(result.valid).toBe(true);
    expect(result.sanitized).toBe('');
  });

  test('valid short query passes', () => {
    const result = validateSearchInput('Kyoto');
    expect(result.valid).toBe(true);
    expect(result.sanitized).toBe('Kyoto');
  });

  test('trims whitespace from valid query', () => {
    const result = validateSearchInput('  Istanbul  ');
    expect(result.valid).toBe(true);
    expect(result.sanitized).toBe('Istanbul');
  });

  test('rejects input over 100 characters', () => {
    const long = 'a'.repeat(101);
    const result = validateSearchInput(long);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('100');
  });

  test('rejects HTML injection', () => {
    expect(validateSearchInput('<script>alert(1)</script>').valid).toBe(false);
    expect(validateSearchInput('<img src=x>').valid).toBe(false);
  });

  test('rejects javascript: protocol', () => {
    expect(validateSearchInput('javascript:alert(1)').valid).toBe(false);
  });

  test('rejects event handler injection', () => {
    expect(validateSearchInput('onload=alert(1)').valid).toBe(false);
  });

  test('rejects non-string input', () => {
    // @ts-expect-error testing runtime guard
    const result = validateSearchInput(42);
    expect(result.valid).toBe(false);
  });
});

// ─── sanitizeAIOutput ────────────────────────────────────────────────────────

describe('sanitizeAIOutput', () => {
  test('strips HTML tags', () => {
    expect(sanitizeAIOutput('<b>bold</b> text')).toBe('bold text');
  });

  test('strips script tags', () => {
    expect(sanitizeAIOutput('<script>evil()</script>story')).toBe('story');
  });

  test('removes javascript: protocol leaving surrounding text', () => {
    expect(sanitizeAIOutput('click javascript:alert(1) here')).toBe('click alert(1) here');
  });

  test('truncates to 500 characters', () => {
    const long = 'x'.repeat(600);
    expect(sanitizeAIOutput(long).length).toBe(500);
  });

  test('handles non-string gracefully', () => {
    // @ts-expect-error testing runtime guard
    expect(sanitizeAIOutput(null)).toBe('');
    // @ts-expect-error testing runtime guard
    expect(sanitizeAIOutput(undefined)).toBe('');
  });

  test('trims leading/trailing whitespace', () => {
    expect(sanitizeAIOutput('  hello  ')).toBe('hello');
  });

  test('preserves clean text unchanged', () => {
    const clean = 'The dyers have worked here for centuries.';
    expect(sanitizeAIOutput(clean)).toBe(clean);
  });
});

// ─── TTLCache ────────────────────────────────────────────────────────────────

describe('TTLCache', () => {
  test('stores and retrieves a value', () => {
    const cache = new TTLCache<string>(60_000);
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
  });

  test('returns null for missing key', () => {
    const cache = new TTLCache<string>(60_000);
    expect(cache.get('missing')).toBeNull();
  });

  test('returns null after TTL expires', () => {
    const cache = new TTLCache<string>(1);
    cache.set('key', 'val');
    return new Promise<void>(resolve =>
      setTimeout(() => {
        expect(cache.get('key')).toBeNull();
        resolve();
      }, 10)
    );
  });

  test('has() reflects live entries', () => {
    const cache = new TTLCache<number>(60_000);
    cache.set('n', 42);
    expect(cache.has('n')).toBe(true);
    expect(cache.has('other')).toBe(false);
  });

  test('size() counts entries', () => {
    const cache = new TTLCache<string>(60_000);
    cache.set('a', '1');
    cache.set('b', '2');
    expect(cache.size()).toBe(2);
  });

  test('clear() empties the cache', () => {
    const cache = new TTLCache<string>(60_000);
    cache.set('x', 'y');
    cache.clear();
    expect(cache.size()).toBe(0);
    expect(cache.get('x')).toBeNull();
  });

  test('overwrites existing key', () => {
    const cache = new TTLCache<string>(60_000);
    cache.set('key', 'first');
    cache.set('key', 'second');
    expect(cache.get('key')).toBe('second');
  });
});
