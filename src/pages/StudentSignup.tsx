import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import apiClient from "@/lib/apiClient";

const StudentSignup = () => {
  const navigate = useNavigate();
  const [indexNumber, setIndexNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const handleSignUp = async () => {
    const errs: string[] = [];
    if (!indexNumber.trim()) errs.push("Index number is required");
    if (!phone.trim()) errs.push("Phone number is required");
    if (!password.trim()) errs.push("Password is required");
    if (errs.length) { setErrors(errs); return; }

    try {
      await apiClient.studentSignup({ indexNumber, phone, password });
      toast.success("Sign up successful! Welcome.");
      navigate("/student");
    } catch (err: any) {
      if (err.message === "exists_password_mismatch") setErrors(["Index number already registered. Use login instead."]);
      else setErrors([err.message || "Error"]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Student Sign Up</h1>
          <p className="text-sm text-muted-foreground">Register with your index number</p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border">
          {errors.length > 0 && (
            <div className="mb-3 bg-destructive/10 border border-destructive/20 rounded p-2">
              {errors.map((e, i) => <div key={i} className="text-xs text-destructive">{e}</div>)}
            </div>
          )}
          <div className="space-y-3">
            <input value={indexNumber} onChange={(e) => setIndexNumber(e.target.value)} placeholder="Index number" className="w-full px-3 py-2 border rounded" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="w-full px-3 py-2 border rounded" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (4 digits)" className="w-full px-3 py-2 border rounded" />
            <Button variant="gold" className="w-full" onClick={handleSignUp}>Sign Up</Button>
            <div className="text-sm text-center mt-2">
              <Link to="/student/login" className="text-primary">Already registered? Log in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;
