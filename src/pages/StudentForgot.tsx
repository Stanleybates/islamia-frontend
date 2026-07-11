import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { apiUrl } from '@/lib/apiClient';
import { getCsrfToken } from '@/lib/csrf';

const StudentForgot = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleRequest = async () => {
    if (!email.trim()) { setError("Please enter your email address"); return; }
    setLoading(true);
    setError("");
    try {
      const csrfToken = await getCsrfToken();
      const res = await fetch(apiUrl('/api/auth/forgot'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="mx-auto h-14 mb-2" />
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-sm text-muted-foreground">Enter your registered email address</p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border">
          {sent ? (
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-3xl">📧</span>
              </div>
              <h2 className="font-bold text-foreground">Check Your Email</h2>
              <p className="text-sm text-muted-foreground">A temporary password has been sent to <span className="font-semibold text-foreground">{email}</span>. Please check your inbox (and spam folder), then use it to log in.</p>
              <Link to="/student/login" className="block text-primary text-sm mt-4">← Back to Login</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {error && <div className="bg-destructive/10 border border-destructive/20 rounded p-2 text-xs text-destructive">{error}</div>}
              <div>
                <label className="text-sm block mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Your registered email address" />
              </div>
              <Button variant="gold" className="w-full" onClick={handleRequest} disabled={loading}>
                {loading ? "Sending..." : "Send Temporary Password"}
              </Button>
              <div className="text-sm text-center mt-2">
                <Link to="/student/login" className="text-primary">← Back to Login</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentForgot;
