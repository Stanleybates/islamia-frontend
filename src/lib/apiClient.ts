// Minimal API adapter: talks to backend when VITE_USE_BACKEND=true, otherwise falls back to localStorage.
type AdminAccount = { username?: string; email: string; phone?: string; password: string; role: string; status: string; createdAt?: string };
type StudentAccount = { indexNumber: string; password: string; phone?: string; name?: string; regNumber?: string };

const useBackend = import.meta.env.VITE_USE_BACKEND === "true";
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
  const res = await fetch(apiUrl(path), {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.message || `Server error: ${res.status}`); }
  return res.json();
}

export const apiClient = {
  // Admin
  adminLogin: async (email: string, password: string) => {
    if (!useBackend) {
      throw new Error("Admin login requires backend authentication");
    }
    if (useBackend) {
      const res = await fetchJson(`/api/admin/login`, { email, password });
      // backend returns { message, token, user }
      if (res.token) {
  localStorage.setItem('ami_admin_session', JSON.stringify({ ...res.user, token: res.token }));
}
      return res;
    }
  },

  adminSignup: async (payload: { username?: string; email: string; phone?: string; password: string }) => {
    if (useBackend) return fetchJson(`/api/admin/signup`, { ...payload, phoneNumber: payload.phone, confirmPassword: payload.password });
    const admins: AdminAccount[] = JSON.parse(localStorage.getItem("ami_admin_accounts") || "[]");
    if (admins.find((a) => a.email === payload.email)) throw new Error("exists");
    const newAcc: AdminAccount = {
      username: payload.username,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      role: "sub",
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    admins.push(newAcc);
    localStorage.setItem("ami_admin_accounts", JSON.stringify(admins));
    return newAcc;
  },

  adminForgotByPhone: async (phone: string) => {
    if (useBackend) return fetchJson(`/api/admin/forgot`, { phone });
    const admins: AdminAccount[] = JSON.parse(localStorage.getItem("ami_admin_accounts") || "[]");
    const admin = admins.find((a) => a.phone === phone);
    if (!admin) throw new Error("not_found");
    if (admin.role === "sub") {
      const newPin = String(Math.floor(1000 + Math.random() * 9000));
      const idx = admins.findIndex((a) => a.email === admin.email);
      admins[idx].password = newPin;
      localStorage.setItem("ami_admin_accounts", JSON.stringify(admins));
      return { type: "sub", newPin };
    }
    return { type: "super" };
  },

  // Student
  studentLogin: async (indexNumber: string, password: string) => {
    if (useBackend) return fetchJson(`/api/student/login`, { indexNumber, password });
    const accounts: StudentAccount[] = JSON.parse(localStorage.getItem("ami_student_accounts") || "[]");
    const account = accounts.find((a) => a.indexNumber === indexNumber && a.password === password);
    if (!account) throw new Error("Invalid index number or password");
    localStorage.setItem("ami_student_session", JSON.stringify({ indexNumber: account.indexNumber, name: account.name, regNumber: account.regNumber }));
    return account;
  },

  studentSignup: async (payload: { indexNumber: string; phone: string; password: string }) => {
    if (useBackend) return fetchJson(`/api/student/signup`, payload);
    const accounts: StudentAccount[] = JSON.parse(localStorage.getItem("ami_student_accounts") || "[]");
    const existing = accounts.find((a) => a.indexNumber === payload.indexNumber);
    if (existing) {
      existing.phone = payload.phone.replace(/\s/g, "");
      if (existing.password !== payload.password) throw new Error("exists_password_mismatch");
      localStorage.setItem("ami_student_accounts", JSON.stringify(accounts));
      localStorage.setItem("ami_student_session", JSON.stringify({ indexNumber: existing.indexNumber, name: existing.name || "Student", regNumber: existing.regNumber }));
      return existing;
    }
    const acc = { indexNumber: payload.indexNumber, password: payload.password, phone: payload.phone.replace(/\s/g, ""), name: "Student", regNumber: payload.indexNumber };
    accounts.push(acc);
    localStorage.setItem("ami_student_accounts", JSON.stringify(accounts));
    localStorage.setItem("ami_student_session", JSON.stringify({ indexNumber: acc.indexNumber, name: acc.name, regNumber: acc.regNumber }));
    return acc;
  },

  studentForgotByPhone: async (phone: string) => {
    if (useBackend) return fetchJson(`/api/student/forgot`, { phone });
    const accounts: StudentAccount[] = JSON.parse(localStorage.getItem("ami_student_accounts") || "[]");
    const account = accounts.find((a) => a.phone === phone.replace(/\s/g, ""));
    if (!account) throw new Error("not_found");
    const code = String(Math.floor(1000 + Math.random() * 9000));
    account.password = code;
    localStorage.setItem("ami_student_accounts", JSON.stringify(accounts));
    return { code };
  },

  // Helper
  logoutAdmin: async () => {
    if (useBackend) await fetchJson(`/api/admin/logout`);
    localStorage.removeItem("ami_admin_session");
  },
  logoutStudent: async () => {
    if (useBackend) await fetchJson(`/api/student/logout`);
    localStorage.removeItem("ami_student_session");
  }
};

export default apiClient;
