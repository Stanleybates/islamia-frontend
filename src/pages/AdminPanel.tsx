import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import {
  Home, Users, BookOpen, CreditCard, Award, Settings,
  Plus, Search, Edit, Trash2, Eye, Download, X,
  GraduationCap, BarChart3, CheckCircle, XCircle, FileText,
  LogOut, EyeOff, Mail, Shield, Clock, Lock, Phone,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { validateEmail } from "@/lib/validation";
import logo from "@/assets/logo.png";
import adminBg from "@/assets/admin-bg.webp";
import { supabase } from "@/integrations/supabase/client";
import { apiUrl } from "@/lib/apiClient";

interface Student { id: string; name: string; email: string; semester: string; status: string; gpa: string; }
interface Course { id: string; title: string; semester: string; enrolled: number; status: string; }
interface Payment { id: string; student: string; amount: string; method: string; date: string; status: string; }
interface Grade { id: string; student: string; course: string; midterm: number; final: number; grade: string; status: "approved" | "pending"; enteredBy?: string; approvedBy?: string; enteredAt?: string; approvedAt?: string; }
interface Application { id: string; fullName: string; email: string; phone: string; semester: string; arabicLevel: string; status: string; date: string; motivation: string; country: string; gender: string; regNumber: string; whatsapp?: string; languages?: string; }

const initialStudents: Student[] = [
  { id: "STU001", name: "Ibrahim Abdullahi", email: "ibrahim@mail.com", semester: "Sem 1", status: "Active", gpa: "3.8" },
  { id: "STU002", name: "Fatimah Yusuf", email: "fatimah@mail.com", semester: "Sem 2", status: "Active", gpa: "3.5" },
  { id: "STU003", name: "Aisha Mohammed", email: "aisha@mail.com", semester: "Sem 1", status: "Active", gpa: "3.9" },
  { id: "STU004", name: "Umar Hassan", email: "umar@mail.com", semester: "Sem 3", status: "Inactive", gpa: "3.2" },
  { id: "STU005", name: "Khadijah Bello", email: "khadijah@mail.com", semester: "Sem 1", status: "Active", gpa: "3.7" },
];

const initialCourses: Course[] = [
  { id: "CRS001", title: "Arabic Language 1", semester: "Sem 1", enrolled: 150, status: "Active" },
  { id: "CRS002", title: "Expression & Communication 1", semester: "Sem 1", enrolled: 130, status: "Active" },
  { id: "CRS003", title: "Reading 2", semester: "Sem 2", enrolled: 95, status: "Active" },
  { id: "CRS004", title: "Qur'ān & Tajweed 1", semester: "Sem 3", enrolled: 110, status: "Upcoming" },
];

const initialPayments: Payment[] = [
  { id: "PAY001", student: "Ibrahim Abdullahi", amount: "GHS 500", method: "MTN MoMo", date: "2026-04-01", status: "Completed" },
  { id: "PAY002", student: "Fatimah Yusuf", amount: "GHS 500", method: "Ecobank", date: "2026-04-02", status: "Completed" },
  { id: "PAY003", student: "Aisha Mohammed", amount: "GHS 250", method: "MTN MoMo", date: "2026-04-03", status: "Pending" },
  { id: "PAY004", student: "Umar Hassan", amount: "GHS 500", method: "MTN MoMo", date: "2026-04-05", status: "Failed" },
];

const initialGrades: Grade[] = [
  { id: "GRD001", student: "Ibrahim Abdullahi", course: "Arabic Language 1", midterm: 85, final: 90, grade: "A", status: "approved", enteredBy: "system", enteredAt: new Date().toISOString(), approvedBy: "system", approvedAt: new Date().toISOString() },
  { id: "GRD002", student: "Fatimah Yusuf", course: "Arabic Language 1", midterm: 78, final: 82, grade: "B+", status: "approved", enteredBy: "system", enteredAt: new Date().toISOString(), approvedBy: "system", approvedAt: new Date().toISOString() },
  { id: "GRD003", student: "Aisha Mohammed", course: "Arabic Language 1", midterm: 92, final: 95, grade: "A+", status: "approved", enteredBy: "system", enteredAt: new Date().toISOString(), approvedBy: "system", approvedAt: new Date().toISOString() },
  { id: "GRD004", student: "Khadijah Bello", course: "Expression & Communication 1", midterm: 70, final: 75, grade: "B", status: "approved", enteredBy: "system", enteredAt: new Date().toISOString(), approvedBy: "system", approvedAt: new Date().toISOString() },
];

type Tab = "overview" | "students" | "courses" | "grades" | "payments" | "admissions" | "staff" | "admins" | "settings" | "fee" | "assessments";

const sidebarItems: { key: Tab; label: string; icon: any; superOnly?: boolean }[] = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "admissions", label: "Admissions", icon: FileText },
  { key: "students", label: "Students", icon: Users },
  { key: "courses", label: "Courses", icon: BookOpen },
  { key: "grades", label: "Grades & Results", icon: Award },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "staff", label: "Staff", icon: Users },
  { key: "admins", label: "Admin Approvals", icon: Shield, superOnly: true },
  { key: "assessments", label: "Assessments", icon: ClipboardList },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "fee", label: "Fee & Semester", icon: CreditCard, superOnly: true },
];

interface Staff { id: string; name: string; course: string; contact: string; email: string; department: string; }
const defaultStaff: Staff[] = [
  { id: "STF001", name: "Mustapha Abbass Bah", course: "Reading 1", contact: "+966547763984", email: "mabah9as@gmail.com", department: "Reading & Recitation" },
  { id: "STF002", name: "Ahmed Osama", course: "—", contact: "+233 55 054 5403", email: "—", department: "Administration" },
];

function calcGrade(midterm: number, final_: number): string {
  const avg = (midterm + final_) / 2;
  if (avg >= 90) return "A+";
  if (avg >= 85) return "A";
  if (avg >= 80) return "B+";
  if (avg >= 75) return "B";
  if (avg >= 70) return "C+";
  if (avg >= 60) return "C";
  if (avg >= 50) return "D";
  return "F";
}

const validateAdminPassword = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 8) errors.push("Password is too short");
  if (password.length > 12) errors.push("Password is too long");
  if (!/[a-zA-Z]/.test(password)) errors.push("Invalid password format");
  if (!/[0-9]/.test(password)) errors.push("Invalid password format");
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push("Invalid password format");
  return [...new Set(errors)];
};

