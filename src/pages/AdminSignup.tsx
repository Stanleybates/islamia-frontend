import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { validateEmail } from "@/lib/validation";
import apiClient from "@/lib/apiClient";

const AdminSignup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    const errs: string[] = [];
    if (!username.trim()) errs.push("Username is required");
    if (!email.trim()) errs.push("Email is required");
    else if (!validateEmail(email)) errs.push("Invalid email format");
    if (!password.trim()) errs.push("Password is required");
    if (password !== confirmPassword) errs.push("Passwords do not match");
    if (errs.length) { setErrors(errs); return; }

    setLoading(true);
    setErrors([]);
    try {
      await apiClient.adminSignup({ username, email, phone, password });
      navigate("/admin/pending", { state: { email } });
    } catch (err: any) {
      setErrors([err.message || "Something went wrong. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="mx-auto h-14 mb-2" />
          <h1 className="text-2xl font-bold">Admin Sign Up</h1>
          <p className="text-sm text-muted-foreground">Allāhul Musta'ān Institute Management</p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border">
          {errors.length > 0 && (
            <div className="mb-3 bg-destructive/10 border border-destructive/20 rounded p-2">
              {errors.map((e, i) => <div key={i} className="text-xs text-destructive">{e}</div>)}
            </div>
          )}
          <div className="space-y-3">
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full px-3 py-2 border rounded" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 border rounded" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)" className="w-full px-3 py-2 border rounded" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-3 py-2 border rounded" />
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="w-full px-3 py-2 border rounded" />
            <p className="text-sm text-muted-foreground">This form is for Sub Admin sign-up requests only. Super Admin credentials are managed on the backend.</p>
            <Button variant="gold" className="w-full" onClick={handleSignup} disabled={loading}>
              {loading ? "Submitting..." : "Request Sub Admin Approval"}
            </Button>
            <div className="text-sm text-center mt-2">
              <Link to="/admin/login" className="text-primary">Already have an account? Log In</Link>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-muted-foreground">← Back to Website</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
