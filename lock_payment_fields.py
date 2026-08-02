path = 'src/components/PaymentSection.tsx'
with open(path) as f:
    c = f.read()

old = """                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address (auto-filled)" type="email" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background" />
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" type="tel" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background" />"""

new = """                  <input value={email} readOnly placeholder="Email address (auto-filled)" type="email" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-muted text-muted-foreground cursor-not-allowed" />
                  <input value={phone} readOnly placeholder="Phone number" type="tel" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-muted text-muted-foreground cursor-not-allowed" />
                  <p className="text-[11px] text-muted-foreground italic">These are pulled from your approved application and can't be edited here. Contact the institute if either is wrong.</p>"""

if new in c:
    print("Already patched, skipping")
elif old in c:
    c = c.replace(old, new, 1)
    with open(path, 'w') as f:
        f.write(c)
    print("Patched: email/phone fields are now read-only on the payment page")
else:
    print("Pattern not found — paste PaymentSection.tsx again, it may have changed")
