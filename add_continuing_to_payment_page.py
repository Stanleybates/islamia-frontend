#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/components/PaymentSection.tsx")

# 1. Add new state
OLD_STATE = "  const [isApproved, setIsApproved] = useState(false);"
NEW_STATE = """  const [isApproved, setIsApproved] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);
  const [continuingSemester, setContinuingSemester] = useState<string | null>(null);
  const [continuingFee, setContinuingFee] = useState<number | null>(null);
  const [alreadyPaidContinuing, setAlreadyPaidContinuing] = useState(false);"""

# 2. Replace lookupAdmission
OLD_LOOKUP = """  const lookupAdmission = async (code: string) => {
    if (code.length < 8) return;
    try {
      const res = await fetch(apiUrl('/api/auth/admission-lookup?code=' + encodeURIComponent(code)));
      const data = await res.json();
      if (res.ok) {
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setIsApproved(true);
        setLookupMsg('Welcome, ' + data.name + '! Details pre-filled.');
      } else {
        setEmail(''); setPhone('');
        setIsApproved(false);
        setLookupMsg(data.message || 'No approved application found.');
      }
    } catch { setLookupMsg('Could not look up Admission ID.'); }
  };"""

NEW_LOOKUP = """  const lookupAdmission = async (code: string) => {
    if (code.length < 6) return;
    try {
      const res = await fetch(apiUrl('/api/auth/admission-lookup?code=' + encodeURIComponent(code)));
      const data = await res.json();
      if (res.ok) {
        setIsContinuing(false);
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setIsApproved(true);
        setLookupMsg('Welcome, ' + data.name + '! Details pre-filled.');
        return;
      }

      // Not an application code - try it as a continuing student's index number
      const res2 = await fetch(apiUrl('/api/auth/continuing-lookup?index=' + encodeURIComponent(code)));
      const data2 = await res2.json();
      if (res2.ok) {
        setIsContinuing(true);
        setIsApproved(true);
        setContinuingSemester(data2.semester);
        setContinuingFee(data2.fee);
        setAlreadyPaidContinuing(data2.alreadyPaid);
        setLookupMsg(
          data2.alreadyPaid
            ? `Welcome back, ${data2.name}! You've already paid for ${data2.semester}.`
            : `Welcome back, ${data2.name}! Fee for ${data2.semester}: ${data2.fee != null ? 'GHS ' + data2.fee : 'not yet set'}.`
        );
        return;
      }

      setIsContinuing(false);
      setEmail(''); setPhone('');
      setIsApproved(false);
      setLookupMsg(data.message || 'No matching application or student record found.');
    } catch { setLookupMsg('Could not look up your ID.'); }
  };"""

# 3. Replace handlePay to branch for continuing students
OLD_HANDLEPAY = """  const handlePay = async (method: string, channel: string) => {
    if (!isApproved) { toast.error('Please enter a valid Admission ID first'); return; }
    if (!email.trim() || !phone.trim()) {
      toast.error('Please enter your email and phone number');
      return;
    }
    setActiveMethod(method);
    setStatus('processing');
    setErrorMsg(null);
    toast.loading('Opening secure Paystack checkout...', { id: 'pay' });
    try {
      const res = await fetch(apiUrl('/api/payment/initialize'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phoneNumber: phone, channel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Payment initialization failed');
      toast.dismiss('pay');
      window.location.href = data.authorization_url;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Payment could not be completed.';
      setErrorMsg(msg);
      setStatus('failed');
      toast.error('Payment failed', { id: 'pay', description: msg });
    }
  };"""

NEW_HANDLEPAY = """  const handlePay = async (method: string, channel: string) => {
    if (!isApproved) { toast.error('Please enter a valid Admission ID or Index Number first'); return; }

    if (isContinuing) {
      if (alreadyPaidContinuing) { toast.error('You have already paid for this semester'); return; }
      setActiveMethod(method);
      setStatus('processing');
      setErrorMsg(null);
      toast.loading('Opening secure Paystack checkout...', { id: 'pay' });
      try {
        const res = await fetch(apiUrl('/api/payment/initialize-continuing'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ indexNumber: admissionId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Payment initialization failed');
        toast.dismiss('pay');
        window.location.href = data.authorization_url;
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Payment could not be completed.';
        setErrorMsg(msg);
        setStatus('failed');
        toast.error('Payment failed', { id: 'pay', description: msg });
      }
      return;
    }

    if (!email.trim() || !phone.trim()) {
      toast.error('Please enter your email and phone number');
      return;
    }
    setActiveMethod(method);
    setStatus('processing');
    setErrorMsg(null);
    toast.loading('Opening secure Paystack checkout...', { id: 'pay' });
    try {
      const res = await fetch(apiUrl('/api/payment/initialize'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phoneNumber: phone, channel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Payment initialization failed');
      toast.dismiss('pay');
      window.location.href = data.authorization_url;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Payment could not be completed.';
      setErrorMsg(msg);
      setStatus('failed');
      toast.error('Payment failed', { id: 'pay', description: msg });
    }
  };"""

