import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import { apiUrl } from '@/lib/apiClient';
import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Bell, User, LogOut, Home, Clock, Award, Eye, EyeOff, KeyRound, Phone, ClipboardList, FileText, CheckCircle2 } from "lucide-react";
import { jsPDF } from "jspdf";
import useSessionTimeout from "@/hooks/useSessionTimeout";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import logo from "@/assets/logo.png";
import studentBg from "@/assets/student-learning-bg.jpg";
import { formatSemesterDate, readSemesterSettings, writeSemesterSettings } from "@/lib/semester-settings";





const StudentPortal = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "courses" | "assessments" | "results" | "notifications" | "security" | "timetable">("dashboard");
  const [showPassword, setShowPassword] = useState(false);
  const [showSecurityPassword, setShowSecurityPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Auth form
  const [authForm, setAuthForm] = useState({ indexNumber: "", password: "", phone: "" });
  const [authErrors, setAuthErrors] = useState<string[]>([]);
  const [studentResults, setStudentResults] = useState<any[]>([]);
  const [studentCourses, setStudentCourses] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [portalNotifications, setPortalNotifications] = useState<any[]>([]);
  const [studentAssessments, setStudentAssessments] = useState<any[]>([]);
  const [studentExams, setStudentExams] = useState<any[]>([]);
  const [studentSchedule, setStudentSchedule] = useState<any[]>([]);
  const [examCountdowns, setExamCountdowns] = useState<Record<string, any>>({});
  const [gpaData, setGpaData] = useState<{ gpa: Record<string, number>; cgpa: number; totalCredits: number }>({ gpa: {}, cgpa: 0, totalCredits: 0 });
  const [semesterSettings, setSemesterSettings] = useState(() => readSemesterSettings());
  const [admissionOpen, setAdmissionOpen] = useState(true);
  const [countdownText, setCountdownText] = useState("");
  const [selectedExam, setSelectedExam] = useState<any | null>(null);
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});
  const [examScore, setExamScore] = useState<{ score: number; total: number } | null>(null);
  const [securityForm, setSecurityForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [securitySaving, setSecuritySaving] = useState(false);

  // Forgot password state
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotPhone, setForgotPhone] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmNewPin, setConfirmNewPin] = useState("");
  const [resetStep, setResetStep] = useState<"request" | "verify" | "reset">("request");
  const [resetTimer, setResetTimer] = useState(0);

  const loadStudentData = async () => {
    const session = localStorage.getItem('ami_student_session');
    const s = JSON.parse(session);
    const token = s?.token;
    setLoadingData(true);
    try {
      const headers: any = { Authorization: 'Bearer ' + token };
      const [gradesRes, coursesRes, notifRes, assessmentsRes, gpaRes] = await Promise.all([
        fetch(apiUrl('/api/student/grades'), { headers }).then(r => r.ok ? r.json() : []),
        fetch(apiUrl('/api/student/courses'), { headers }).then(r => r.ok ? r.json() : []),
        fetch(apiUrl('/api/student/notifications'), { headers }).then(r => r.ok ? r.json() : []),
        fetch(apiUrl('/api/student/assessments'), { headers }).then(r => r.ok ? r.json() : []),
        fetch(apiUrl('/api/student/gpa'), { headers }).then(r => r.ok ? r.json() : { gpa: {}, cgpa: 0, totalCredits: 0 }),
      ]);
      if (Array.isArray(gradesRes)) {
        setStudentResults(gradesRes.map((g: any) => ({
          course: g.course,
          midterm: g.midterm,
          final: g.final,
          grade: g.grade,
          semester: g.semester || 'Semester 1',
        })));
      }
      if (Array.isArray(notifRes)) setPortalNotifications(notifRes);
const apiAssessments = Array.isArray(assessmentsRes)
  ? assessmentsRes
  : Array.isArray(assessmentsRes?.data)
    ? assessmentsRes.data
    : [];

const localExams = readStoredExams();
setStudentAssessments(
  mergeAssessments(apiAssessments, localExams).map(normalizeAssessment)
);

if (gpaRes && typeof gpaRes.cgpa === "number") {
  setGpaData(gpaRes);
}

      // Fetch exams
      try {
        const examsRes = await fetch(apiUrl('/api/student/exams'), { headers }).then(r => r.ok ? r.json() : []);
        if (Array.isArray(examsRes)) setStudentExams(examsRes);
      } catch(e) { console.error('Exams fetch error:', e); }

      // Fetch class schedule
      try {
        const scheduleRes = await fetch(apiUrl('/api/student/schedule'), { headers }).then(r => r.ok ? r.json() : []);
        if (Array.isArray(scheduleRes)) setStudentSchedule(scheduleRes);
      } catch(e) { console.error('Schedule fetch error:', e); }
      if (Array.isArray(coursesRes)) {
        setStudentCourses(coursesRes.map((c: any) => ({
          id: c.id,
          title: c.title,
          semester: c.semester,
          enrolled: c.enrolled,
          status: c.status,
          teacherName: c.teacher_name || null,
          teacherEmail: c.teacher_email || null,
        })));
      }
    } catch (e) { console.error(e); }
    setLoadingData(false);
  };

  const loadSemesterSettings = async () => {
    try {
      const cached = readSemesterSettings();
      setSemesterSettings(cached);
      const res = await fetch(apiUrl('/api/admin/settings'));
      const d = await res.json();
      const next = {
        semester: d.semester || cached.semester,
        fee: Number(d.fee || cached.fee || 0),
        admissionStart: d.admissionStart || d.admission_start || d.semesterStart || d.semester_start || cached.admissionStart,
        admissionEnd: d.admissionEnd || d.admission_end || d.semesterEnd || d.semester_end || cached.admissionEnd,
      };
      setSemesterSettings(next);
      writeSemesterSettings(next);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const session = localStorage.getItem('ami_student_session');
    if (session) {
      try {
        const s = JSON.parse(session);
        const token = s?.token;
        if (!token) throw new Error('No token');
        // Verify token is not expired by checking JWT payload
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          localStorage.removeItem('ami_student_session');
          toast.error('Session expired. Please log in again.');
        } else {
          setIsLoggedIn(true);
          loadStudentData();
        }
      } catch {
        localStorage.removeItem('ami_student_session');
      }
    }
    loadSemesterSettings();
  }, []);

  useEffect(() => {
    const updateAdmissionStatus = () => {
      const startValue = semesterSettings.admissionStart;
      if (!startValue) {
        setAdmissionOpen(true);
        setCountdownText("");
        return;
      }

      const startTime = new Date(startValue).getTime();
      const now = Date.now();
      const diff = startTime - now;

      if (diff <= 0) {
        setAdmissionOpen(true);
        setCountdownText("");
        return;
      }

      setAdmissionOpen(false);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdownText(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateAdmissionStatus();
    const timer = window.setInterval(updateAdmissionStatus, 1000);
    return () => window.clearInterval(timer);
  }, [semesterSettings.admissionStart]);

  // Reset timer countdown
  useEffect(() => {
    if (resetTimer <= 0) return;
    const interval = setInterval(() => {
      setResetTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          if (resetStep === "verify") {
            toast.error("Reset code expired. Please request a new one.");
            setResetStep("request");
            setGeneratedCode("");
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [resetTimer, resetStep]);

  const checkResetAttempts = (): boolean => {
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem("ami_student_reset_attempts") || "{}");
    const attempts = stored[today] || 0;
    if (attempts >= 3) {
      toast.error("Maximum 3 password reset attempts per day. Try again tomorrow.");
      return false;
    }
    return true;
  };

  const incrementResetAttempts = () => {
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem("ami_student_reset_attempts") || "{}");
    stored[today] = (stored[today] || 0) + 1;
    localStorage.setItem("ami_student_reset_attempts", JSON.stringify(stored));
  };

  const handleLogin = async () => {
    const errors: string[] = [];
    if (errors.length > 0) { setAuthErrors(errors); return; }
    try {
      const res = await apiClient.studentLogin(authForm.indexNumber, authForm.password);
      localStorage.setItem('ami_student_session', JSON.stringify({ ...res.user, token: res.token }));
      setIsLoggedIn(true);
      loadStudentData();
      toast.success('Login successful! Welcome back.');
    } catch (e: any) { setAuthErrors([e.message || 'Invalid credentials']); }
  };

  const handleSignUp = async () => {
    const errors: string[] = [];
    if (authForm.password.length < 6) errors.push('Password must be at least 6 characters');
    if (errors.length > 0) { setAuthErrors(errors); return; }
    try {
      const res = await apiClient.studentSignup({ indexNumber: authForm.indexNumber, phone: authForm.phone, password: authForm.password });
      localStorage.setItem('ami_student_session', JSON.stringify({ ...res.user, token: res.token }));
      setIsLoggedIn(true);
      loadStudentData();
      toast.success('Sign up successful! Welcome.');
    } catch (e: any) { setAuthErrors([e.message || 'Sign up failed']); }
  };

  const handleForgotRequest = async () => {
    if (!checkResetAttempts()) return;
    try {
      const res = await fetch(apiUrl('/api/auth/forgot'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: forgotPhone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Phone number not found');
      incrementResetAttempts();
      toast.success('A temporary password has been sent to your email. Use it to log in, then change your password inside the portal.');
      setForgotMode(false);
      setResetStep('request');
      setForgotPhone('');
    } catch (e: any) { toast.error(e.message || 'Phone number not found'); }
  };

  const handleVerifyCode = () => {
    if (resetCode !== generatedCode) {
      toast.error("Invalid reset code");
      return;
    }
    setResetStep("reset");
    setResetTimer(0);
    toast.success("Code verified! Set your new password.");
  };

  const handleResetPassword = () => {
    if (newPin.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (newPin !== confirmNewPin) { toast.error("Passwords do not match"); return; }

    const accounts = JSON.parse(localStorage.getItem("ami_student_accounts") || "[]");
    const idx = accounts.findIndex((a: any) => a.phone === forgotPhone.replace(/\s/g, ""));
    if (idx === -1) { toast.error("Account not found"); return; }
    accounts[idx].password = newPin;
    localStorage.setItem("ami_student_accounts", JSON.stringify(accounts));

    toast.success("Password reset successfully! You can now log in.");
    setForgotMode(false);
    setResetStep("request");
    setForgotPhone("");
    setResetCode("");
    setNewPin("");
    setConfirmNewPin("");
    setGeneratedCode("");
  };

  const handleLogout = () => {
    localStorage.removeItem("ami_student_session");
    setIsLoggedIn(false);
    setAuthForm({ indexNumber: "", password: "", phone: "" });
    setAuthErrors([]);
    toast.info("Logged out successfully");
  };


  // Exam countdown timer
  useEffect(() => {
    if (studentExams.length === 0) return;
    const interval = setInterval(() => {
      const now = new Date();
      const counts: Record<string, any> = {};
      studentExams.forEach((e: any) => {
        if (!e.start_time) return;
        const start = new Date(e.start_time);
        const end = new Date(e.end_time);
        if (now >= start && now <= end) {
          counts[e.id] = { status: 'active', timeLeft: Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000)) };
        } else if (now < start) {
          const diff = start.getTime() - now.getTime();
          counts[e.id] = {
            status: 'upcoming',
            days: Math.floor(diff / 86400000),
            hours: Math.floor((diff % 86400000) / 3600000),
            minutes: Math.floor((diff % 3600000) / 60000),
            seconds: Math.floor((diff % 60000) / 1000),
          };
        } else {
          counts[e.id] = { status: 'closed' };
        }
      });
      setExamCountdowns(counts);
    }, 1000);
    return () => clearInterval(interval);
  }, [studentExams]);

  // Session timeout — 5 mins inactivity
  useSessionTimeout({
    timeoutMinutes: 5,
    isActive: isLoggedIn,
    onTimeout: () => {
      handleLogout();
      toast.warning("You were logged out due to inactivity.");
    },
  });

  const handleChangeStudentPassword = async () => {
    const studentSession = JSON.parse(localStorage.getItem("ami_student_session") || "{}");
    const studentIndex = studentSession.indexNumber || studentSession.index_number || studentSession.regNumber;

    if (!studentIndex) {
      toast.error("Student session not found. Please log in again.");
      return;
    }

    if (!securityForm.currentPassword || !securityForm.newPassword || !securityForm.confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (securityForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setSecuritySaving(true);
    try {
      const s = JSON.parse(localStorage.getItem('ami_student_session') || '{}');
      const token = s?.token;
      const res = await fetch(apiUrl('/api/student/change-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({
          currentPassword: securityForm.currentPassword,
          newPassword: securityForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update password');
      setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password updated successfully.");
    } catch(e: any) {
      toast.error(e.message || 'Failed to update password');
    } finally {
      setSecuritySaving(false);
    }
  };


  // Download class timetable as PDF
  const downloadClassTimetable = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("Allahul Musta'an Institute", 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text("Class Timetable", 105, 23, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Student: ${session.name || 'Student'} | Index: ${session.index_number || session.indexNumber || ''}`, 105, 30, { align: 'center' });
    doc.line(10, 33, 200, 33);

    let y = 42;
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    days.forEach(day => {
      const dayClasses = studentSchedule.filter((s: any) => s.day_of_week === day);
      if (dayClasses.length === 0) return;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(day, 10, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      dayClasses.forEach((s: any) => {
        doc.text(`  ${s.course}`, 10, y);
        doc.text(`${s.start_time} - ${s.end_time}`, 100, y);
        doc.text(s.venue || 'Online', 150, y);
        y += 6;
        if (s.teacher_name) { doc.text(`  Teacher: ${s.teacher_name}`, 10, y); y += 5; }
        if (s.meeting_link) { doc.text(`  Link: ${s.meeting_link}`, 10, y); y += 5; }
      });
      y += 3;
      if (y > 270) { doc.addPage(); y = 20; }
    });

    doc.save('class-timetable.pdf');
  };

  // Download exam timetable as PDF
  const downloadExamTimetable = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("Allahul Musta'an Institute", 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text("Exam Timetable", 105, 23, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Student: ${session.name || 'Student'} | Index: ${session.index_number || session.indexNumber || ''}`, 105, 30, { align: 'center' });
    doc.line(10, 33, 200, 33);

    let y = 42;
    studentExams.forEach((e: any, i: number) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`${i + 1}. ${e.course}`, 10, y); y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`   Title: ${e.title}`, 10, y); y += 5;
      if (e.start_time) { doc.text(`   Start: ${new Date(e.start_time).toLocaleString()}`, 10, y); y += 5; }
      if (e.end_time) { doc.text(`   End: ${new Date(e.end_time).toLocaleString()}`, 10, y); y += 5; }
      if (e.duration) { doc.text(`   Duration: ${e.duration} minutes`, 10, y); y += 5; }
      if (e.num_questions) { doc.text(`   Questions: ${e.num_questions}`, 10, y); y += 5; }
      if (e.instructions) { doc.text(`   Instructions: ${e.instructions}`, 10, y); y += 5; }
      y += 4;
      if (y > 270) { doc.addPage(); y = 20; }
    });

    doc.save('exam-timetable.pdf');
  };

  const session = JSON.parse(localStorage.getItem("ami_student_session") || "{}");
  const inputClass = "w-full px-4 py-3 rounded-lg border border-border bg-background/80 backdrop-blur-sm text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all";
  const admissionCountdown = admissionOpen ? "Admission is open now" : `Admission opens in ${countdownText}`;
  const transcriptGpa = gpaData.cgpa ? gpaData.cgpa.toFixed(2) : "0.00";

  const downloadTranscript = () => {
    const doc = new jsPDF();
    const studentName = session.name || "Student";
    const indexNumber = session.index_number || session.indexNumber || session.regNumber || "N/A";
    const semesterLabel = semesterSettings.semester || "Current Semester";

    // Header
    doc.setFontSize(18); doc.setFont('helvetica', 'bold');
    doc.text("Allahul Musta'an Institute", 105, 18, { align: 'center' });
    doc.setFontSize(11); doc.setFont('helvetica', 'normal');
    doc.text("Official Student Transcript", 105, 26, { align: 'center' });
    doc.line(10, 30, 200, 30);

    // Student info
    doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    doc.text(studentName, 10, 40);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    doc.text(`Index Number: ${indexNumber}`, 10, 47);
    doc.text(`Semester: ${semesterLabel}`, 10, 53);
    doc.text(`CGPA: ${transcriptGpa}  |  Total Credits: ${gpaData.totalCredits}`, 10, 59);
    doc.line(10, 63, 200, 63);

    let y = 72;
    const semesters = [...new Set(studentResults.map((r: any) => r.semester || 'Current Semester'))];
    semesters.forEach(sem => {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
      doc.text(String(sem), 10, y);
      const semGpa = gpaData.gpa[String(sem)];
      if (semGpa) doc.text(`GPA: ${semGpa.toFixed(2)}`, 170, y);
      y += 6;
      doc.setFillColor(249, 250, 251);
      doc.rect(10, y - 4, 190, 7, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
      doc.text('Course', 12, y); doc.text('Midterm', 120, y); doc.text('Final', 148, y); doc.text('Grade', 175, y);
      y += 5; doc.line(10, y, 200, y); y += 4;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
      studentResults.filter((r: any) => (r.semester || 'Current Semester') === sem).forEach((r: any) => {
        doc.text(String(r.course || ''), 12, y);
        doc.text(String(r.midterm ?? '-'), 120, y);
        doc.text(String(r.final ?? '-'), 148, y);
        doc.setFont('helvetica', 'bold');
        doc.text(String(r.grade ?? '-'), 175, y);
        doc.setFont('helvetica', 'normal');
        y += 6;
        if (y > 270) { doc.addPage(); y = 20; }
      });
      y += 5;
    });

    doc.setFontSize(8); doc.setFont('helvetica', 'italic');
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 287, { align: 'center' });
    doc.save(`${studentName.replace(/\s+/g, '_')}_transcript.pdf`);
  };

  // Auth Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img src={studentBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-foreground/70" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-foreground/10 border border-primary-foreground/20 mb-4 shadow-lg backdrop-blur-sm">
              <img src={logo} alt="Logo" className="h-14 w-auto" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-primary-foreground drop-shadow-md">Student Portal</h1>
            <p className="text-primary-foreground/80 text-sm mt-1">Allāhul Musta'ān Institute</p>
          </div>

          <div className="bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 p-7 shadow-2xl">
            {!forgotMode ? (
              <>
                <h2 className="font-heading text-xl font-bold text-foreground mb-1">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {isSignUp ? "Register with your index number" : "Sign in to access your dashboard"}
                </p>

                {authErrors.length > 0 && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
                    {authErrors.map((e, i) => (
                      <p key={i} className="text-xs text-destructive">{e}</p>
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Index Number</label>
                    <input
                      value={authForm.indexNumber}
                      onChange={(e) => setAuthForm({ ...authForm, indexNumber: e.target.value })}
                      className={inputClass}
                      placeholder="Enter your index number"
                    />
                  </div>
                  {isSignUp && (
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Phone Number</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          value={authForm.phone}
                          onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                          className={`${inputClass} pl-10`}
                          placeholder="+233 XX XXX XXXX"
                          type="tel"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={authForm.password}
                        onChange={(e) => {
                          setAuthForm({ ...authForm, password: e.target.value });
                        }}
                        className={`${inputClass} pr-10`}
                        placeholder="Enter your password"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <Button variant="gold" className="w-full py-3 text-base font-semibold" onClick={isSignUp ? handleSignUp : handleLogin}>
                    {isSignUp ? "Sign Up" : "Log In"}
                  </Button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {!isSignUp && (
                    <button onClick={() => { setForgotMode(true); setAuthErrors([]); }} className="text-sm text-primary font-semibold hover:underline inline-flex items-center gap-1.5">
                      <KeyRound size={14} />
                      Forgot Password?
                    </button>
                  )}
                  <button onClick={() => { setIsSignUp(!isSignUp); setAuthErrors([]); }} className="text-sm text-primary font-semibold hover:underline ml-auto">
                    {isSignUp ? "Already have an account? Log In" : "Sign Up"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="font-heading text-xl font-bold text-foreground mb-1">Forgot Password</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Enter your registered phone number. A temporary password will be sent to your email.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input value={forgotPhone} onChange={(e) => setForgotPhone(e.target.value)} className={`${inputClass} pl-10`} placeholder="+233 XX XXX XXXX" type="tel" />
                    </div>
                  </div>
                  <Button variant="gold" className="w-full" onClick={handleForgotRequest}>
                    Send Temporary Password
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Use the temporary password to log in, then change it from inside your portal.
                  </p>
                </div>
                <div className="text-center mt-4">
                  <button onClick={() => { setForgotMode(false); setResetStep("request"); }} className="text-sm text-primary font-semibold hover:underline">
                    ← Back to Login
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="text-center mt-4">
            <Link to="/" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">← Back to Website</Link>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container-max px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <img src={logo} alt="Logo" className="h-7 w-auto" />
            </div>
            <div>
              <p className="font-heading text-sm font-bold text-primary">Student Portal</p>
              <p className="text-xs text-muted-foreground">Allāhul Musta'ān Institute</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <Home size={16} />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User size={18} />
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:inline">{session.name || "Student"}</span>
            </div>
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-destructive transition-colors" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="container-max px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">As-salāmu ʿalaykum, {session.name || "Student"} 👋</h1>
          <p className="font-semibold text-primary text-lg">{session.index_number || session.indexNumber || session.regNumber}</p>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { key: "dashboard", label: "Dashboard", icon: Home },
            { key: "courses", label: "My Courses", icon: BookOpen },
            { key: "assessments", label: "Assessments", icon: ClipboardList },
            { key: "results", label: "Results", icon: Award },
            { key: "notifications", label: "Notifications", icon: Bell, badge: portalNotifications.filter((n: any) => !n.read).length },
            { key: "timetable", label: "Timetable", icon: Clock },
            { key: "security", label: "Change Password", icon: KeyRound },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key ? "bg-primary text-primary-foreground shadow-md" : "bg-card text-muted-foreground hover:bg-muted border border-border"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {(tab as any).badge > 0 && (
                <span className="bg-destructive text-destructive-foreground text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {(tab as any).badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><BookOpen size={20} /></div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">3</p>
                    <p className="text-xs text-muted-foreground">Enrolled Courses</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent"><ClipboardList size={20} /></div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{studentAssessments.filter(a => a.status === "Posted").length}</p>
                    <p className="text-xs text-muted-foreground">Posted Assessments</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary"><GraduationCap size={20} /></div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{semesterSettings.semester || 'Semester 1'}</p>
                    <p className="text-xs text-muted-foreground">Current Semester</p>
                  </div>
                </div>
                <div className="mt-3 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
                  <p><span className="font-medium text-foreground">Admission Starts:</span> {formatSemesterDate(semesterSettings.admissionStart)}</p>
                  <p><span className="font-medium text-foreground">Admission Ends:</span> {formatSemesterDate(semesterSettings.admissionEnd)}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Course Registration</h3>
              <p className="text-sm text-muted-foreground">
                You can register for your semester courses after the semester fee is notified and paid. Once payment is confirmed, the course list for the new semester will appear here.
              </p>
              <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3 text-sm">
                <span className="font-medium text-foreground">Admission Status:</span>{" "}
                <span className={admissionOpen ? "text-green-600" : "text-amber-600"}>{admissionCountdown}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-heading text-lg font-semibold text-foreground mb-1">Course Registration</h3>
              <p className="text-sm text-muted-foreground">
                Below are the courses available for your semester. Register for the ones you want to enroll in.
              </p>
            </div>
            {studentCourses.length === 0 && (
              <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
                No courses available for your semester yet. Check back later.
              </div>
            )}
            {studentCourses.map((course: any) => (
              <div key={course.id} className="bg-card rounded-xl border border-border p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <BookOpen size={18} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-heading text-base font-semibold text-foreground truncate">{course.title}</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">{course.semester}</p>
                    {course.teacherName && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        👤 {course.teacherName}
                        {course.teacherEmail && <span> · {course.teacherEmail}</span>}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant={course.enrolled ? "outline" : "gold"}
                  className="flex-shrink-0 text-sm px-4 py-2"
                  onClick={async () => {
                    const session = JSON.parse(localStorage.getItem('ami_student_session') || '{}');
                    const token = session?.token;
                    const method = course.enrolled ? 'DELETE' : 'POST';
                    try {
                      const res = await fetch(apiUrl(`/api/student/courses/${course.id}/enroll`), {
                        method,
                        headers: { Authorization: 'Bearer ' + token },
                      });
                      if (res.ok) {
                        toast.success(course.enrolled ? 'Unenrolled successfully' : 'Enrolled successfully!');
                        loadStudentData();
                      } else {
                        const err = await res.json();
                        toast.error(err.message || 'Failed');
                      }
                    } catch(e) { toast.error('Network error'); }
                  }}
                >
                  {course.enrolled ? 'Unenroll' : 'Enroll'}
                </Button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "assessments" && (
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <ClipboardList size={22} />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-foreground">Your Assessments</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">Assessments and results posted by your staff.</p>
                    </div>
                    {studentExams.length > 0 && (
                      <Button variant="outline" onClick={downloadExamTimetable} className="gap-2 flex-shrink-0">
                        <FileText size={14} /> Download Exam Schedule
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "Posted", value: studentAssessments.filter(a => a.status === "Posted").length, color: "bg-primary/10 text-primary" },
                { label: "Upcoming", value: studentAssessments.filter(a => a.status === "Upcoming").length, color: "bg-secondary/10 text-secondary" },
              ].map((s) => (
                <div key={s.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">Available Exams</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Open an exam link below to start the exam. Older question-based exams are still supported.</p>
                </div>
                {selectedExam && (
                  <Button variant="outline" onClick={() => { setSelectedExam(null); setExamAnswers({}); setExamScore(null); }}>
                    Close Exam
                  </Button>
                )}
              </div>

              {studentExams.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-6 text-center text-muted-foreground">
                  No exams scheduled yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {studentExams.map((exam: any) => {
                    const cd = examCountdowns[exam.id];
                    const isActive = cd?.status === 'active';
                    const isClosed = cd?.status === 'closed';
                    const isUpcoming = cd?.status === 'upcoming';
                    return (
                      <div key={exam.id} className={`rounded-xl border p-5 ${isActive ? 'border-primary bg-primary/5' : 'border-border'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-medium text-foreground">{exam.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{exam.course} · {exam.duration || 60} mins{exam.num_questions ? ` · ${exam.num_questions} questions` : ''}</p>
                            {exam.instructions && <p className="text-xs text-muted-foreground mt-0.5">{exam.instructions}</p>}
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Clock size={12} />
                              {exam.start_time ? new Date(exam.start_time).toLocaleString() : ''} — {exam.end_time ? new Date(exam.end_time).toLocaleString() : ''}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            {isClosed && (
                              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-destructive/10 text-destructive">Exam Closed</span>
                            )}
                            {isActive && (
                              <>
                                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">🟢 Active Now</span>
                                {exam.exam_link && (
                                  <a href={exam.exam_link} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                                    Start Exam →
                                  </a>
                                )}
                                <p className="text-xs text-muted-foreground">
                                  Ends in: {Math.floor((cd.timeLeft || 0) / 60)}m {(cd.timeLeft || 0) % 60}s
                                </p>
                              </>
                            )}
                            {isUpcoming && cd && (
                              <>
                                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary/10 text-secondary">Upcoming</span>
                                <p className="text-xs text-muted-foreground text-right">
                                  Starts in: {cd.days}d {cd.hours}h {cd.minutes}m {cd.seconds}s
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedExam && (
              <div className="bg-card rounded-xl border border-border p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">{selectedExam.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedExam.course} · {selectedExam.duration || "60"} minutes</p>
                    <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1"><Clock size={12} /> Exam schedule: {formatExamDateList(selectedExam.examDates || selectedExam.exam_dates || selectedExam.dates || selectedExam.posted)}</p>
                  </div>
                  {examScore && (
                    <div className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                      Score: {examScore.score}/{examScore.total}
                    </div>
                  )}
                </div>

                {(selectedExam.examLink || selectedExam.exam_link || selectedExam.url || selectedExam.link) && (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                    <p className="text-sm font-medium text-foreground">This exam uses an external link.</p>
                    <p className="text-xs text-muted-foreground break-all">{selectedExam.examLink || selectedExam.exam_link || selectedExam.url || selectedExam.link}</p>
                    <a
                      href={selectedExam.examLink || selectedExam.exam_link || selectedExam.url || selectedExam.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Start Exam
                    </a>
                  </div>
                )}

                {!selectedExam.examLink && !selectedExam.exam_link && !selectedExam.url && !selectedExam.link && parseExamQuestions(selectedExam.questionsText || selectedExam.questions || "").length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-6 text-center text-muted-foreground">
                    This exam does not have any questions yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {parseExamQuestions(selectedExam.questionsText || selectedExam.questions || "").map((question, index) => (
                      <div key={index} className="rounded-xl border border-border p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 font-semibold">
                            {index + 1}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground">{question.question}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Choose one answer</p>
                          </div>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {question.options.map((option, optionIndex) => (
                            <label key={optionIndex} className={`flex items-center gap-3 rounded-lg border p-3 text-sm cursor-pointer transition-colors ${examAnswers[question.id] === option ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"}`}>
                              <input
                                type="radio"
                                name={question.id}
                                value={option}
                                checked={examAnswers[question.id] === option}
                                onChange={() => setExamAnswers(prev => ({ ...prev, [question.id]: option }))}
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        variant="gold"
                        onClick={() => {
                          const questions = parseExamQuestions(selectedExam.questionsText || selectedExam.questions || "");
                          const score = questions.reduce((acc, question) => acc + (examAnswers[question.id] === question.correctAnswer ? 1 : 0), 0);
                          const result = { examId: selectedExam.id || selectedExam.title, score, total: questions.length, submittedAt: new Date().toISOString() };
                          const stored = JSON.parse(localStorage.getItem("ami_exam_results") || "[]");
                          localStorage.setItem("ami_exam_results", JSON.stringify([result, ...stored]));
                          setExamScore({ score, total: questions.length });
                          toast.success(`Exam submitted. Score: ${score}/${questions.length}`);
                        }}
                      >
                        Submit Exam
                      </Button>
                      <Button variant="outline" onClick={() => { setExamAnswers({}); setExamScore(null); }}>
                        Reset Answers
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              {studentAssessments.filter((a) => a.type !== "Exam").map((a) => (
                <div key={a.id || a.title} className="bg-card rounded-xl border border-border p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        {a.type === "Quiz" ? <CheckCircle2 size={18} /> : <FileText size={18} />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{a.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{a.course} · {a.type} · Weight {a.weight}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 inline-flex items-center gap-1"><Clock size={12} /> Posted {a.posted}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        a.status === "Posted" ? "bg-primary/10 text-primary" :
                        "bg-secondary/10 text-secondary"
                      }`}>{a.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "results" && (
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground">Transcript Download</h3>
                <p className="text-sm text-muted-foreground mt-1">Download a printable transcript with your results and summary.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-lg border border-border bg-muted/30 px-4 py-2 text-sm">
                  <span className="text-muted-foreground">CGPA</span>{" "}
                  <span className="font-semibold text-foreground">{transcriptGpa}</span>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 px-4 py-2 text-sm">
                  <span className="text-muted-foreground">Credits</span>{" "}
                  <span className="font-semibold text-foreground">{gpaData.totalCredits}</span>
                </div>
                <Button variant="gold" onClick={downloadTranscript} disabled={studentResults.length === 0}>
                  Download Transcript
                </Button>
              </div>
            </div>

            {Object.keys(gpaData.gpa).length > 0 && (
              <div className="bg-card rounded-xl border border-border p-5">
                <h4 className="font-heading text-base font-semibold text-foreground mb-3">GPA by Semester</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(gpaData.gpa).map(([sem, gpa]) => (
                    <div key={sem} className="bg-muted/30 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">{sem}</p>
                      <p className="text-lg font-bold text-primary">{(gpa as number).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}


            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {studentResults.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Your results are not available yet. You will be notified once your grades are out.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Group results by semester */}
                  {[...new Set(studentResults.map((r: any) => r.semester || 'Current Semester'))].map(sem => (
                    <div key={sem} className="bg-card rounded-xl border border-border overflow-hidden">
                      <div className="bg-primary/5 border-b border-border px-4 py-3 flex items-center justify-between">
                        <h4 className="font-heading text-sm font-bold text-primary">{sem}</h4>
                        <span className="text-xs text-muted-foreground">
                          GPA: {gpaData.gpa[sem] ? gpaData.gpa[sem].toFixed(2) : '—'}
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border bg-muted/50">
                              <th className="text-left p-4 font-semibold text-foreground">Course</th>
                              <th className="text-center p-4 font-semibold text-foreground">Midterm</th>
                              <th className="text-center p-4 font-semibold text-foreground">Final</th>
                              <th className="text-center p-4 font-semibold text-foreground">Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studentResults.filter((r: any) => (r.semester || 'Current Semester') === sem).map((r: any) => (
                              <tr key={`${r.course}-${r.grade}-${r.midterm}`} className="border-b border-border last:border-0">
                                <td className="p-4 text-foreground">{r.course}</td>
                                <td className="p-4 text-center text-muted-foreground">{r.midterm}</td>
                                <td className="p-4 text-center text-muted-foreground">{r.final}</td>
                                <td className="p-4 text-center">
                                  <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-xs">{r.grade}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-3">
            {/* Header with mark all read */}
            {portalNotifications.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {portalNotifications.filter(n => !n.read).length} unread
                </p>
                <button
                  onClick={async () => {
                    const s = JSON.parse(localStorage.getItem('ami_student_session') || '{}');
                    const token = s?.token;
                    try {
                      await fetch(apiUrl('/api/student/notifications/read-all'), {
                        method: 'PUT',
                        headers: { Authorization: 'Bearer ' + token },
                      });
                      setPortalNotifications(prev => prev.map(n => ({ ...n, read: true })));
                    } catch(e) { console.error(e); }
                  }}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Mark all as read
                </button>
              </div>
            )}

            {portalNotifications.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
                No notifications yet.
              </div>
            ) : (
              portalNotifications.map((n: any) => (
                <div
                  key={n.id}
                  onClick={async () => {
                    if (!n.read) {
                      const s = JSON.parse(localStorage.getItem('ami_student_session') || '{}');
                      const token = s?.token;
                      try {
                        await fetch(apiUrl(`/api/student/notifications/${n.id}/read`), {
                          method: 'PUT',
                          headers: { Authorization: 'Bearer ' + token },
                        });
                        setPortalNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
                      } catch(e) { console.error(e); }
                    }
                  }}
                  className={`bg-card rounded-xl border p-5 flex items-start gap-3 cursor-pointer transition-colors ${!n.read ? 'border-primary/30 bg-primary/5' : 'border-border'}`}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.read ? 'bg-primary' : 'bg-transparent'}`} />
                  <Bell size={18} className={`mt-0.5 flex-shrink-0 ${!n.read ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="min-w-0 flex-1">
                    {n.title && <p className="text-sm font-semibold text-foreground">{n.title}</p>}
                    <p className="text-sm text-foreground mt-0.5">{n.message || n.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {n.created_at ? new Date(n.created_at).toLocaleString() : n.time}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "timetable" && (
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-5 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-1">Class Timetable</h3>
                <p className="text-sm text-muted-foreground">Weekly schedule for your enrolled courses.</p>
              </div>
              {studentSchedule.length > 0 && (
                <Button variant="outline" onClick={downloadClassTimetable} className="gap-2 flex-shrink-0">
                  <FileText size={14} /> Download
                </Button>
              )}
            </div>
            {studentSchedule.length === 0 ? (
              <div className="bg-card rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
                No class schedule set yet. Check back later.
              </div>
            ) : (
              <div className="space-y-3">
                {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => {
                  const dayClasses = studentSchedule.filter((s: any) => s.day_of_week === day);
                  if (dayClasses.length === 0) return null;
                  return (
                    <div key={day} className="bg-card rounded-xl border border-border overflow-hidden">
                      <div className="bg-primary/5 border-b border-border px-5 py-3">
                        <h4 className="font-heading text-sm font-bold text-primary">{day}</h4>
                      </div>
                      {dayClasses.map((s: any) => (
                        <div key={s.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border last:border-0">
                          <div>
                            <p className="font-medium text-foreground">{s.course}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                              <Clock size={12} /> {s.start_time} — {s.end_time}
                            </p>
                            {s.teacher_name && <p className="text-xs text-muted-foreground mt-0.5">👤 {s.teacher_name}</p>}
                            {s.notes && <p className="text-xs text-muted-foreground mt-0.5">{s.notes}</p>}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">{s.venue}</span>
                            {s.platform && <span className="text-xs text-muted-foreground">{s.platform}</span>}
                            {s.meeting_link && (
                              <a href={s.meeting_link} target="_blank" rel="noopener noreferrer"
                                className="text-xs text-primary underline">Join Class</a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-4 max-w-2xl">
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <KeyRound size={22} />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">Change Password</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Update your student password from inside the portal.</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Current Password</label>
                <div className="relative">
                  <input
                    type={showSecurityPassword ? "text" : "password"}
                    value={securityForm.currentPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                    className={inputClass}
                    placeholder="Enter current password"
                  />
                  <button type="button" onClick={() => setShowSecurityPassword(!showSecurityPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showSecurityPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">New Password</label>
                <input
                  type="password"
                  value={securityForm.newPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                  className={inputClass}
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={securityForm.confirmPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                  className={inputClass}
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="gold" onClick={handleChangeStudentPassword} disabled={securitySaving}>
                  {securitySaving ? "Updating..." : "Update Password"}
                </Button>
                <Button variant="outline" onClick={() => setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" })}>
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPortal;

function gradeToPoints(grade: string) {
  const points: Record<string, number> = {
    "A+": 5,
    "A": 4.75,
    "B+": 4.5,
    "B": 4,
    "C+": 3.5,
    "C": 3,
    "D+": 2.5,
    "D": 2,
    "F": 1,
  };

  return points[grade] ?? 0;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function readStoredExams() {
  try {
    const stored = JSON.parse(localStorage.getItem("ami_uploaded_exams") || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function normalizeExamDates(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function formatExamDateList(value: unknown) {
  const dates = normalizeExamDates(value);
  if (dates.length === 0) return "Not scheduled";
  return dates.map((date) => formatSemesterDate(date)).join(" · ");
}

function mergeAssessments(apiAssessments: any[], localAssessments: any[]) {
  const merged = new Map<string, any>();

  [...localAssessments, ...apiAssessments].forEach((item) => {
    const key = String(item.id || `${item.title}-${item.course}-${item.posted}`);
    merged.set(key, item);
  });

  return Array.from(merged.values());
}

function normalizeAssessment(item: any) {
  return {
    ...item,
    examLink: item.examLink || item.exam_link || item.url || item.link || "",
    exam_link: item.exam_link || item.examLink || item.url || item.link || "",
    questionsText: item.questionsText || item.questions || "",
  };
}

function parseExamQuestions(raw: string) {
  if (!raw.trim()) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item, index) => ({
          id: String(item.id || `q-${index}`),
          question: String(item.question || item.text || "Question"),
          options: Array.isArray(item.options) ? item.options.map(String) : [],
          correctAnswer: String(item.correctAnswer || item.answer || ""),
        }))
        .filter((item) => item.question && item.options.length > 0);
    }
  } catch {
    // Fallback to line-based format below.
  }

  return raw
    .split(/\n+/)
    .map((line, index) => {
      const parts = line.split("|").map((part) => part.trim()).filter(Boolean);
      if (parts.length < 6) return null;

      const [question, option1, option2, option3, option4, correctRaw] = parts;
      const options = [option1, option2, option3, option4];
      const correctAnswer = resolveCorrectAnswer(correctRaw, options);

      return {
        id: `q-${index}`,
        question,
        options,
        correctAnswer,
      };
    })
    .filter(Boolean) as Array<{ id: string; question: string; options: string[]; correctAnswer: string }>;
}

function resolveCorrectAnswer(correctRaw: string, options: string[]) {
  const trimmed = correctRaw.trim();
  const upper = trimmed.toUpperCase();

  if (["A", "B", "C", "D"].includes(upper)) {
    const index = upper.charCodeAt(0) - 65;
    return options[index] || trimmed;
  }

  const numeric = Number(trimmed);
  if (!Number.isNaN(numeric) && numeric >= 1 && numeric <= options.length) {
    return options[numeric - 1] || trimmed;
  }

  const matchedOption = options.find((option) => option.toLowerCase() === trimmed.toLowerCase());
  return matchedOption || trimmed;
}
