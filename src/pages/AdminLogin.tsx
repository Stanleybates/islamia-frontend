import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Users, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import logo from "@/assets/logo.png";
import adminBg from "@/assets/admin-bg.webp";
import apiClient from "@/lib/apiClient";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErrors([]);
    setLoading(true);
    try {
      await apiClient.adminLogin(email, password);
      sessionStorage.setItem('ami_admin_active', '1');
      toast.success("Logged in");
      navigate("/admin");
    } catch (err: any) {
      if (err.message === "pending") setErrors(["Your sub-admin account is awaiting Super Admin approval."]);
      else if (err.message === "denied") setErrors(["Your sub-admin request was denied. Contact Super Admin."]);
      else setErrors([err.message || "Invalid email or password"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url(${adminBg})`,
      }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 shadow-lg backdrop-blur-md mb-3">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-sm text-white/80">Allāhul Musta'ān Institute Management</p>
        </div>
        <div className="bg-card/95 backdrop-blur-sm p-6 rounded-xl border border-border shadow-2xl">
          {errors.length > 0 && (
            <div className="mb-3 bg-destructive/10 border border-destructive/20 rounded p-2">
              {errors.map((e, i) => <div key={i} className="text-xs text-destructive">{e}</div>)}
            </div>
          )}
          <div className="space-y-3">
            <div>
              <label className="text-sm block mb-1">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="text-sm block mb-1">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full px-3 py-2 border rounded pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <Button variant="gold" className="w-full" onClick={handleLogin} disabled={loading}>{loading ? "Logging in..." : "Log In"}</Button>
            <div className="flex items-center justify-between text-sm mt-2">
              <Link to="/admin/forgot" className="text-primary">Forgot Password?</Link>
              <Link to="/admin/signup" className="text-primary">Sign Up</Link>
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

export default AdminLogin;
