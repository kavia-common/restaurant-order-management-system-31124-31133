import { createClient } from '@supabase/supabase-js';
import { mockApi } from '../mock/mockApi';

const url = process.env.REACT_APP_SUPABASE_URL;
const key = process.env.REACT_APP_SUPABASE_KEY;

let client = null;
let mode = 'mock';

if (url && key) {
  try {
    client = createClient(url, key);
    mode = 'supabase';
  } catch (e) {
    // Fallback to mock
    // eslint-disable-next-line no-console
    console.warn('[Supabase] Failed to initialize, falling back to mock. Reason:', e.message);
    client = null;
    mode = 'mock';
  }
} else {
  // eslint-disable-next-line no-console
  console.warn('[Supabase] REACT_APP_SUPABASE_URL/KEY not set. Running in mock mode.');
}

// PUBLIC_INTERFACE
export function getDb() {
  /** Returns supabase client if configured, otherwise returns null. */
  return client;
}

// PUBLIC_INTERFACE
export function isMockMode() {
  /** Returns true when mock mode should be used. */
  return mode === 'mock';
}

// PUBLIC_INTERFACE
export function getMockApi() {
  /** Returns mock API accessor. */
  return mockApi;
}