const FeeSettingsTab = () => {
  const [semester, setSemester] = React.useState('');
  const [fee, setFee] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [notifying, setNotifying] = React.useState(false);
  const [msg, setMsg] = React.useState('');

  React.useEffect(() => {
    const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
    const token = s?.token;
    const headers: any = { Authorization: 'Bearer ' + token };
    // fetch settings
    fetch(apiUrl('/api/admin/settings'), { headers })
      .then(r => r.json())
      .then(d => { if (d.semester) setSemester(d.semester); if (d.fee) setFee(d.fee); })
      .catch(() => {});

  }, []);

  const save = async (notify = false) => {
    const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
    const token = s?.token;
    notify ? setNotifying(true) : setLoading(true);
    setMsg('');
    try {
      const endpoint = notify ? '/api/admin/settings/notify' : '/api/admin/settings';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ semester, fee: Number(fee) }),
      });
      const data = await res.json();
      setMsg(data.message);
    } catch (e) { setMsg(e.message); }
    finally { setLoading(false); setNotifying(false); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="font-heading text-lg font-bold text-foreground">Fee & Semester Settings</h2>
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        {msg && <div className="bg-primary/10 border border-primary/20 rounded p-2 text-xs text-primary">{msg}</div>}
        <div>
          <label className="text-sm font-medium block mb-1">Current Semester</label>
          <input value={semester} onChange={e => setSemester(e.target.value)} className="w-full px-3 py-2 border rounded text-sm" placeholder="e.g. Semester 1 2026" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Semester Fee (GHS)</label>
          <input type="number" value={fee} onChange={e => setFee(e.target.value)} className="w-full px-3 py-2 border rounded text-sm" placeholder="e.g. 500" />
        </div>
        <div className="flex gap-3">
          <Button onClick={() => save(false)} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          <Button variant="outline" onClick={() => save(true)} disabled={notifying}>{notifying ? 'Notifying...' : 'Save & Notify Students'}</Button>
        </div>
        <p className="text-xs text-muted-foreground">Save only updates the backend. Save & Notify sends SMS and email to all students and approved applicants.</p>
      </div>
    </div>
  );
};

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const handleChange = async () => {
    if (newPassword.length < 6) { setError('New password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true); setError(''); setSuccess('');
    try {
      const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
      const token = s?.token;
      const res = await fetch(apiUrl('/api/admin/change-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ currentPassword, password: newPassword }),
      });
      const data = await res.json();
      setSuccess('Password updated successfully!');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-3">
      {error && <div className="bg-destructive/10 border border-destructive/20 rounded p-2 text-xs text-destructive">{error}</div>}
      {success && <div className="bg-primary/10 border border-primary/20 rounded p-2 text-xs text-primary">{success}</div>}
      <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current password" className="w-full px-3 py-2 border rounded text-sm" />
      <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" className="w-full px-3 py-2 border rounded text-sm" />
      <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="w-full px-3 py-2 border rounded text-sm" />
      <Button onClick={handleChange} disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</Button>
    </div>
  );
};

const AdminPanel = () => {
  const useBackend = import.meta.env.VITE_USE_BACKEND === "true";
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("ami_admin_session"));
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPhone, setForgotPhone] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [lockMessage, setLockMessage] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [mfaStep, setMfaStep] = useState<"request" | "verify" | "reset">("request");
  const [mfaCode, setMfaCode] = useState("");
  const [generatedMfa, setGeneratedMfa] = useState("");
  const [mfaTimer, setMfaTimer] = useState(0);
  const [newAdminPw, setNewAdminPw] = useState("");
  const [confirmAdminPw, setConfirmAdminPw] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [paymentsState, setPaymentsState] = useState<Payment[]>(initialPayments);
  const [stats, setStats] = useState<any>(null);
  const [grades, setGrades] = useState<Grade[]>(initialGrades);
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [pendingGradeCount, setPendingGradeCount] = useState(0);
  const [showAddGrade, setShowAddGrade] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editingGrade, setEditingGrade] = useState<number | null>(null);
  const [viewingApp, setViewingApp] = useState<Application | null>(null);
  const [newStudent, setNewStudent] = useState({ name: "", email: "", semester: "Sem 1" });
  const [newGrade, setNewGrade] = useState({ student: "", course: "", midterm: "", final: "" });
  const [newCourse, setNewCourse] = useState({ title: "", semester: "Sem 1" });
  const [editGradeData, setEditGradeData] = useState({ midterm: "", final: "" });
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [settings, setSettings] = useState({ name: "", contactNumber: "", email: "" });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [staff, setStaff] = useState<Staff[]>(() => {
    const stored = localStorage.getItem("ami_staff");
    if (stored) try { return JSON.parse(stored); } catch {}
    localStorage.setItem("ami_staff", JSON.stringify(defaultStaff));
    return defaultStaff;
  });
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: "", course: "", contact: "", email: "", department: "" });
  const [adminAccounts, setAdminAccounts] = useState<any[]>([]);
  const [editingAdmin, setEditingAdmin] = useState<any | null>(null);
  const [editingRole, setEditingRole] = useState<string>("");
  const [editingAdminStatus, setEditingAdminStatus] = useState<string>("");
  const [dataLoading, setDataLoading] = useState(false);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [showAddAssessment, setShowAddAssessment] = useState(false);
  const [newAssessment, setNewAssessment] = useState({ title: "", course: "", type: "Assignment", posted: "", status: "Posted", weight: "" });

  const refreshAdminAccounts = () => {
    setAdminAccounts(JSON.parse(localStorage.getItem("ami_admin_accounts") || "[]"));
  };

  const loadDashboardData = async (retries = 2) => {
    if (retries === 0) { console.error('Dashboard load failed after retries'); return; }
    try { await loadDashboardDataInner(); } catch(e) { console.error('Retrying...', e); setTimeout(() => loadDashboardData(retries - 1), 2000); }
  };
  const loadDashboardDataInner = async () => {
    try {
      const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
      const token = s?.token;
      if (!token) return;
      const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
      const [gradesRes, adminsRes, paymentsRes, statsRes, studentsRes, coursesRes] = await Promise.all([
        fetch(apiUrl('/api/admin/grades'), { headers }).then(r => r.ok ? r.json() : null),
        fetch(apiUrl('/api/admin/admins'), { headers }).then(r => r.ok ? r.json() : null),
        fetch(apiUrl('/api/admin/payments'), { headers }).then(r => r.ok ? r.json() : null),
        fetch(apiUrl('/api/admin/stats'), { headers }).then(r => r.ok ? r.json() : null),
        fetch(apiUrl('/api/admin/students'), { headers }).then(r => r.ok ? r.json() : null),
        fetch(apiUrl('/api/admin/courses'), { headers }).then(r => r.ok ? r.json() : null),
      ]);
      if (gradesRes?.data) setGrades(gradesRes.data);
      else if (Array.isArray(gradesRes)) setGrades(gradesRes);
      if (adminsRes?.data || Array.isArray(adminsRes)) {
        const arr = adminsRes?.data || adminsRes;
        setAdminAccounts(arr.map((a) => ({ id: a.id, username: a.username, email: a.email, phone: a.phone || a.phone_number, role: a.role, status: a.status || (a.is_approved ? 'approved' : 'denied'), createdAt: a.created_at })));
      }
      if (paymentsRes?.data || Array.isArray(paymentsRes)) setPaymentsState(paymentsRes?.data || paymentsRes);
      if (studentsRes?.data) setStudents(studentsRes.data.map((s) => ({ id: String(s.id), name: s.username || s.email, email: s.email, semester: 'Sem 1', status: 'Active', gpa: '0.0' })));
      if (coursesRes?.data) setCourses(coursesRes.data.map((c) => ({ id: String(c.id), title: c.title, semester: c.semester, enrolled: c.enrolled || 0, status: c.status })));
      if (statsRes) {
        setStats(statsRes);
        setPendingGradeCount(Number(statsRes.pendingGrades ?? 0));
      }
    } catch (e) { throw e; }
  };

  useEffect(() => {
    refreshAdminAccounts();
    const session = localStorage.getItem("ami_admin_session");
    if (session) {
      try { const s = JSON.parse(session); setCurrentAdmin(s); setIsLoggedIn(true); } catch {}
    }

    if (useBackend) {
      loadDashboardData();
      const refreshInterval = setInterval(loadDashboardData, 30000);
      return () => clearInterval(refreshInterval);
    }
    if (false) {
      (async () => {
        try {
          setDataLoading(true);
          const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
          const token = s?.token;
          const headers: any = { 'Content-Type': 'application/json' };
          if (token) headers['Authorization'] = 'Bearer ' + token;

   const [gradesRes, adminsRes, paymentsRes, statsRes, studentsRes, coursesRes, settingsRes, assessmentsRes] = await Promise.all([
  fetch(apiUrl('/api/admin/grades'), { headers }).then(r => r.ok ? r.json() : []),
  fetch(apiUrl('/api/admin/admins'), { headers }).then(r => r.ok ? r.json() : []),
  fetch(apiUrl('/api/admin/payments'), { headers }).then(r => r.ok ? r.json() : []),
  fetch(apiUrl('/api/admin/stats'), { headers }).then(r => r.ok ? r.json() : {}),
  fetch(apiUrl('/api/admin/students'), { headers }).then(r => r.ok ? r.json() : []),
  fetch(apiUrl('/api/admin/courses'), { headers }).then(r => r.ok ? r.json() : []),
  fetch(apiUrl('/api/admin/settings'), { headers }).then(r => r.ok ? r.json() : {}),
  fetch(apiUrl('/api/admin/assessments'), { headers }).then(r => r.ok ? r.json() : { data: [] }),
]);

          if (gradesRes?.data) setGrades(gradesRes.data as any); else if (Array.isArray(gradesRes)) setGrades(gradesRes as any);
          if (adminsRes?.data || Array.isArray(adminsRes)) { const adminsArr = adminsRes?.data || adminsRes;
            // map backend admin rows to UI shape (status string)
            const mapped = (adminsArr as any[]).map(a => ({
              id: a.id,
              username: a.username,
              email: a.email,
              phone: a.phone || a.phone_number,
              role: a.role,
              status: a.status || (a.is_approved ? 'approved' : 'denied'),
              createdAt: a.created_at,
            }));
            setAdminAccounts(mapped as any);
          }
          if (paymentsRes?.data || Array.isArray(paymentsRes)) { const paymentsArr = paymentsRes?.data || paymentsRes;
            setPaymentsState(paymentsArr as any);
          }
         if (coursesRes?.data) {
  setCourses(coursesRes.data.map((c: any) => ({
    id: String(c.id),
    title: c.title,
    semester: c.semester,
    enrolled: c.enrolled || 0,
    status: c.status,
  })));
}
if (studentsRes?.data) {
  const mapped = studentsRes.data.map((s: any) => ({
    id: String(s.id),
    name: s.username || s.email,
    email: s.email,
    semester: 'Sem 1',
    status: 'Active',
    gpa: '0.0',
  }));
  setStudents(mapped);
}
          if (statsRes) {
            setStats(statsRes);
            setPendingGradeCount(Number((statsRes.pendingGrades || statsRes.pendingGrades) ?? 0));
            const messages = [];
            if (statsRes.pendingAdmins > 0) messages.push(`${statsRes.pendingAdmins} pending admin approval${statsRes.pendingAdmins > 1 ? 's' : ''}`);
            if (statsRes.pendingGrades > 0) messages.push(`${statsRes.pendingGrades} pending grade approval${statsRes.pendingGrades > 1 ? 's' : ''}`);
            if (statsRes.pendingAdmissions > 0) messages.push(`${statsRes.pendingAdmissions} pending admission${statsRes.pendingAdmissions > 1 ? 's' : ''}`);
            if (statsRes.pendingPayments > 0) messages.push(`${statsRes.pendingPayments} pending payment${statsRes.pendingPayments > 1 ? 's' : ''}`);
            if (!sessionStorage.getItem('ami_welcomed')) {
              sessionStorage.setItem('ami_welcomed', '1');
              if (messages.length > 0) {
                setTimeout(() => toast("Welcome back! You have: " + messages.join(", ") + "."), 500);
              } else {
                setTimeout(() => toast.success('Welcome back! Everything is up to date.'), 500);
              }
            }
          }
          if (settingsRes?.name) {
  setSettings({ name: settingsRes.name, contactNumber: settingsRes.contact_number, email: settingsRes.email });
}
          if (assessmentsRes?.data) setAssessments(assessmentsRes.data);
        } catch (e) {
          console.error(e);
        } finally {
          setDataLoading(false);
        }
      })();
      return;
    }

    const storedGrades = localStorage.getItem("ami_grades");
    if (storedGrades) {
      try { setGrades(JSON.parse(storedGrades)); } catch {}
    }
  }, [isLoggedIn]);


  const isSuperAdmin = currentAdmin?.role === "super";

  useEffect(() => {
    const session = localStorage.getItem("ami_admin_session");
    if (session) setIsLoggedIn(true);
    checkLockout();
  }, []);

  useEffect(() => {
    if (!useBackend) {
      localStorage.setItem("ami_grades", JSON.stringify(grades));
    }
    setPendingGradeCount(grades.filter((g) => g.status === "pending").length);
  }, [grades]);

  useEffect(() => {
    if (mfaTimer <= 0) return;
    const interval = setInterval(() => {
      setMfaTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          if (mfaStep === "verify") {
            toast.error("MFA code expired. Please request a new one.");
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [mfaTimer, mfaStep]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const loadApplications = async () => {
      try {
        const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
        const token = s?.token;
        const headers = { 'Content-Type': 'application/json', ...(token ? { 'Authorization': 'Bearer ' + token } : {}) };
       const res = await fetch(apiUrl('/api/admin/applications'), { headers });
        const json = await res.json();
        const fromBackend = (json.data ?? []).map((r) => ({
          id: 'APP-' + String(r.id).padStart(4, '0'),
          fullName: r.full_name,
          email: r.email,
          phone: r.phone,
          semester: r.semester ?? '',
          arabicLevel: r.arabic_level ?? '',
          status: r.status ?? 'Pending',
          date: (r.created_at ?? '').split('T')[0],
          motivation: r.motivation ?? '',
          country: r.country ?? '',
          gender: r.gender ?? '',
          regNumber: r.reg_number ?? '',
          whatsapp: r.whatsapp ?? '',
          languages: r.languages ?? '',
        }));
        setApplications(fromBackend);
      } catch (e) {
        console.error(e);
        const localApps = JSON.parse(localStorage.getItem("ami_applications") || "[]");
        setApplications(localApps);
      }
    };

    loadApplications();
    const interval = setInterval(loadApplications, 5000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const checkLockout = () => {
    const lockData = JSON.parse(localStorage.getItem("ami_admin_lockout") || "{}");
    const today = new Date().toDateString();
    if (lockData.date === today && lockData.locked) {
      setIsLocked(true);
      setLockMessage("Account is locked due to too many failed attempts. Try again tomorrow.");
    }
  };

  const recordFailedAttempt = () => {
    const today = new Date().toDateString();
    const lockData = JSON.parse(localStorage.getItem("ami_admin_lockout") || "{}");
    if (lockData.date !== today) {
      lockData.date = today;
      lockData.attempts = 0;
      lockData.locked = false;
    }
    lockData.attempts = (lockData.attempts || 0) + 1;
    if (lockData.attempts >= 2) {
      lockData.locked = true;
      setIsLocked(true);
      setLockMessage("Account locked due to too many failed attempts. Try again tomorrow.");
    }
    localStorage.setItem("ami_admin_lockout", JSON.stringify(lockData));
  };



  // Backend action helpers
  const getAuthHeader = () => {
    try {
      const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
      const token = s?.token; return token ? { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
    } catch { return { 'Content-Type': 'application/json' }; }
  };

  const approveGradeBackend = async (gradeId: any) => {
    try {
      const headers = getAuthHeader();
      const res = await fetch(apiUrl('/api/admin/grades/approve/' + gradeId), { method: 'PUT', headers });
      if (!res.ok) throw new Error('Failed');
      const updated = await res.json();
      setGrades((g) => g.map(x => x.id === updated.id ? updated : x));
      toast.success('Grade approved');
    } catch (e) { toast.error('Could not approve grade'); }
  };

  const deleteGradeBackend = async (gradeId: any) => {
    try {
      const headers = getAuthHeader();
      const res = await fetch(apiUrl('/api/admin/grades/' + gradeId), { method: 'DELETE', headers });
      if (!res.ok) throw new Error('Failed');
      setGrades((g) => g.filter(x => x.id !== gradeId));
      toast.success('Grade deleted');
    } catch (e) { toast.error('Could not delete grade'); }
  };
 const saveSettings = async () => {
  setSettingsSaving(true);
  try {
    const res = await fetch(apiUrl('/api/admin/settings'), { method: 'PUT', headers: getAuthHeader(), body: JSON.stringify(settings) });
    if (res.ok) toast.success('Settings saved successfully');
    else toast.error('Failed to save settings');
  } catch { toast.error('Failed to save settings'); }
  setSettingsSaving(false);
};

const exportData = async (type: string) => {
  const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
  const token = s?.token;
  const res = await fetch(`/api/admin/export?type=${type}`, { headers: token ? { Authorization: 'Bearer ' + token } : {} });
  if (res.ok) {
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${type}.csv`; a.click();
    URL.revokeObjectURL(url);
  } else toast.error('Export failed');
};
  const approveAdminBackend = async (userId: any) => {
    try {
      const headers = getAuthHeader();
      const res = await fetch(apiUrl('/api/admin/admins/approve/' + userId), { method: 'PUT', headers });
      if (!res.ok) throw new Error('Failed');
      const updated = await res.json();
      setAdminAccounts((a) => a.map(x => x.id === updated.id ? updated : x));
      toast.success('Admin approved');
    } catch (e) { toast.error('Could not approve admin'); }
  };

  const deleteAdminBackend = async (userId: any) => {
    try {
      const headers = getAuthHeader();
      const res = await fetch(apiUrl('/api/admin/admins/' + userId), { method: 'DELETE', headers });
      if (!res.ok) throw new Error('Failed');
      setAdminAccounts((a) => a.filter(x => x.id !== userId));
      toast.success('Admin deleted');
    } catch (e) { toast.error('Could not delete admin'); }
  };

  const denyAdminBackend = async (userId: any) => {
    try {
      const headers = getAuthHeader();
      const res = await fetch(apiUrl('/api/admin/admins/deny/' + userId), { method: 'PUT', headers });
      if (!res.ok) throw new Error('Failed');
      const updated = await res.json();
      setAdminAccounts((a) => a.map(x => x.id === updated.id ? { ...x, status: updated.status } : x));
      toast.success('Admin denied');
    } catch (e) { toast.error('Could not deny admin'); }
  };

  const updateAdminBackend = async (userId: any, role?: string, admin_status?: string) => {
    try {
      const headers = getAuthHeader();
      const res = await fetch(apiUrl('/api/admin/admins/' + userId), {
        method: 'PUT',
        headers,
        body: JSON.stringify({ role, admin_status }),
      });
      if (!res.ok) throw new Error('Failed');
      const updated = await res.json();
      setAdminAccounts((a) => a.map(x => x.id === updated.id ? { ...x, status: updated.status, role: updated.role } : x));
      toast.success('Admin updated');
      return updated;
    } catch (e) { toast.error('Could not update admin'); throw e; }
  };


  const handleLogout = () => {
    localStorage.removeItem("ami_admin_session");
    sessionStorage.removeItem('ami_welcomed');
    toast.success("You've been logged out. See you soon!");
    setTimeout(() => setIsLoggedIn(false), 800);
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email) return;
    const id = `STU${String(students.length + 1).padStart(3, "0")}`;
    setStudents([...students, { ...newStudent, id, status: "Active", gpa: "0.0" }]);
    setNewStudent({ name: "", email: "", semester: "Sem 1" });
    setShowAddStudent(false);
    toast.success(`Student "${newStudent.name}" added successfully!`);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter((s) => s.id !== id));
    toast.success("Student removed successfully.");
  };

  const handleAddGrade = () => {
    if (!newGrade.student || !newGrade.course || !newGrade.midterm || !newGrade.final) return;
    const midterm = Number(newGrade.midterm);
    const final_ = Number(newGrade.final);
    const grade = calcGrade(midterm, final_);
    const status = currentAdmin?.role === "super" ? "approved" : "pending";
    const id = `GRD${String(grades.length + 1).padStart(3, "0")}`;
    const entry = {
      id,
      student: newGrade.student,
      course: newGrade.course,
      midterm,
      final: final_,
      grade,
      status,
      enteredBy: currentAdmin?.username || "Unknown",
      enteredAt: new Date().toISOString(),
      approvedBy: status === "approved" ? currentAdmin?.username || "system" : undefined,
      approvedAt: status === "approved" ? new Date().toISOString() : undefined,
    } as Grade;
    setGrades([...grades, entry]);
    setNewGrade({ student: "", course: "", midterm: "", final: "" });
    setShowAddGrade(false);
    toast.success(`Grade ${status === "approved" ? "recorded" : "submitted for approval"} for ${newGrade.student} — ${grade}`);
  };

  const handleUpdateGrade = (idx: number) => {
    const midterm = Number(editGradeData.midterm);
    const final_ = Number(editGradeData.final);
    const grade = calcGrade(midterm, final_);
    const updated = [...grades];
    updated[idx] = {
      ...updated[idx],
      midterm,
      final: final_,
      grade,
      status: currentAdmin?.role === "super" ? "approved" : updated[idx].status,
      approvedBy: currentAdmin?.role === "super" ? currentAdmin?.username || updated[idx].approvedBy : updated[idx].approvedBy,
      approvedAt: currentAdmin?.role === "super" ? new Date().toISOString() : updated[idx].approvedAt,
    };
    setGrades(updated);
    setEditingGrade(null);
    toast.success("Grade updated successfully!");
  };

  const handleApproveGrade = (gradeId: string) => {
    const updated = grades.map((grade) =>
      grade.id === gradeId ? {
        ...grade,
        status: "approved",
        approvedBy: currentAdmin?.username || "Unknown",
        approvedAt: new Date().toISOString(),
      } : grade
    );
    setGrades(updated);
    toast.success("Grade approved and released to the student portal.");
  };

  const handleAddCourse = async () => {
    if (!newCourse.title) return;
    try {
      const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
      const token = s?.token;
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(apiUrl('/api/admin/courses'), { method: 'POST', headers, body: JSON.stringify({ title: newCourse.title, semester: newCourse.semester, status: 'Upcoming' }) });
      const created = await res.json();
      setCourses(prev => [...prev, { id: String(created.id), title: created.title, semester: created.semester, enrolled: created.enrolled || 0, status: created.status }]);
    } catch (e: any) { toast.error(e.message); }
    setNewCourse({ title: "", semester: "Sem 1" });
    setShowAddCourse(false);
    toast.success(`Course "${newCourse.title}" added!`);
  };

  const handleAdmissionAction = async (appId: string, action: "Accepted" | "Declined") => {
    const app = applications.find(a => a.id === appId);
    const dbId = appId.replace('APP-', '');
    const status = action === 'Accepted' ? 'Approved' : 'Denied';

    if (useBackend) {
      try {
        const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
        const token = s?.token;
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // Update application status first
        const res = await fetch(apiUrl('/api/admin/applications/' + parseInt(dbId)), {
          method: 'PUT', headers,
          body: JSON.stringify({ status }),
        });
        if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Failed to update'); }
        setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
        toast.success(`Application ${appId} ${action.toLowerCase()}. Notification sent to ${app?.fullName}.`);

        // If approved, automatically confirm payment (backend will verify Paystack or mark manual)
        if (status === 'Approved') {
          try {
            const res2 = await fetch(apiUrl('/api/admin/applications/' + parseInt(dbId) + '/confirm'), {
              method: 'PUT', headers,
              body: JSON.stringify({ manual: true }),
            });
            const d2 = await res2.json();
            if (!res2.ok) throw new Error(d2.message || 'Payment confirm failed');
            // update application entry from server response if provided
            if (d2.application) setApplications(prev => prev.map(a => a.id === appId ? d2.application : a));
            toast.success(d2.message || 'Payment confirmed and student enrolled.');
            await loadDashboardData();
          } catch (e: any) {
            toast.error(e.message || 'Auto-confirm payment failed');
          }
        }
      } catch (e: any) { toast.error(e.message); }
      return;
    }

    // Local/offline mode: update app locally and mark enrolled when accepted
    const updated = applications.map((a) => a.id === appId ? { ...a, status: action === 'Accepted' ? 'Enrolled' : action } : a);
    setApplications(updated);
    localStorage.setItem("ami_applications", JSON.stringify(updated));
    toast.success(`Application ${appId} ${action.toLowerCase()}.`);
  };

  const handleConfirmPayment = async (appId: string) => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return;

    if (useBackend) {
      try {
        const reference = window.prompt('Enter Paystack transaction reference for this payment, or leave blank for manual confirmation:');
        const dbId = parseInt(appId.replace('APP-', ''), 10);
        const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
        const token = s?.token;
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const body: any = {};
        if (reference?.trim()) {
          body.reference = reference.trim();
        } else {
          body.manual = true;
        }

        const res = await fetch(apiUrl('/api/admin/applications/' + dbId + '/confirm'), {
          method: 'PUT', headers,
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to confirm payment');

        const updatedApp = data.application;
        setApplications((prev) => prev.map((a) => a.id === appId ? {
          ...a,
          status: updatedApp.status || 'Enrolled',
          regNumber: updatedApp.reg_number || a.regNumber,
        } : a));

        await loadDashboardData();
        toast.success(`Payment confirmed and recorded for ${app.fullName}.`);
      } catch (e: any) {
        toast.error(e.message || 'Failed to confirm payment');
      }
      return;
    }

    const year = new Date().getFullYear().toString().slice(-2);
    const paidApps = applications.filter((a) => a.regNumber && a.regNumber.startsWith("AMI/"));
    const nextPosition = paidApps.length + 1;
    const regNumber = `AMI/${year}/${String(nextPosition).padStart(3, "0")}`;
    const updated = applications.map((a) => a.id === appId ? { ...a, status: "Enrolled", regNumber } : a);
    setApplications(updated);
    localStorage.setItem("ami_applications", JSON.stringify(updated));
    if (app) {
      const pin = String(Math.floor(1000 + Math.random() * 9000));
      const accounts = JSON.parse(localStorage.getItem("ami_student_accounts") || "[]");
      accounts.push({ indexNumber: regNumber, regNumber, password: pin, name: app.fullName, email: app.email });
      localStorage.setItem("ami_student_accounts", JSON.stringify(accounts));
      const notifications = JSON.parse(localStorage.getItem("ami_notifications") || "[]");
      notifications.push({
        id: Date.now(), appId, email: app.email, fullName: app.fullName,
        message: `Payment confirmed! Your index number is ${regNumber} and your password is ${pin}. You can now log in to the Student Portal. Welcome to Allāhul Musta'ān Institute!`,
        status: "Enrolled", date: new Date().toISOString(), read: false,
      });
      localStorage.setItem("ami_notifications", JSON.stringify(notifications));
    }
    toast.success(`Payment confirmed! Registration number ${regNumber} assigned.`);
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingApps = applications.filter((a) => a.status === "Pending");
  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none";
  const glassInputClass = "w-full px-4 py-2.5 rounded-lg border border-white/20 bg-white/10 text-white text-sm placeholder:text-white/50 focus:ring-2 focus:ring-white/30 focus:border-white/40 outline-none backdrop-blur-sm";

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform lg:translate-x-0 lg:static flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 shadow-lg backdrop-blur-md">
              <img src={logo} alt="Logo" className="h-8 w-auto" />
            </div>
            <div>
              <p className="font-heading text-sm font-bold text-primary">Admin Panel</p>
              <p className="text-xs text-muted-foreground">AMI Management</p>
            </div>
          </div>
        </div>
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {sidebarItems.filter(i => !i.superOnly || isSuperAdmin).map((item) => {
            const pendingAdminCount = adminAccounts.filter((a: any) => a.status === "pending").length;
            return (
            <button
              key={item.key}
              onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }} style={{transition: "transform 0.15s, filter 0.15s"}} onMouseDown={e => e.currentTarget.style.transform="scale(0.95)"} onMouseUp={e => e.currentTarget.style.transform=""} onMouseLeave={e => e.currentTarget.style.transform=""}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all relative ${
                activeTab === item.key ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon size={18} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.key === "admissions" && pendingApps.length > 0 && (
                <span className="bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {pendingApps.length}
                </span>
              )}
              {item.key === "admins" && pendingAdminCount > 0 && (
                <span className="bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {pendingAdminCount}
                </span>
              )}
            </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border space-y-1 flex-shrink-0">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors">
            <Home size={16} />Back to Website
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors w-full">
            <LogOut size={16} />Logout
          </button>
        </div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-card border-b border-border h-16 flex items-center px-4 sm:px-6 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 mr-3 text-foreground hover:text-primary">
            <BarChart3 size={20} />
          </button>
          <h1 className="font-heading text-lg font-bold text-foreground capitalize">{activeTab}</h1>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {dataLoading && (
            <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-primary/20">
              <div className="h-full bg-primary animate-pulse w-full" />
            </div>
          )}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Students", value: String(stats?.totalStudents ?? students.length), icon: Users, color: "bg-primary/10 text-primary", onClick: () => setActiveTab('students') },
                  { label: "Active Courses", value: String(courses.length), icon: BookOpen, color: "bg-accent/10 text-accent", onClick: () => setActiveTab('courses') },
                  { label: "Pending Admissions", value: String(pendingApps.length), icon: FileText, color: "bg-destructive/10 text-destructive", onClick: () => setActiveTab('admissions') },
                  { label: "Total Payments (GHS)", value: String(stats?.approvedPaymentsSum ?? '0'), icon: CreditCard, color: "bg-primary/10 text-primary", onClick: () => setActiveTab('payments') },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card rounded-xl border border-border p-5 cursor-pointer hover:shadow-md transition-all active:scale-95 active:brightness-90" onClick={stat.onClick}>
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${stat.color}`}>
                        <stat.icon size={22} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Data Analytics Table */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">📊 Data Analytics Overview</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Metric</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Current</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Previous</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Change</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { metric: "Total Enrollments", current: students.length, previous: Math.max(students.length - 2, 0), status: "up" },
                        { metric: "Active Courses", current: courses.filter(c => c.status === "Active").length, previous: Math.max(courses.filter(c => c.status === "Active").length - 1, 0), status: "up" },
                        { metric: "Pending Applications", current: pendingApps.length, previous: Math.max(pendingApps.length + 1, 1), status: pendingApps.length > 0 ? "warning" : "up" },
                        { metric: "Completed Payments", current: (useBackend ? paymentsState : paymentsState).filter(p => p.status === "Completed").length, previous: Math.max((useBackend ? paymentsState : paymentsState).filter(p => p.status === "Completed").length - 1, 0), status: "up" },
                        { metric: "Failed Payments", current: (useBackend ? paymentsState : paymentsState).filter(p => p.status === "Failed").length, previous: 2, status: (useBackend ? paymentsState : paymentsState).filter(p => p.status === "Failed").length > 0 ? "down" : "up" },
                        { metric: "Average GPA", current: Number((students.reduce((a, s) => a + parseFloat(s.gpa), 0) / Math.max(students.length, 1)).toFixed(2)), previous: 3.5, status: "up" },
                        { metric: "Graduation Rate", current: 89, previous: 85, status: "up" },
                        { metric: "Student Retention", current: Math.round((students.filter(s => s.status === "Active").length / Math.max(students.length, 1)) * 100), previous: 75, status: "up" },
                      ].map((row) => {
                        const change = typeof row.current === "number" && typeof row.previous === "number"
                          ? ((row.current - row.previous) / Math.max(row.previous, 1) * 100).toFixed(1)
                          : "0";
                        const isPositive = Number(change) >= 0;
                        return (
                          <tr key={row.metric} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4 font-medium text-foreground">{row.metric}</td>
                            <td className="py-3 px-4 font-bold text-foreground">{typeof row.current === "number" && row.metric.includes("Rate") || row.metric.includes("Retention") ? `${row.current}%` : row.current}</td>
                            <td className="py-3 px-4 text-muted-foreground">{typeof row.previous === "number" && row.metric.includes("Rate") || row.metric.includes("Retention") ? `${row.previous}%` : row.previous}</td>
                            <td className={`py-3 px-4 font-semibold ${isPositive ? "text-primary" : "text-destructive"}`}>
                              {isPositive ? "↑" : "↓"} {Math.abs(Number(change))}%
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                                row.status === "up" ? "bg-primary/10 text-primary" : row.status === "warning" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
                              }`}>
                                {row.status === "up" ? "✓ Good" : row.status === "warning" ? "⚠ Attention" : "↓ Decline"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Recent Students</h3>
                  <div className="space-y-3">
                    {students.slice(0, 4).map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">{s.name.charAt(0)}</div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{s.name}</p>
                            <p className="text-xs text-muted-foreground">{s.semester}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.status === "Active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{s.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Recent Payments</h3>
                  <div className="space-y-3">
                    {(useBackend ? paymentsState : paymentsState).slice(0, 6).map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="text-sm font-medium text-foreground">{p.student || p.user_name || p.user}</p>
                          <p className="text-xs text-muted-foreground">{p.method || p.payment_method || '—'} · {(p.created_at || p.date || '').split('T')[0]}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">{typeof p.amount === 'number' ? `GHS ${p.amount}` : p.amount}</p>
                          <span className={`text-xs font-medium ${p.status === "Completed" || p.status === 'approved' ? "text-primary" : p.status === "Pending" || p.status === 'pending' ? "text-accent" : "text-destructive"}`}>{p.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "admissions" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-foreground">Admission Applications</h2>
                <span className="text-sm text-muted-foreground">{applications.length} total · {pendingApps.length} pending</span>
              </div>
              {applications.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                  <FileText size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">No applications received yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div key={app.id} className="bg-card rounded-xl border border-border p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {app.fullName?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{app.fullName} {app.regNumber && <span className="text-xs font-bold text-primary ml-2">{app.regNumber}</span>}</p>
                            <p className="text-xs text-muted-foreground">{app.email} · {app.phone}</p>
                            <p className="text-xs text-muted-foreground">{app.semester} · {app.arabicLevel} · {app.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            app.status === "Pending" ? "bg-accent/10 text-accent" :
                            app.status === "Approved" ? "bg-yellow-500/10 text-yellow-600" :
                            app.status === "Enrolled" ? "bg-primary/10 text-primary" :
                            "bg-destructive/10 text-destructive"
                          }`}>{app.status === "Approved" ? "Awaiting Payment" : app.status}</span>
                          <button onClick={() => setViewingApp(app)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary">
                            <Eye size={16} />
                          </button>
                          {app.status === "Pending" && isSuperAdmin && (
                            <>
                              <Button size="sm" variant="default" className="gap-1" onClick={() => handleAdmissionAction(app.id, "Accepted")}>
                                <CheckCircle size={14} /> Accept
                              </Button>
                              <Button size="sm" variant="destructive" className="gap-1" onClick={() => handleAdmissionAction(app.id, "Declined")}>
                                <XCircle size={14} /> Decline
                              </Button>
                            </>
                          )}
                          {app.status === "Approved" && isSuperAdmin && (
                            <Button size="sm" variant="default" className="gap-1" onClick={() => handleConfirmPayment(app.id)}>
                              <CreditCard size={14} /> Confirm Payment
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {viewingApp && (
                <div className="fixed inset-0 bg-foreground/30 z-50 flex items-center justify-center p-4" onClick={() => setViewingApp(null)}>
                  <div className="bg-card rounded-2xl border border-border p-6 max-w-lg w-full shadow-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading text-lg font-bold text-foreground">Application Details</h3>
                      <button onClick={() => setViewingApp(null)} className="p-1 hover:bg-muted rounded-lg"><X size={18} /></button>
                    </div>
                    <div className="space-y-3 text-sm">
                      {[
                        ["Full Name", viewingApp.fullName],
                        ["Email", viewingApp.email],
                        ["Phone", viewingApp.phone],
                        ["WhatsApp", viewingApp.whatsapp || "—"],
                        ["Country", viewingApp.country],
                        ["Gender", viewingApp.gender],
                        ["Languages", viewingApp.languages || "—"],
                        ["Semester", viewingApp.semester],
                        ["Arabic Level", viewingApp.arabicLevel],
                        ["Status", viewingApp.status],
                        ["Reg. Number", viewingApp.regNumber || "Not assigned"],
                        ["Date", viewingApp.date],
                        ["Motivation", viewingApp.motivation],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between border-b border-border pb-2">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="text-foreground font-medium text-right max-w-[60%]">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === "students" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`${inputClass} pl-10`} placeholder="Search students..." />
                </div>
{isSuperAdmin && <Button onClick={() => setShowAddStudent(true)} className="gap-2"><Plus size={16} /> Add Student</Button>}
              </div>
              {showAddStudent && (
                <div className="bg-card rounded-xl border border-border p-5 space-y-3">
                  <h3 className="font-heading font-semibold text-foreground">Add New Student</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} className={inputClass} placeholder="Full Name" />
                    <input value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} className={inputClass} placeholder="Email" />
                    <select value={newStudent.semester} onChange={(e) => setNewStudent({ ...newStudent, semester: e.target.value })} className={inputClass}>
                      {["Sem 1", "Sem 2", "Sem 3", "Sem 4"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddStudent}>Save</Button>
                    <Button variant="outline" onClick={() => setShowAddStudent(false)}>Cancel</Button>
                  </div>
                </div>
              )}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left p-4 font-semibold text-foreground">ID</th>
                        <th className="text-left p-4 font-semibold text-foreground">Name</th>
                        <th className="text-left p-4 font-semibold text-foreground hidden sm:table-cell">Email</th>
                        <th className="text-center p-4 font-semibold text-foreground">Semester</th>
                        <th className="text-center p-4 font-semibold text-foreground">GPA</th>
                        <th className="text-center p-4 font-semibold text-foreground">Status</th>
                        <th className="text-center p-4 font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((s) => (
                        <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                          <td className="p-4 text-muted-foreground">{s.id}</td>
                          <td className="p-4 font-medium text-foreground">{s.name}</td>
                          <td className="p-4 text-muted-foreground hidden sm:table-cell">{s.email}</td>
                          <td className="p-4 text-center text-muted-foreground">{s.semester}</td>
                          <td className="p-4 text-center font-semibold text-foreground">{s.gpa}</td>
                          <td className="p-4 text-center">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.status === "Active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{s.status}</span>
                          </td>
                          <td className="p-4 text-center">
                            {isSuperAdmin && <button onClick={() => handleDeleteStudent(s.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTab === "courses" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-heading text-lg font-bold text-foreground">Courses</h2>
{isSuperAdmin && <Button onClick={() => setShowAddCourse(true)} className="gap-2"><Plus size={16} /> Add Course</Button>}
              </div>
              {showAddCourse && (
                <div className="bg-card rounded-xl border border-border p-5 space-y-3">
                  <h3 className="font-heading font-semibold text-foreground">Add New Course</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} className={inputClass} placeholder="Course Title" />
                    <select value={newCourse.semester} onChange={(e) => setNewCourse({ ...newCourse, semester: e.target.value })} className={inputClass}>
                      {["Sem 1", "Sem 2", "Sem 3", "Sem 4"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddCourse}>Save</Button>
                    <Button variant="outline" onClick={() => setShowAddCourse(false)}>Cancel</Button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courses.map((c) => (
                  <div key={c.id} className="bg-card rounded-xl border border-border p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-heading font-semibold text-foreground">{c.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{c.semester} · {c.enrolled} enrolled</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${c.status === "Active" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>{c.status}</span>
                        {isSuperAdmin && <button onClick={async () => {
                          try {
                            const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                            const token = s?.token;
                            const headers: any = { 'Content-Type': 'application/json' };
                            if (token) headers['Authorization'] = `Bearer ${token}`;
                            const res = await fetch(apiUrl('/api/admin/courses/' + c.id), { method: 'DELETE', headers });
                            setCourses(prev => prev.filter(x => x.id !== c.id));
                            toast.success('Course deleted');
                          } catch (e: any) { toast.error(e.message); }
                        }} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "grades" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-heading text-lg font-bold text-foreground">Grades & Results</h2>
                  <p className="text-sm text-muted-foreground mt-1">{pendingGradeCount} grade{pendingGradeCount === 1 ? "" : "s"} pending approval.</p>
                </div>
                <Button onClick={() => setShowAddGrade(true)} className="gap-2"><Plus size={16} /> Add Grade</Button>
              </div>
              {showAddGrade && (
                <div className="bg-card rounded-xl border border-border p-5 space-y-3">
                  <h3 className="font-heading font-semibold text-foreground">Enter New Grade</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input value={newGrade.student} onChange={(e) => setNewGrade({ ...newGrade, student: e.target.value })} className={inputClass} placeholder="Student Name" />
                    <input value={newGrade.course} onChange={(e) => setNewGrade({ ...newGrade, course: e.target.value })} className={inputClass} placeholder="Course" />
                    <input type="number" value={newGrade.midterm} onChange={(e) => setNewGrade({ ...newGrade, midterm: e.target.value })} className={inputClass} placeholder="Midterm" />
                    <input type="number" value={newGrade.final} onChange={(e) => setNewGrade({ ...newGrade, final: e.target.value })} className={inputClass} placeholder="Final" />
                  </div>
                  <p className="text-xs text-muted-foreground">Grades entered by a Sub Admin remain pending until a Super Admin approves them. Super Admin entries are published immediately.</p>
                  <div className="flex gap-2">
                    <Button onClick={handleAddGrade}>Save</Button>
                    <Button variant="outline" onClick={() => setShowAddGrade(false)}>Cancel</Button>
                  </div>
                </div>
              )}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left p-4 font-semibold text-foreground">Student</th>
                        <th className="text-left p-4 font-semibold text-foreground">Course</th>
                        <th className="text-center p-4 font-semibold text-foreground">Midterm</th>
                        <th className="text-center p-4 font-semibold text-foreground">Final</th>
                        <th className="text-center p-4 font-semibold text-foreground">Grade</th>
                        <th className="text-center p-4 font-semibold text-foreground">Status</th>
                        <th className="text-center p-4 font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.map((g, i) => (
                        <tr key={g.id} className="border-b border-border last:border-0">
                          <td className="p-4 font-medium text-foreground">{g.student}</td>
                          <td className="p-4 text-muted-foreground">{g.course}</td>
                          <td className="p-4 text-center">
                            {editingGrade === i ? <input type="number" value={editGradeData.midterm} onChange={(e) => setEditGradeData({ ...editGradeData, midterm: e.target.value })} className="w-16 text-center border border-border rounded px-1 py-0.5 text-sm" /> : g.midterm}
                          </td>
                          <td className="p-4 text-center">
                            {editingGrade === i ? <input type="number" value={editGradeData.final} onChange={(e) => setEditGradeData({ ...editGradeData, final: e.target.value })} className="w-16 text-center border border-border rounded px-1 py-0.5 text-sm" /> : g.final}
                          </td>
                          <td className="p-4 text-center">
                            <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-xs">{g.grade}</span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${g.status === "approved" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                              {g.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            {editingGrade === i ? (
                              <div className="flex gap-1 justify-center">
                                <Button size="sm" onClick={() => handleUpdateGrade(i)}>Save</Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingGrade(null)}>Cancel</Button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-2">
                                <button onClick={() => { setEditingGrade(i); setEditGradeData({ midterm: String(g.midterm), final: String(g.final) }); }} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-primary"><Edit size={14} /></button>
                                {g.status === "pending" && isSuperAdmin ? (
                                  <Button size="sm" onClick={() => useBackend ? approveGradeBackend((g as any).id) : handleApproveGrade(g.id)}>Approve</Button>
                                ) : null}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTab === "payments" && (
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">Payment Records</h2>
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left p-4 font-semibold text-foreground">ID</th>
                        <th className="text-left p-4 font-semibold text-foreground">Student</th>
                        <th className="text-center p-4 font-semibold text-foreground">Amount</th>
                        <th className="text-center p-4 font-semibold text-foreground">Method</th>
                        <th className="text-center p-4 font-semibold text-foreground">Date</th>
                        <th className="text-center p-4 font-semibold text-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentsState.map((p) => (
                        <tr key={p.id} className="border-b border-border last:border-0">
                          <td className="p-4 text-muted-foreground">{p.id}</td>
                          <td className="p-4 font-medium text-foreground">{p.student || p.student_name || p.user_name || p.user || p.student_index_number || p.student_email || '-'}</td>
                          <td className="p-4 text-center font-semibold text-foreground">{typeof p.amount === 'number' ? `GHS ${p.amount}` : p.amount}</td>
                          <td className="p-4 text-center text-muted-foreground">{p.method || p.payment_method || '-'}</td>
                          <td className="p-4 text-center text-muted-foreground">{(p.created_at || p.date || '').split('T')[0]}</td>
                          <td className="p-4 text-center">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${p.status === "Completed" || p.status === 'approved' || p.status === 'paid' ? "bg-primary/10 text-primary" : p.status === "Pending" || p.status === 'pending' ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>{p.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTab === "staff" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-foreground">Staff Directory</h2>
                {isSuperAdmin && (
                  <Button onClick={() => setShowAddStaff(true)} className="gap-2"><Plus size={16} /> Add Staff</Button>
                )}
              </div>
              {showAddStaff && isSuperAdmin && (
                <div className="bg-card rounded-xl border border-border p-5 space-y-3">
                  <h3 className="font-heading font-semibold text-foreground">Add Staff Member</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} className={inputClass} placeholder="Full Name" />
                    <input value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} className={inputClass} placeholder="Email" />
                    <input value={newStaff.contact} onChange={(e) => setNewStaff({ ...newStaff, contact: e.target.value })} className={inputClass} placeholder="Phone Number" />
                    <input type="password" value={newStaff.course} onChange={(e) => setNewStaff({ ...newStaff, course: e.target.value })} className={inputClass} placeholder="Password" />
                    <input type="password" value={newStaff.department} onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })} className={inputClass} placeholder="Confirm Password" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={async () => {
                      if (!newStaff.name) return;
                      try {
                        const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                        const token = s?.token;
                        const headers: any = { 'Content-Type': 'application/json' };
                        if (token) headers['Authorization'] = `Bearer ${token}`;
                        const res = await fetch(apiUrl('/api/admin/signup'), {
                          method: 'POST',
                          headers,
                          body: JSON.stringify({ username: newStaff.name, email: newStaff.email, phone: newStaff.contact, password: newStaff.course, confirmPassword: newStaff.department }),
                        });
                        if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Failed to add staff'); }
                        toast.success(`Staff "${newStaff.name}" added successfully`);
                        setNewStaff({ name: '', course: '', contact: '', email: '', department: '' });
                        setShowAddStaff(false);
                      } catch (e: any) { toast.error(e.message); }
                    }}>Save</Button>
                    <Button variant="outline" onClick={() => setShowAddStaff(false)}>Cancel</Button>
                  </div>
                </div>
              )}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left p-4 font-semibold text-foreground">ID</th>
                        <th className="text-left p-4 font-semibold text-foreground">Name</th>
                        <th className="text-left p-4 font-semibold text-foreground">Email</th>
                        <th className="text-left p-4 font-semibold text-foreground">Phone</th>
                        <th className="text-left p-4 font-semibold text-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminAccounts.length === 0 && (
                        <tr><td colSpan={6} className="p-6 text-center text-muted-foreground text-sm">No staff found</td></tr>
                      )}
                      {adminAccounts.map((s) => (
                        <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                          <td className="p-4 text-muted-foreground text-xs">{s.id}</td>
                          <td className="p-4 font-medium text-foreground">{s.username}</td>
                          <td className="p-4 text-muted-foreground">{s.email || '—'}</td>
                          <td className="p-4 text-muted-foreground">{s.phone_number || '—'}</td>
                          <td className="p-4">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.status === 'approved' ? 'bg-green-100 text-green-700' : s.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                              {s.status || 'pending'}
                            </span>
                          </td>
                          {isSuperAdmin && (
                            <td className="p-4 text-center">
                              <button onClick={async () => {
                                try {
                                  const tok = JSON.parse(localStorage.getItem('ami_admin_session') || '{}')?.token;
                                  await fetch(apiUrl('/api/admin/admins/' + s.id), { method: 'DELETE', headers: { Authorization: 'Bearer ' + tok } });
                                  setAdminAccounts(prev => prev.filter((x: any) => x.id !== s.id));
                                  toast.success('Staff removed');
                                } catch (e: any) { toast.error(e.message); }
                              }} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTab === "admins" && isSuperAdmin && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-foreground">Admin Approvals</h2>
                <span className="text-sm text-muted-foreground">{adminAccounts.length} total · {adminAccounts.filter((a:any)=>a.status==="pending").length} pending</span>
              </div>
              {adminAccounts.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                  <Shield size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">No admin accounts yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {adminAccounts.map((a: any) => (
                    <div key={a.email} className="bg-card rounded-xl border border-border p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {a.username?.charAt(0)?.toUpperCase() || "A"}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{a.username} {a.role === "super" && <span className="text-xs font-bold text-accent ml-2">SUPER ADMIN</span>}</p>
                            <p className="text-xs text-muted-foreground">{a.email} · {a.phone || "no phone"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            a.status === "approved" ? "bg-primary/10 text-primary" :
                            a.status === "pending" ? "bg-accent/10 text-accent" :
                            "bg-destructive/10 text-destructive"
                          }`}>{a.status}</span>
                          {a.role !== "super" && a.status === "pending" && (
                            <>
                              <Button size="sm" variant="default" className="gap-1" onClick={async () => {
                                if (useBackend) {
                                  await approveAdminBackend(a.id);
                                  return;
                                }
                                const all = JSON.parse(localStorage.getItem("ami_admin_accounts") || "[]");
                                const updated = all.map((x: any) => x.email === a.email ? { ...x, status: "approved" } : x);
                                localStorage.setItem("ami_admin_accounts", JSON.stringify(updated));
                                refreshAdminAccounts();
                                toast.success(`${a.username} approved as Sub-Admin`);
                              }}><CheckCircle size={14} /> Approve</Button>
                              <Button size="sm" variant="destructive" className="gap-1" onClick={async () => {
                                if (useBackend) {
                                  await denyAdminBackend(a.id);
                                  return;
                                }
                                const all = JSON.parse(localStorage.getItem("ami_admin_accounts") || "[]");
                                const updated = all.map((x: any) => x.email === a.email ? { ...x, status: "denied" } : x);
                                localStorage.setItem("ami_admin_accounts", JSON.stringify(updated));
                                refreshAdminAccounts();
                                toast.success(`${a.username} denied`);
                              }}><XCircle size={14} /> Deny</Button>
                            </>
                          )}
                          {a.role !== "super" && a.status !== "pending" && (
                            <Button size="sm" variant="outline" className="gap-1" onClick={async () => {
                              if (useBackend) {
                                await deleteAdminBackend(a.id);
                                return;
                              }
                              const all = JSON.parse(localStorage.getItem("ami_admin_accounts") || "[]");
                              const updated = all.filter((x: any) => x.email !== a.email);
                              localStorage.setItem("ami_admin_accounts", JSON.stringify(updated));
                              refreshAdminAccounts();
                              toast.success(`${a.username} removed`);
                            }}><Trash2 size={14} /> Remove</Button>
                          )}
                          <Button size="sm" variant="outline" className="gap-1" onClick={() => {
                            setEditingAdmin(a);
                            setEditingRole(a.role || 'sub_admin');
                            setEditingAdminStatus(a.status || 'pending');
                          }}><Edit size={14} /> Edit</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "assessments" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-foreground">Assessments</h2>
                <Button onClick={() => setShowAddAssessment(true)} className="gap-2"><Plus size={16} /> Add Assessment</Button>
              </div>
              {showAddAssessment && (
                <div className="bg-card rounded-xl border border-border p-5 space-y-3">
                  <h3 className="font-heading font-semibold text-foreground">New Assessment</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input value={newAssessment.title} onChange={e => setNewAssessment({...newAssessment, title: e.target.value})} className={inputClass} placeholder="Title" />
                    <input value={newAssessment.course} onChange={e => setNewAssessment({...newAssessment, course: e.target.value})} className={inputClass} placeholder="Course" />
                    <select value={newAssessment.type} onChange={e => setNewAssessment({...newAssessment, type: e.target.value})} className={inputClass}>
                      <option>Assignment</option>
                      <option>Quiz</option>
                      <option>Exam</option>
                    </select>
                    <input value={newAssessment.weight} onChange={e => setNewAssessment({...newAssessment, weight: e.target.value})} className={inputClass} placeholder="Weight (e.g. 10%)" />
                    <input type="date" value={newAssessment.posted} onChange={e => setNewAssessment({...newAssessment, posted: e.target.value})} className={inputClass} />
                    <select value={newAssessment.status} onChange={e => setNewAssessment({...newAssessment, status: e.target.value})} className={inputClass}>
                      <option>Posted</option>
                      <option>Upcoming</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={async () => {
                      try {
                        const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                        const headers: any = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s?.token };
                        const res = await fetch(apiUrl('/api/admin/assessments'), { method: 'POST', headers, body: JSON.stringify(newAssessment) });
                        if (!res.ok) throw new Error('Failed to add');
                        const data = await res.json();
                        setAssessments(prev => [data, ...prev]);
                        setNewAssessment({ title: '', course: '', type: 'Assignment', posted: '', status: 'Posted', weight: '' });
                        setShowAddAssessment(false);
                        toast.success('Assessment added — pending approval');
                      } catch (e: any) { toast.error(e.message); }
                    }}>Save</Button>
                    <Button variant="outline" onClick={() => setShowAddAssessment(false)}>Cancel</Button>
                  </div>
                </div>
              )}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-4 font-semibold">Title</th>
                      <th className="text-left p-4 font-semibold">Course</th>
                      <th className="text-left p-4 font-semibold">Type</th>
                      <th className="text-left p-4 font-semibold">Status</th>
                      <th className="text-left p-4 font-semibold">Approval</th>
                      <th className="text-left p-4 font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No assessments yet</td></tr>}
                    {assessments.map((a: any) => (
                      <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="p-4 font-medium">{a.title}</td>
                        <td className="p-4 text-muted-foreground">{a.course}</td>
                        <td className="p-4 text-muted-foreground">{a.type}</td>
                        <td className="p-4"><span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{a.status}</span></td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.approval_status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {a.approval_status === 'approved' ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td className="p-4 flex gap-2">
                          {isSuperAdmin && a.approval_status !== 'approved' && (
                            <Button size="sm" onClick={async () => {
                              try {
                                const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                                const headers: any = { Authorization: 'Bearer ' + s?.token };
                                const res = await fetch(apiUrl('/api/admin/assessments/' + a.id + '/approve'), { method: 'PUT', headers });
                                if (!res.ok) throw new Error('Failed');
                                setAssessments(prev => prev.map(x => x.id === a.id ? {...x, approval_status: 'approved'} : x));
                                toast.success('Assessment approved — now visible to students');
                              } catch (e: any) { toast.error(e.message); }
                            }}>Approve</Button>
                          )}
                          {isSuperAdmin && (
                            <button onClick={async () => {
                              try {
                                const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                                await fetch(apiUrl('/api/admin/assessments/' + a.id), { method: 'DELETE', headers: { Authorization: 'Bearer ' + s?.token } });
                                setAssessments(prev => prev.filter(x => x.id !== a.id));
                                toast.success('Assessment deleted');
                              } catch (e: any) { toast.error(e.message); }
                            }} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="font-heading text-lg font-bold text-foreground">Settings</h2>
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h3 className="font-heading font-semibold text-foreground">Institute Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Institute Name</label>
                    <input className={inputClass} defaultValue="Allāhul Musta'ān Institute for Teaching Arabic Language" readOnly />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Contact Number</label>
                    <input className={inputClass} defaultValue="+233 55 054 5403" readOnly />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
                    <input className={inputClass} defaultValue="info@allahumustaan.edu" readOnly />
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-heading font-semibold text-foreground mb-3">Data Management</h3>
                <p className="text-sm text-muted-foreground mb-4">Export or manage stored data.</p>
                <Button variant="outline" className="gap-2"><Download size={16} /> Export Data</Button>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h3 className="font-heading font-semibold text-foreground">Change Password</h3>
                <p className="text-sm text-muted-foreground">Update your account password.</p>
                <ChangePasswordForm />
              </div>
            </div>
          )}
        {activeTab === 'fee' && isSuperAdmin && <FeeSettingsTab />}
        {editingAdmin && (
                <div className="fixed inset-0 bg-foreground/30 z-50 flex items-center justify-center p-4" onClick={() => setEditingAdmin(null)}>
                  <div className="bg-card rounded-2xl border border-border p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading text-lg font-bold text-foreground">Edit Admin</h3>
                      <button onClick={() => setEditingAdmin(null)} className="p-1 hover:bg-muted rounded-lg"><X size={18} /></button>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <label className="text-sm text-muted-foreground block mb-1">Username</label>
                        <input className={inputClass} value={editingAdmin.username} readOnly />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground block mb-1">Email</label>
                        <input className={inputClass} value={editingAdmin.email} readOnly />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground block mb-1">Role</label>
                        <select value={editingRole} onChange={(e) => setEditingRole(e.target.value)} className={inputClass}>
                          <option value="sub_admin">Sub Admin</option>
                          <option value="super">Super Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground block mb-1">Status</label>
                        <select value={editingAdminStatus} onChange={(e) => setEditingAdminStatus(e.target.value)} className={inputClass}>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="denied">Denied</option>
                        </select>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button onClick={async () => {
                          try {
                            if (useBackend) {
                              await updateAdminBackend(editingAdmin.id, editingRole, editingAdminStatus);
                            } else {
                              const all = JSON.parse(localStorage.getItem("ami_admin_accounts") || "[]");
                              const updated = all.map((x: any) => x.email === editingAdmin.email ? { ...x, role: editingRole === 'super' ? 'super' : 'sub', status: editingAdminStatus } : x);
                              localStorage.setItem("ami_admin_accounts", JSON.stringify(updated));
                              refreshAdminAccounts();
                              toast.success('Admin updated locally');
                            }
                            setEditingAdmin(null);
                          } catch (e) {
                            // error handled in updateAdminBackend
                          }
                        }}>Save</Button>
                        <Button variant="outline" onClick={() => setEditingAdmin(null)}>Cancel</Button>
                      </div>
                    </div>
                  </div>
                </div>
        )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
