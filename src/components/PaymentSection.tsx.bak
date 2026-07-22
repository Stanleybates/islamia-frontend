import { Smartphone, Building2, CreditCard, ShieldCheck, Lock, Loader2, XCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiUrl } from '@/lib/apiClient';
import { toast } from 'sonner';
import { formatSemesterDate, readSemesterSettings, writeSemesterSettings } from '@/lib/semester-settings';

type PayStatus = 'idle' | 'processing' | 'failed';

const PaymentSection = () => {
  const [status, setStatus] = useState<PayStatus>('idle');
  const [activeMethod, setActiveMethod] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fee, setFee] = useState<number | null>(null);
  const [semester, setSemester] = useState<string | null>(null);
  const [admissionStart, setAdmissionStart] = useState<string | null>(null);
  const [admissionEnd, setAdmissionEnd] = useState<string | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [admissionId, setAdmissionId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [lookupMsg, setLookupMsg] = useState('');
  const [isApproved, setIsApproved] = useState(false);

  const loadSettings = () => {
    console.log('Fetching settings from:', apiUrl('/api/admin/settings'));
    const cached = readSemesterSettings();
    if (cached.semester) setSemester(cached.semester);
    if (cached.fee) setFee(Number(cached.fee));
    if (cached.admissionStart) setAdmissionStart(cached.admissionStart);
    if (cached.admissionEnd) setAdmissionEnd(cached.admissionEnd);
      fetch(apiUrl('/api/admin/settings'))
      .then(r => r.json())
      .then(d => {
        if (d.fee) setFee(Number(d.fee));
        if (d.semester) setSemester(d.semester);
        if (d.admissionStart || d.admission_start || d.semesterStart || d.semester_start) setAdmissionStart(d.admissionStart || d.admission_start || d.semesterStart || d.semester_start);
        if (d.admissionEnd || d.admission_end || d.semesterEnd || d.semester_end) setAdmissionEnd(d.admissionEnd || d.admission_end || d.semesterEnd || d.semester_end);
        writeSemesterSettings({
          semester: d.semester || cached.semester,
          fee: Number(d.fee || cached.fee),
          admissionStart: d.admissionStart || d.admission_start || d.semesterStart || d.semester_start || cached.admissionStart,
          admissionEnd: d.admissionEnd || d.admission_end || d.semesterEnd || d.semester_end || cached.admissionEnd,
        });
      })
      .catch((e) => { console.error('Settings fetch error:', e); })
      .finally(() => setLoadingSettings(false));
  };

  useEffect(() => {
    loadSettings();
    const interval = setInterval(loadSettings, 30000);
    // Auto-fill from payment link (?code=...)
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      setAdmissionId(code.toUpperCase());
      lookupAdmission(code);
    }
    return () => clearInterval(interval);
  }, []);

  const methods = [
    { icon: Smartphone, title: 'Pay with Mobile Money', subtitle: 'MTN - Vodafone - AirtelTigo', channel: 'Mobile Money' },
    { icon: CreditCard, title: 'Pay with Card', subtitle: 'Visa - Mastercard - Verve', channel: 'Card' },
    { icon: Building2, title: 'Pay with Bank Transfer', subtitle: 'Direct bank account transfer', channel: 'Bank Transfer' },
  ];

  const lookupAdmission = async (code: string) => {
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
  };

  const handlePay = async (method: string, channel: string) => {
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
  };

  const reset = () => {
    setStatus('idle');
    setActiveMethod(null);
    setErrorMsg(null);
  };

  if (loadingSettings) {
    return (
      <section id="payments" className="section-padding bg-muted/40">
        <div className="container-max flex justify-center py-20">
          <Loader2 size={36} className="animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (!fee || !semester) {
    return (
      <section id="payments" className="section-padding bg-muted/40">
        <div className="container-max">
          <div className="max-w-md mx-auto bg-card rounded-2xl shadow-2xl border border-border p-10 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock size={32} className="text-primary" />
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground">Payment Not Yet Available</h2>
            <p className="text-sm text-muted-foreground">Semester fee will be notified after admission, and the amount will depend on the semester you are in. Please check back later.</p>
            <button onClick={() => { setLoadingSettings(true); loadSettings(); }} className="text-sm text-primary underline mt-2">Refresh</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="payments" className="section-padding bg-muted/40">
      <div className="container-max">
        <div className="text-center mb-10">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Payment</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Secure Checkout via Paystack
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Application is <span className="font-semibold text-primary">FREE</span>. After admission, the semester fee will be notified, and the amount will depend on the semester you are in.
          </p>
          <p className="text-xs text-muted-foreground mt-1">Current Semester: <span className="font-semibold text-foreground">{semester}</span></p>
          <p className="text-xs text-muted-foreground mt-1">
            Admission Starts: <span className="font-semibold text-foreground">{formatSemesterDate(admissionStart || '')}</span>
            <span className="mx-2">•</span>
            Admission Ends: <span className="font-semibold text-foreground">{formatSemesterDate(admissionEnd || '')}</span>
          </p>
        </div>

        <div className="max-w-md mx-auto bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
          <div className="bg-muted/50 px-6 py-5 border-b border-border">
            <p className="text-[11px] font-bold tracking-widest text-green-600 mb-2">PAYSTACK CHECKOUT</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pay <span className="font-semibold text-foreground">GHS {fee}.00</span> to <span className="font-semibold text-foreground">Allahul Mustaan Institute</span>
            </p>
          </div>

          {status === 'idle' && (
            <div className="px-6 py-4 space-y-3 border-b border-border">
              <div>
                <input value={admissionId} onChange={e => { const v = e.target.value.toUpperCase(); setAdmissionId(v); setLookupMsg(''); setIsApproved(false); if (v.length >= 8) lookupAdmission(v); }} placeholder="Admission ID (e.g. APP-XXXXXX)" type="text" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background" />
                {lookupMsg && <p className={'text-xs mt-1 ' + (isApproved ? 'text-green-600' : 'text-destructive')}>{lookupMsg}</p>}
              </div>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address (auto-filled)" type="email" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background" />
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" type="tel" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background" />
            </div>
          )}

          {status === 'idle' && (
            <div className="divide-y divide-border">
              {methods.map((m) => (
                <button key={m.title} type="button" onClick={() => handlePay(m.title, m.channel)}
                  className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-muted/40 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground/70 group-hover:bg-primary/10 group-hover:text-primary transition-colors flex-shrink-0">
                    <m.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm sm:text-base">{m.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.subtitle}</p>
                  </div>
                  <span className="text-muted-foreground text-lg">›</span>
                </button>
              ))}
            </div>
          )}

          {status === 'processing' && (
            <div className="px-6 py-12 flex flex-col items-center gap-4 text-center">
              <Loader2 size={44} className="text-primary animate-spin" />
              <div>
                <p className="font-semibold text-foreground">Redirecting to Paystack...</p>
                <p className="text-xs text-muted-foreground mt-1">{activeMethod} - Please wait</p>
              </div>
              <p className="text-[11px] text-muted-foreground">Do not close this window.</p>
            </div>
          )}

          {status === 'failed' && (
            <div className="px-6 py-10 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <XCircle size={36} className="text-red-600" />
              </div>
              <div>
                <p className="font-heading text-xl font-bold text-foreground">Payment Failed</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-[280px]">{errorMsg ?? 'Something went wrong.'}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => activeMethod && handlePay(activeMethod, '')} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">Try Again</button>
                <button type="button" onClick={reset} className="px-5 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors">Choose Another Method</button>
              </div>
            </div>
          )}

          <div className="px-6 py-5 bg-background border-t border-border flex flex-col items-center gap-4">
            {status === 'idle' && (
              <button type="button" onClick={reset} className="px-5 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors">Cancel Payment</button>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock size={12} />
              <span>Secured by <span className="font-bold text-foreground">paystack</span></span>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto mt-6 bg-card border border-border rounded-xl p-4 flex items-start gap-3">
          <ShieldCheck size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            All transactions are PCI-DSS compliant and 256-bit SSL encrypted. After successful payment, your unique Index Number is generated automatically.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;
