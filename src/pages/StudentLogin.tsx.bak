import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import logo from "@/assets/logo.png";
import studentLearningBg from "@/assets/student-learning-bg.jpg";
import apiClient from "@/lib/apiClient";

const StudentLogin = () => {
  const navigate = useNavigate();
  const [indexNumber, setIndexNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const handleLogin = async () => {
    setErrors([]);
    try {
      await apiClient.studentLogin(indexNumber, password);
      toast.success("Login successful! Welcome back.");
      navigate("/student");
    } catch (err: any) {
      setErrors([err.message || "Invalid index number or password"]);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.82)), url(${studentLearningBg})`,
      }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 shadow-lg backdrop-blur-md mb-3">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-white">Student Login</h1>
          <p className="text-sm text-white/80">Student Portal</p>
        </div>
        <div className="bg-card/95 backdrop-blur-sm p-6 rounded-xl border border-border shadow-2xl">
          {errors.length > 0 && (
            <div className="mb-3 bg-destructive/10 border border-destructive/20 rounded p-2">
              {errors.map((e, i) => <div key={i} className="text-xs text-destructive">{e}</div>)}
            </div>
          )}
          <div className="space-y-3">
            <input value={indexNumber} onChange={(e) => setIndexNumber(e.target.value)} placeholder="Index number" className="w-full px-3 py-2 border rounded" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-3 py-2 border rounded" />
            <Button variant="gold" className="w-full" onClick={handleLogin}>Log In</Button>
            <div className="flex items-center justify-between text-sm mt-2">
              <Link to="/student/forgot" className="text-primary">Forgot Password?</Link>
              <Link to="/student/signup" className="text-primary">Sign Up</Link>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-white/85">← Back to Website</Link>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
