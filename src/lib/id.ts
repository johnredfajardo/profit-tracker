/**
 * Generate a reasonably unique id. Uses crypto.randomUUID when available,
 * falling back to a timestamp + random string for older runtimes.
 */
export function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
