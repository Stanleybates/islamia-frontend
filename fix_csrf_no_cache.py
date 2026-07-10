path = 'src/lib/csrf.ts'

with open(path, 'r') as f:
    content = f.read()

old = """import { apiUrl } from './apiClient';

let csrfToken = '';

export const getCsrfToken = async (): Promise<string> => {
  if (csrfToken) return csrfToken;
  try {
    const res = await fetch(apiUrl('/api/csrf-token'), { credentials: 'include' });
    const data = await res.json();
    csrfToken = data.csrfToken;
    return csrfToken;
  }  catch(e) {
  console.error('CSRF token fetch failed:', e);
  alert('CSRF fetch error: ' + (e as Error).message);
  return '';
}
};

export const resetCsrfToken = () => { csrfToken = ''; };"""

new = """import { apiUrl } from './apiClient';

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

export const resetCsrfToken = () => {};"""

if new in content:
    print("Already patched, skipping")
elif old in content:
    content = content.replace(old, new, 1)
    with open(path, 'w') as f:
        f.write(content)
    print("Patched: removed CSRF token caching, always fetch fresh")
else:
    print("Pattern not found — check manually")
