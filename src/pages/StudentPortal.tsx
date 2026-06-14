import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import { apiUrl } from '@/lib/apiClient';
import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Bell, User, LogOut, Home, Clock, Award, Eye, EyeOff, KeyRound, Phone, ClipboardList, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import logo from "@/assets/logo.png";
import studentBg from "@/assets/student-learning-bg.jpg";





const StudentPortal = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "courses" | "assessments" | "results" | "notifications">("dashboard");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Auth form
  const [authForm, setAuthForm] = useState({ indexNumber: "", password: "", phone: "" });
  const [authErrors, setAuthErrors] = useState<string[]>([]);
  const [studentResults, setStudentResults] = useState<any[]>([]);
  const [studentCourses, setStudentCourses] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [portalNotifications, setPortalNotifications] = useState<any[]>([]);
  const [studentAssessments, setStudentAssessments] = useState<any[]>([]);

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
      const [gradesRes, coursesRes, notifRes, assessmentsRes] = await Promise.all([
        fetch(apiUrl('/api/student/grades'), { headers }).then(r => r.ok ? r.json() : []),
        fetch(apiUrl('/api/student/courses'), { headers }).then(r => r.ok ? r.json() : []),
        fetch(apiUrl('/api/student/notifications'), { headers }).then(r => r.ok ? r.json() : []),
        fetch(apiUrl('/api/student/assessments'), { headers }).then(r => r.ok ? r.json() : []),
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
      if (Array.isArray(assessmentsRes)) setStudentAssessments(assessmentsRes);
      if (Array.isArray(coursesRes) && coursesRes.length > 0) {
        setStudentCourses(coursesRes.map((c: any) => ({
          title: c.title,
          semester: c.semester,
          progress: 0,
          grade: '—',
        })));
      }
    } catch (e) { console.error(e); }
    setLoadingData(false);
  };

  useEffect(() => {
    const session = localStorage.getItem('ami_student_session');
    if (session) { setIsLoggedIn(true); loadStudentData(); }
  }, []);

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
    if (authForm.password.length !== 4) errors.push('Password must be exactly 4 digits');
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
    try {
      const res = await fetch(apiUrl('/api/auth/forgot'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: forgotPhone }),
      });
      const data = await res.json();
      incrementResetAttempts();
      toast.success('Temporary password sent to your phone and email!');
      setForgotMode(false);
      setResetStep('request');
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
    if (!/^\d{4}$/.test(newPin)) { toast.error("Password must be exactly 4 digits"); return; }
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

  const session = JSON.parse(localStorage.getItem("ami_student_session") || "{}");
  const inputClass = "w-full px-4 py-3 rounded-lg border border-border bg-background/80 backdrop-blur-sm text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all";

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
                          const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                          setAuthForm({ ...authForm, password: val });
                        }}
                        className={`${inputClass} pr-10`}
                        placeholder="Enter your password"
                        maxLength={4}
                        inputMode="numeric"
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
                <h2 className="font-heading text-xl font-bold text-foreground mb-1">Reset Password</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {resetStep === "request" && "Enter your registered phone number to receive a reset code"}
                  {resetStep === "verify" && `Enter the code sent to your phone (expires in ${resetTimer}s)`}
                  {resetStep === "reset" && "Set your new password"}
                </p>

                {resetStep === "request" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Phone Number</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input value={forgotPhone} onChange={(e) => setForgotPhone(e.target.value)} className={`${inputClass} pl-10`} placeholder="+233 XX XXX XXXX" type="tel" />
                      </div>
                    </div>
                    <Button variant="gold" className="w-full" onClick={handleForgotRequest}>
                      Send Reset Code
                    </Button>
                  </div>
                )}

                {resetStep === "verify" && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold">
                        <Clock size={16} />
                        {resetTimer}s remaining
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Reset Code</label>
                      <input
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        className={inputClass}
                        placeholder="Enter 4-digit code"
                        maxLength={4}
                        inputMode="numeric"
                      />
                    </div>
                    <Button variant="gold" className="w-full" onClick={handleVerifyCode} disabled={resetTimer <= 0}>
                      Verify Code
                    </Button>
                  </div>
                )}

                {resetStep === "reset" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">New Password</label>
                      <input
                        type="password"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        className={inputClass}
                        placeholder="Enter new password"
                        maxLength={4}
                        inputMode="numeric"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmNewPin}
                        onChange={(e) => setConfirmNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        className={inputClass}
                        placeholder="Confirm new password"
                        maxLength={4}
                        inputMode="numeric"
                      />
                    </div>
                    <Button variant="gold" className="w-full" onClick={handleResetPassword}>
                      Reset Password
                    </Button>
                  </div>
                )}

                <div className="text-center mt-4">
                  <button onClick={() => { setForgotMode(false); setResetStep("request"); setResetTimer(0); }} className="text-sm text-primary font-semibold hover:underline">
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
          <p className="text-muted-foreground mt-1">Index Number: <span className="font-semibold text-primary">{session.indexNumber || session.regNumber}</span></p>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { key: "dashboard", label: "Dashboard", icon: Home },
            { key: "courses", label: "My Courses", icon: BookOpen },
            { key: "assessments", label: "Assessments", icon: ClipboardList },
            { key: "results", label: "Results", icon: Award },
            { key: "notifications", label: "Notifications", icon: Bell },
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
                    <p className="text-2xl font-bold text-foreground">Sem 1</p>
                    <p className="text-xs text-muted-foreground">Current Semester</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Course Registration</h3>
              <p className="text-sm text-muted-foreground">
                You can register for your semester courses after the semester fee is notified and paid. Once payment is confirmed, the course list for the new semester will appear here.
              </p>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="space-y-4">
            {studentCourses.map((course) => (
              <div key={course.title} className="bg-card rounded-xl border border-border p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-heading text-base font-semibold text-foreground">{course.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{course.semester} · Progress: {course.progress}%</p>
                </div>
                <span className="inline-block bg-primary/10 text-primary text-sm font-bold px-3 py-1 rounded-full">{course.grade}</span>
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
                  <h3 className="font-heading text-lg font-semibold text-foreground">Your Assessments</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Assessments and results posted by your staff. View only — your instructor handles submissions and grading.</p>
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
            <div className="space-y-3">
              {studentAssessments.map((a) => (
                <div key={a.title} className="bg-card rounded-xl border border-border p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        {a.type === "Exam" ? <Award size={18} /> : a.type === "Quiz" ? <CheckCircle2 size={18} /> : <FileText size={18} />}
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
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {studentResults.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No approved grades are available yet. Grades submitted by a Sub Admin will appear here after Super Admin approval.
              </div>
            ) : (
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
                    {studentResults.map((r) => (
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
            )}
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-3">
            {notifications.map((n, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-5 flex items-start gap-3">
                <Bell size={18} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-foreground">{n.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPortal;
