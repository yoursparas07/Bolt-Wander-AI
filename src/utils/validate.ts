const MAX_SEARCH_LENGTH = 100;
const HTML_INJECTION_PATTERN = /<[^>]*>/;
const SCRIPT_PATTERN = /(<script|javascript:|on\w+\s*=)/i;

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized: string;
}

export function validateSearchInput(raw: string): ValidationResult {
  if (typeof raw !== 'string') {
    return { valid: false, error: 'Input must be a string', sanitized: '' };
  }

  const trimmed = raw.trim();

  if (trimmed.length === 0) {
    return { valid: true, sanitized: '' };
  }

  if (trimmed.length > MAX_SEARCH_LENGTH) {
    return {
      valid: false,
      error: `Search must be under ${MAX_SEARCH_LENGTH} characters`,
      sanitized: trimmed.slice(0, MAX_SEARCH_LENGTH),
    };
  }

  if (HTML_INJECTION_PATTERN.test(trimmed)) {
    return { valid: false, error: 'Invalid characters in search', sanitized: '' };
  }

  if (SCRIPT_PATTERN.test(trimmed)) {
    return { valid: false, error: 'Invalid characters in search', sanitized: '' };
  }

  return { valid: true, sanitized: trimmed };
}
