export function getSupabaseBaseUrl() {
  /**
   * Returns the configured Supabase base URL (from env) or empty string if not set.
   * Useful for debugging image URL composition.
   */
  return process.env.REACT_APP_SUPABASE_URL || '';
}

// PUBLIC_INTERFACE
export function isHttpsOrigin() {
  /** Returns true if the current page is served over HTTPS */
  try {
    return typeof window !== 'undefined' && window.location?.protocol === 'https:';
  } catch {
    return false;
  }
}
