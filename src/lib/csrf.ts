import { apiUrl } from './apiClient';

let csrfToken = '';

export const getCsrfToken = async (): Promise<string> => {
  if (csrfToken) return csrfToken;
  try {
    const res = await fetch(apiUrl('/api/csrf-token'), { credentials: 'include' });
    const data = await res.json();
    csrfToken = data.csrfToken;
    return csrfToken;
  } catch(e) {
    console.error('CSRF token fetch failed:', e);
    return '';
  }
};

export const resetCsrfToken = () => { csrfToken = ''; };
