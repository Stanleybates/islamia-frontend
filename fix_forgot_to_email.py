#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/pages/StudentPortal.tsx")

OLD1 = "const [forgotPhone, setForgotPhone] = useState(\"\");"
NEW1 = "const [forgotEmail, setForgotEmail] = useState(\"\");"

OLD2 = """        body: JSON.stringify({ phone: forgotPhone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Phone number not found');
      incrementResetAttempts();
      toast.success('A temporary password has been sent to your email. Use it to log in, then change your password inside the portal.');
      setForgotMode(false);
      setResetStep('request');
      setForgotPhone('');
    } catch (e: any) { toast.error(e.message || 'Phone number not found'); }"""

NEW2 = """        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Email not found');
      incrementResetAttempts();
      toast.success('A temporary password has been sent to your email. Use it to log in, then change your password inside the portal.');
      setForgotMode(false);
      setResetStep('request');
      setForgotEmail('');
    } catch (e: any) { toast.error(e.message || 'Email not found'); }"""

OLD3 = """                <p className="text-sm text-muted-foreground mb-6">
                  Enter your registered phone number. A temporary password will be sent to your email.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input value={forgotPhone} onChange={(e) => setForgotPhone(e.target.value)} className={`${inputClass} pl-10`} placeholder="+233 XX XXX XXXX" type="tel" />
                    </div>
                  </div>"""

NEW3 = """                <p className="text-sm text-muted-foreground mb-6">
                  Enter your registered email address. A temporary password will be sent to it.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Email Address</label>
                    <div className="relative">
                      <input value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className={inputClass} placeholder="you@example.com" type="email" />
                    </div>
                  </div>"""

def main():
    text = FILE_PATH.read_text()
    if "forgotEmail" in text and OLD1 not in text:
        print("Already applied. Nothing to do.")
        return

    backup = FILE_PATH.with_suffix(".tsx.bak")
    shutil.copy(FILE_PATH, backup)
    print(f"Backup saved to {backup}")

    changed = False
    for old, new, label in [(OLD1, NEW1, "state var"), (OLD2, NEW2, "fetch body/success"), (OLD3, NEW3, "form UI")]:
        if old in text:
            text = text.replace(old, new, 1)
            changed = True
            print(f"Patched: {label}")
        else:
            print(f"WARNING: could not find block for {label}")

    if changed:
        FILE_PATH.write_text(text)
        print("File saved.")

if __name__ == "__main__":
    main()
