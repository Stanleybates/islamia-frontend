import { getCsrfToken } from './csrf';

const RAW_BASE = import.meta.env.VITE_API_URL || "";

export function apiUrl(path: string) {
  if (!RAW_BASE) return path;
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (RAW_BASE === origin) return path;
  }
  return RAW_BASE + path;
}

async function fetchJson(path: string, body?: any) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (body) {
    const token = await getCsrfToken();
    if (token) headers['x-csrf-token'] = token;
  }
  const res = await fetch(apiUrl(path), {
    method: body ? "POST" : "GET",
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.message || `Server error: ${res.status}`); }
  return res.json();
}

export const apiClient = {
  // Admin
  adminLogin: async (email: string, password: string) => {
    const res = await fetchJson(`/api/admin/login`, { email, password });
    if (res.token) {
      localStorage.setItem('ami_admin_session', JSON.stringify({ ...res.user, token: res.token }));
    }
    return res;
  },

  adminSignup: async (payload: { username?: string; email: string; phone?: string; password: string }) => {
    return fetchJson(`/api/admin/signup`, { ...payload, phoneNumber: payload.phone, confirmPassword: payload.password });
  },

  adminForgotByPhone: async (phone: string) => {
    return fetchJson(`/api/admin/forgot`, { phone });
  },

  // Student
  studentLogin: async (indexNumber: string, password: string) => {
    return fetchJson(`/api/student/login`, { indexNumber, password });
  },

  studentSignup: async (payload: { indexNumber: string; phone: string; password: string }) => {
    return fetchJson(`/api/student/signup`, payload);
  },

  studentForgotByPhone: async (phone: string) => {
    return fetchJson(`/api/student/forgot`, { phone });
  },

  // Logout
  logoutAdmin: async () => {
    localStorage.removeItem("ami_admin_session");
  },

  logoutStudent: async () => {
    localStorage.removeItem("ami_student_session");
  }
};

export default apiClient;
