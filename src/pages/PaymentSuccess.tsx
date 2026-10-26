import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const PaymentSuccess = () => {
  const [checking, setChecking] = useState(true);
  const [status, setStatus] = useState<'checking' | 'success' | 'failed'>('checking');
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    // Call backend verify endpoint using Paystack reference in query string
    const params = new URLSearchParams(window.location.search);
    const reference = params.get('reference');
    if (!reference) {
      setInfo('Missing payment reference.');
      setStatus('failed');
      setChecking(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`/api/payment/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference }),
        });
        const data = await res.json();
        if (!res.ok) {
          setInfo(data.message || 'Verification failed');
          setStatus('failed');
        } else {
          setInfo(data.message || 'Payment verified');
          setStatus('success');
        }
      } catch (e) {
        setInfo(e instanceof Error ? e.message : 'Verification error');
        setStatus('failed');
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full bg-card rounded-2xl border border-border shadow-2xl p-10 flex flex-col items-center gap-6 text-center">
        <img src={logo} alt="Logo" className="h-14" />

        {checking ? (
          <>
            <Loader2 size={44} className="text-primary animate-spin" />
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">Confirming Payment...</h2>
              <p className="text-sm text-muted-foreground mt-1">Please wait while we verify your payment.</p>
            </div>
          </>
        ) : (
          <>
            {status === 'success' ? (
              <>
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 size={44} className="text-green-600" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground">Payment Successful!</h2>
                  <p className="text-sm text-muted-foreground mt-2">{info ?? 'Your index number has been generated and sent to your email and phone number.'}</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <CheckCircle2 size={44} className="text-red-600" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground">Payment Verification Failed</h2>
                  <p className="text-sm text-muted-foreground mt-2">{info ?? 'We could not verify your payment. If your card was charged, contact support.'}</p>
                </div>
              </>
            )}
            <div className="flex flex-col gap-3 w-full">
              <Link to="/student">
                <Button className="w-full">Go to Student Portal</Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full">Back to Home</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
