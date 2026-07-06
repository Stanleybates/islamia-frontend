import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import StudentPortal from "./pages/StudentPortal.tsx";
import AdminPanel from "./pages/AdminPanel.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminSignup from "./pages/AdminSignup.tsx";
import AdminForgot from "./pages/AdminForgot.tsx";
import AdminPending from "./pages/AdminPending.tsx";
import StudentLogin from "./pages/StudentLogin.tsx";
import StudentSignup from "./pages/StudentSignup.tsx";
import StudentForgot from "./pages/StudentForgot.tsx";
import NotFound from "./pages/NotFound.tsx";
import PaymentSuccess from "./pages/PaymentSuccess.tsx";

const queryClient = new QueryClient();

const LoadingScreen = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
    <div className="rounded-[28px] border border-border bg-card p-8 shadow-[0_30px_120px_rgba(15,23,42,0.18)] text-center">
      <div className="mx-auto mb-5 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      <h1 className="text-lg font-semibold text-foreground">Loading Allāhul Musta'ān Institute</h1>
      <p className="mt-2 text-sm text-muted-foreground">Please wait while the application prepares your experience.</p>
    </div>
  </div>
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => {
      setIsLoading(false);
      // Auto-redirect returning users on homepage
      const path = window.location.pathname;
      if (path === '/') {
        const studentSession = localStorage.getItem('ami_student_session');
        const adminSession = localStorage.getItem('ami_admin_session');
        // Only redirect if sessionStorage flag exists (browser wasn't closed)
        if (studentSession && sessionStorage.getItem('ami_student_active')) {
          try {
            const s = JSON.parse(studentSession);
            if (s?.token) window.location.href = '/student';
          } catch(e) {}
        } else if (adminSession && sessionStorage.getItem('ami_admin_active')) {
          try {
            const a = JSON.parse(adminSession);
            if (a?.token) window.location.href = '/admin';
          } catch(e) {}
        }
      }
    }, 500);
    return () => window.clearTimeout(loadingTimer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/student" element={<StudentPortal />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/signup" element={<StudentSignup />} />
            <Route path="/student/forgot" element={<StudentForgot />} />

            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route path="/admin/forgot" element={<AdminForgot />} />
            <Route path="/admin/pending" element={<AdminPending />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        {isLoading && <LoadingScreen />}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
