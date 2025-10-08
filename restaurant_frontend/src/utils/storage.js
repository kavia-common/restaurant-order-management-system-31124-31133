function safeParse(s, fallback) {
  try { return JSON.parse(s); } catch { return fallback; }
}

// PUBLIC_INTERFACE
export const storage = {
  /** Get JSON value from localStorage */
  get(key, fallback = null) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw == null) return fallback;
      return safeParse(raw, fallback);
    } catch {
      return fallback;
    }
  },
  /** Set JSON value to localStorage */
  set(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  },
  /** Remove key */
  remove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
};
