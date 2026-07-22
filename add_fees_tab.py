#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/pages/StudentPortal.tsx")

# 1. Add icon import
OLD_IMPORT = 'import { BookOpen, GraduationCap, Bell, User, LogOut, Home, Clock, Award, Eye, EyeOff, KeyRound, Phone, ClipboardList, FileText, CheckCircle2 } from "lucide-react";'
NEW_IMPORT = 'import { BookOpen, GraduationCap, Bell, User, LogOut, Home, Clock, Award, Eye, EyeOff, KeyRound, Phone, ClipboardList, FileText, CheckCircle2, CreditCard } from "lucide-react";'

# 2. Add tab entry
OLD_TABS = '            { key: "courses", label: "My Courses", icon: BookOpen },'
NEW_TABS = '''            { key: "courses", label: "My Courses", icon: BookOpen },
            { key: "fees", label: "Fees", icon: CreditCard },'''

# 3. Add state + fetch. Insert right after the tabs array/render block ends but before "activeTab === dashboard" so it's available everywhere. Simpler: add state near component top via a distinct existing anchor.
OLD_STATE_ANCHOR = "const StudentPortal = () => {"
NEW_STATE_ANCHOR = """const StudentPortal = () => {
  const [feeStatus, setFeeStatus] = useState<{ semester: string | null; fee: number | null; alreadyPaid: boolean } | null>(null);
  const [feePaying, setFeePaying] = useState(false);

  const loadFeeStatus = async () => {
    try {
      const s = JSON.parse(localStorage.getItem('ami_student_session') || '{}');
      const token = s?.token;
      const res = await fetch(apiUrl('/api/student/fee-status'), { headers: { Authorization: 'Bearer ' + token } });
      if (res.ok) setFeeStatus(await res.json());
    } catch (e) { console.error('Fee status fetch error:', e); }
  };

  const handlePayFee = async () => {
    setFeePaying(true);
    try {
      const s = JSON.parse(localStorage.getItem('ami_student_session') || '{}');
      const indexNumber = s?.index_number || s?.indexNumber || s?.regNumber;
      const res = await fetch(apiUrl('/api/payment/initialize-continuing'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ indexNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to start payment');
      window.location.href = data.authorization_url;
    } catch (e: any) {
      toast.error(e.message || 'Could not start payment');
      setFeePaying(false);
    }
  };
"""

# 4. Fetch fee status on mount alongside other loads. Insert a useEffect near existing one that loads dashboard data.
OLD_EFFECT_ANCHOR = "  useEffect(() => {\n    const s = JSON.parse(localStorage.getItem('ami_student_session') || '{}');"
NEW_EFFECT_ANCHOR = """  useEffect(() => {
    loadFeeStatus();
  }, []);

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem('ami_student_session') || '{}');"""

# 5. Add the Fees tab content, right before the assessments tab
OLD_ASSESS = '        {activeTab === "assessments" && ('
NEW_ASSESS = '''        {activeTab === "fees" && (
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-heading text-lg font-semibold text-foreground mb-1">Semester Fee</h3>
              {!feeStatus ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : feeStatus.semester === 'Graduated' ? (
                <p className="text-sm text-muted-foreground">You have graduated - no further semester fees apply.</p>
              ) : !feeStatus.semester ? (
                <p className="text-sm text-muted-foreground">No active semester found on your account.</p>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm space-y-1">
                    <p><span className="font-medium text-foreground">Current Semester:</span> {feeStatus.semester}</p>
                    <p><span className="font-medium text-foreground">Fee:</span> {feeStatus.fee != null ? `GHS ${feeStatus.fee}` : 'Not yet set by the institute'}</p>
                    <p><span className="font-medium text-foreground">Status:</span>{" "}
                      <span className={feeStatus.alreadyPaid ? "text-green-600" : "text-amber-600"}>
                        {feeStatus.alreadyPaid ? "Paid" : "Not Paid"}
                      </span>
                    </p>
                  </div>
                  {!feeStatus.alreadyPaid && feeStatus.fee != null && (
                    <Button variant="gold" onClick={handlePayFee} disabled={feePaying}>
                      {feePaying ? 'Opening checkout...' : `Pay GHS ${feeStatus.fee} Now`}
                    </Button>
                  )}
                  {feeStatus.alreadyPaid && (
                    <p className="text-sm text-green-600">You're all set - you can register for your courses in the "My Courses" tab.</p>
                  )}
                  {!feeStatus.alreadyPaid && (
                    <p className="text-xs text-muted-foreground">You must pay this fee before you can register for courses this semester.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "assessments" && ('''

def patch(text, old, new, label):
    if new in text:
        return text, False
    if old not in text:
        print(f"WARNING: could not find block for {label}")
        return text, False
    return text.replace(old, new, 1), True

def main():
    text = FILE_PATH.read_text()
    if "feeStatus" in text and OLD_STATE_ANCHOR + "\n  const [feeStatus" not in text:
        # rough guard; proceed anyway checking each block individually below
        pass

    backup = FILE_PATH.with_suffix(".tsx.bak")
    shutil.copy(FILE_PATH, backup)
    print(f"Backup saved to {backup}")

    any_change = False
    for old, new, label in [
        (OLD_IMPORT, NEW_IMPORT, "icon import"),
        (OLD_TABS, NEW_TABS, "tab entry"),
        (OLD_STATE_ANCHOR, NEW_STATE_ANCHOR, "state + handlers"),
        (OLD_EFFECT_ANCHOR, NEW_EFFECT_ANCHOR, "fetch on mount"),
        (OLD_ASSESS, NEW_ASSESS, "Fees tab content"),
    ]:
        text, changed = patch(text, old, new, label)
        if changed:
            any_change = True
            print(f"Patched: {label}")

    if any_change:
        FILE_PATH.write_text(text)
        print("File saved.")
    else:
        print("No changes made - check warnings above.")

if __name__ == "__main__":
    main()
