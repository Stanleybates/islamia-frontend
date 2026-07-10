import { apiUrl } from './apiClient';

// Always fetch a fresh token. The backend issues a brand-new csrf_secret
// cookie on every call to /api/csrf-token, so caching the token in memory
// risks it going stale (e.g. another tab refreshing the shared cookie),
// causing "Invalid CSRF token" errors. Fetching fresh each time avoids that
// entire class of bug at the cost of one small extra request.
export const getCsrfToken = async (): Promise<string> => {
  try {
    const res = await fetch(apiUrl('/api/csrf-token'), { credentials: 'include' });
    const data = await res.json();
    return data.csrfToken || '';
  } catch(e) {
    console.error('CSRF token fetch failed:', e);
    return '';
  }
};

export const resetCsrfToken = () => {};
