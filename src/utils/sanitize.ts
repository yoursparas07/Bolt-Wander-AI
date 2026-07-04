const SCRIPT_BLOCK_PATTERN = /<script[\s\S]*?<\/script>/gi;
const HTML_TAG_PATTERN = /<[^>]*>/g;
const JAVASCRIPT_PROTOCOL = /javascript\s*:/gi;
const MAX_FIELD_LENGTH = 500;

export function sanitizeAIOutput(raw: string): string {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(SCRIPT_BLOCK_PATTERN, '')
    .replace(HTML_TAG_PATTERN, '')
    .replace(JAVASCRIPT_PROTOCOL, '')
    .trim()
    .slice(0, MAX_FIELD_LENGTH);
}
