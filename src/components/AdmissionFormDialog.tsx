import { useState } from "react";
import { X, GraduationCap, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface AdmissionFormDialogProps {
  open: boolean;
  onClose: () => void;
}

const semesters = ["Semester 1 (Foundation)", "Semester 2 (Intermediate)", "Semester 3 (Advanced)", "Semester 4 (Specialization)"];
const languageOptions = ["English", "Twi", "Hausa", "French", "Arabic"];

const WHATSAPP_NUMBER = "233550545403";

const AdmissionFormDialog = ({ open, onClose }: AdmissionFormDialogProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [assignedRegNumber, setAssignedRegNumber] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    whatsapp: "",
    dateOfBirth: "",
    gender: "",
    country: "",
    city: "",
    previousEducation: "",
    languages: [] as string[],
    arabicLevel: "",
    semester: "",
    motivation: "",
    agreeTerms: false,
  });

  if (!open) return null;

  const updateField = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    }
  };

  const toggleLanguage = (lang: string) => {
    const current = formData.languages;
    if (current.includes(lang)) {
      updateField("languages", current.filter((l) => l !== lang));
    } else {
      updateField("languages", [...current, lang]);
    }
  };

  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email format";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.country.trim()) errors.country = "Country is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    if (!formData.arabicLevel) errors.arabicLevel = "Arabic level is required";
    if (!formData.semester) errors.semester = "Preferred semester is required";
    if (!formData.motivation.trim()) errors.motivation = "Motivation is required";
    if (formData.languages.length === 0) errors.languages = "Select at least one language";
    if (!formData.agreeTerms) errors.agreeTerms = "You must agree to the terms";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    try {
      const appId = `APP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp || null,
        date_of_birth: formData.dateOfBirth || null,
        gender: formData.gender || null,
        country: formData.country || null,
        city: formData.city || null,
        previous_education: formData.previousEducation || null,
        languages: formData.languages.join(", "),
        arabic_level: formData.arabicLevel,
        semester: formData.semester,
        motivation: formData.motivation || null,
        status: "pending",
        application_code: appId,
      };

      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(apiUrl + '/api/auth/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to submit application');
      }

      setAssignedRegNumber(appId);
      setStep(3);
    } catch (err: any) {
      toast.error("Could not submit application", { description: err?.message ?? "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none";
  const errorClass = "text-xs text-destructive mt-1";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl border border-border shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-down">
        <div className="sticky top-0 bg-card border-b border-border p-5 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <GraduationCap size={22} />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground">Admission Application</h2>
              <p className="text-xs text-muted-foreground">Step {Math.min(step, 2)} of 2</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="w-full h-1.5 bg-muted">
          <div className="h-full gradient-gold transition-all duration-500" style={{ width: step === 1 ? "50%" : "100%" }} />
        </div>

        <div className="p-5 sm:p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-heading text-base font-semibold text-foreground">Personal Information</h3>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Full Name *</label>
                <input type="text" value={formData.fullName} onChange={(e) => updateField("fullName", e.target.value)} className={inputClass} placeholder="Enter your full name" />
                {formErrors.fullName && <p className={errorClass}>{formErrors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} className={inputClass} placeholder="email@example.com" />
                  {formErrors.email && <p className={errorClass}>{formErrors.email}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Phone *</label>
                  <input type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} className={inputClass} placeholder="+233 XX XXX XXXX" />
                  {formErrors.phone && <p className={errorClass}>{formErrors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">WhatsApp Number</label>
                <div className="relative">
                  <MessageCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="tel" value={formData.whatsapp} onChange={(e) => updateField("whatsapp", e.target.value)} className={`${inputClass} pl-10`} placeholder="+233 55 054 5403" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Date of Birth *</label>
                  <input type="date" value={formData.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} className={inputClass} />
                  {formErrors.dateOfBirth && <p className={errorClass}>{formErrors.dateOfBirth}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Gender *</label>
                  <select value={formData.gender} onChange={(e) => updateField("gender", e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {formErrors.gender && <p className={errorClass}>{formErrors.gender}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Country *</label>
                  <input type="text" value={formData.country} onChange={(e) => updateField("country", e.target.value)} className={inputClass} placeholder="Ghana" />
                  {formErrors.country && <p className={errorClass}>{formErrors.country}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">City</label>
                  <input type="text" value={formData.city} onChange={(e) => updateField("city", e.target.value)} className={inputClass} placeholder="Accra" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Previous Education</label>
                <input type="text" value={formData.previousEducation} onChange={(e) => updateField("previousEducation", e.target.value)} className={inputClass} placeholder="e.g. Senior High School, University..." />
              </div>

              <Button variant="default" className="w-full mt-2" disabled={false} onClick={() => { if (validateStep1()) setStep(2); }}>
                Continue to Program Selection
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-heading text-base font-semibold text-foreground">Program & Motivation</h3>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Languages You Speak *</label>
                <div className="flex flex-wrap gap-2">
                  {languageOptions.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        formData.languages.includes(lang)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                {formErrors.languages && <p className={errorClass}>{formErrors.languages}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Current Arabic Level *</label>
                <select value={formData.arabicLevel} onChange={(e) => updateField("arabicLevel", e.target.value)} className={inputClass}>
                  <option value="">Select your level</option>
                  <option value="Absolute Beginner">Absolute Beginner (No prior knowledge)</option>
                  <option value="Beginner">Beginner (Can read Arabic letters)</option>
                  <option value="Intermediate">Intermediate (Basic conversation skills)</option>
                  <option value="Advanced">Advanced (Can read classical texts)</option>
                </select>
                {formErrors.arabicLevel && <p className={errorClass}>{formErrors.arabicLevel}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Preferred Semester *</label>
                <select value={formData.semester} onChange={(e) => updateField("semester", e.target.value)} className={inputClass}>
                  <option value="">Select semester</option>
                  {semesters.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {formErrors.semester && <p className={errorClass}>{formErrors.semester}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Why do you want to learn Arabic? *</label>
                <textarea value={formData.motivation} onChange={(e) => updateField("motivation", e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="Share your motivation for learning Arabic..." />
                {formErrors.motivation && <p className={errorClass}>{formErrors.motivation}</p>}
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.agreeTerms} onChange={(e) => updateField("agreeTerms", e.target.checked)} className="mt-1 rounded border-border text-primary focus:ring-primary" />
                <span className="text-sm text-muted-foreground">
                  I agree to the terms and conditions and confirm that all information provided is accurate. *
                </span>
              </label>
              {formErrors.agreeTerms && <p className={errorClass}>{formErrors.agreeTerms}</p>}

              <div className="flex gap-3 mt-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                <Button variant="default" className="flex-1" disabled={loading} onClick={handleSubmit}>
                  {loading ? (<><Loader2 size={16} className="animate-spin" />Submitting...</>) : "Submit Application"}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <GraduationCap size={32} />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">Application Submitted!</h3>
              <div className="bg-primary/10 rounded-lg p-4 mb-4">
                <p className="text-xs text-muted-foreground mb-1">Your Application ID</p>
                <p className="font-heading text-2xl font-bold text-primary">{assignedRegNumber}</p>
              </div>
              <p className="text-muted-foreground text-sm mb-2">
                Jazāk Allāhu Khayran for applying to Allāhul Musta'ān Institute.
              </p>
              <p className="text-muted-foreground text-sm mb-4">
                Your application is FREE and now under review. After admission, the semester fee will be notified, and the fee amount will depend on the semester you are in.
              </p>
              <div className="bg-muted rounded-lg p-3 mb-4 text-xs text-muted-foreground text-left">
                <p className="font-semibold text-foreground mb-1">Next Steps:</p>
                <p>1. Application review (FREE)</p>
                <p>2. Semester fee will be notified after admission</p>
                <p>3. Receive Index Number & student portal login</p>
              </div>
              <div className="mb-6">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Assalamu Alaikum, I just submitted my application to Allāhul Musta'ān Institute. My Application ID is " + assignedRegNumber + ". Please assist me.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                >
                  <MessageCircle size={16} />
                  Chat with us on WhatsApp
                </a>
              </div>
              <Button variant="default" onClick={onClose}>Close</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdmissionFormDialog;