# 4. Update the fee summary banner to reflect continuing student's specific fee
OLD_BANNER = """            <p className="text-sm text-muted-foreground leading-relaxed">
              Pay <span className="font-semibold text-foreground">GHS {fee}.00</span> to <span className="font-semibold text-foreground">Allahul Mustaan Institute</span>
            </p>"""
NEW_BANNER = """            <p className="text-sm text-muted-foreground leading-relaxed">
              Pay <span className="font-semibold text-foreground">GHS {isContinuing ? (continuingFee ?? '—') : fee}.00</span> to <span className="font-semibold text-foreground">Allahul Mustaan Institute</span>
            </p>
            {isContinuing && continuingSemester && (
              <p className="text-xs text-muted-foreground mt-1">Fee shown is for your current semester: <span className="font-semibold text-foreground">{continuingSemester}</span></p>
            )}"""

# 5. Update the input form block: placeholder text + hide email/phone for continuing students
OLD_FORM = """            <div className="px-6 py-4 space-y-3 border-b border-border">
              <div>
                <input value={admissionId} onChange={e => { const v = e.target.value.toUpperCase(); setAdmissionId(v); setLookupMsg(''); setIsApproved(false); if (v.length >= 8) lookupAdmission(v); }} placeholder="Admission ID (e.g. APP-XXXXXX)" type="text" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background" />
                {lookupMsg && <p className={'text-xs mt-1 ' + (isApproved ? 'text-green-600' : 'text-destructive')}>{lookupMsg}</p>}
              </div>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address (auto-filled)" type="email" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background" />
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" type="tel" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background" />
            </div>
          )}"""

NEW_FORM = """            <div className="px-6 py-4 space-y-3 border-b border-border">
              <div>
                <input value={admissionId} onChange={e => { const v = e.target.value.toUpperCase(); setAdmissionId(v); setLookupMsg(''); setIsApproved(false); setIsContinuing(false); if (v.length >= 6) lookupAdmission(v); }} placeholder="Admission ID or Index Number" type="text" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background" />
                {lookupMsg && <p className={'text-xs mt-1 ' + (isApproved ? 'text-green-600' : 'text-destructive')}>{lookupMsg}</p>}
              </div>
              {!isContinuing && (
                <>
                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address (auto-filled)" type="email" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background" />
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" type="tel" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background" />
                </>
              )}
            </div>
          )}"""

# 6. Hide payment methods list if a continuing student has already paid
OLD_METHODS = """          {status === 'idle' && (
            <div className="divide-y divide-border">
              {methods.map((m) => ("""
NEW_METHODS = """          {status === 'idle' && isContinuing && alreadyPaidContinuing && (
            <div className="px-6 py-8 text-center text-sm text-green-600">
              You've already paid for {continuingSemester}. No further payment needed.
            </div>
          )}

          {status === 'idle' && !(isContinuing && alreadyPaidContinuing) && (
            <div className="divide-y divide-border">
              {methods.map((m) => ("""

def patch(text, old, new, label):
    if new in text:
        return text, False
    if old not in text:
        print(f"WARNING: could not find block for {label}")
        return text, False
    return text.replace(old, new, 1), True

def main():
    text = FILE_PATH.read_text()
    backup = FILE_PATH.with_suffix(".tsx.bak")
    shutil.copy(FILE_PATH, backup)
    print(f"Backup saved to {backup}")

    any_change = False
    for old, new, label in [
        (OLD_STATE, NEW_STATE, "state"),
        (OLD_LOOKUP, NEW_LOOKUP, "lookupAdmission"),
        (OLD_HANDLEPAY, NEW_HANDLEPAY, "handlePay"),
        (OLD_BANNER, NEW_BANNER, "fee banner"),
        (OLD_FORM, NEW_FORM, "form inputs"),
        (OLD_METHODS, NEW_METHODS, "payment methods gate"),
    ]:
        text, changed = patch(text, old, new, label)
        if changed:
            any_change = True
            print(f"Patched: {label}")

    if any_change:
        FILE_PATH.write_text(text)
        print("File saved.")

if __name__ == "__main__":
    main()
