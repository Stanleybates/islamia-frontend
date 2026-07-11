path = 'src/pages/AdminForgot.tsx'
with open(path, 'r') as f:
    content = f.read()

replacements = [
    ('const [phone, setPhone] = useState("");', 'const [email, setEmail] = useState("");'),
    ('if (!phone.trim()) { setError("Please enter your phone number"); return; }',
     'if (!email.trim()) { setError("Please enter your email address"); return; }'),
    ('body: JSON.stringify({ phone }),', 'body: JSON.stringify({ email }),'),
    ('''<span className="text-3xl">📱</span>
              </div>
              <h2 className="font-bold text-foreground">Check Your SMS</h2>
              <p className="text-sm text-muted-foreground">A temporary password has been sent to <span className="font-semibold text-foreground">{phone}</span>. Use it to log in then change your password in Settings.</p>''',
     '''<span className="text-3xl">📧</span>
              </div>
              <h2 className="font-bold text-foreground">Check Your Email</h2>
              <p className="text-sm text-muted-foreground">A temporary password has been sent to <span className="font-semibold text-foreground">{email}</span>. Please check your inbox (and spam folder), then use it to log in and change your password.</p>'''),
    ('''<label className="text-sm block mb-1">Phone Number</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Your registered phone number" />''',
     '''<label className="text-sm block mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Your registered email address" />'''),
]

applied = 0
for old, new in replacements:
    if old in content:
        content = content.replace(old, new, 1)
        applied += 1
with open(path, 'w') as f:
    f.write(content)
print(f"AdminForgot.tsx: {applied}/{len(replacements)} replacements applied")

path = 'src/pages/StudentForgot.tsx'
with open(path, 'r') as f:
    content = f.read()

replacements = [
    ('const [phone, setPhone] = useState("");', 'const [email, setEmail] = useState("");'),
    ('if (!phone.trim()) { setError("Please enter your phone number"); return; }',
     'if (!email.trim()) { setError("Please enter your email address"); return; }'),
    ('body: JSON.stringify({ phone }),', 'body: JSON.stringify({ email }),'),
    ('<p className="text-sm text-muted-foreground">Enter your registered phone number</p>',
     '<p className="text-sm text-muted-foreground">Enter your registered email address</p>'),
    ('''<span className="text-3xl">📱</span>
              </div>
              <h2 className="font-bold text-foreground">Check Your SMS</h2>
              <p className="text-sm text-muted-foreground">A temporary password has been sent to <span className="font-semibold text-foreground">{phone}</span>. Use it to log in.</p>''',
     '''<span className="text-3xl">📧</span>
              </div>
              <h2 className="font-bold text-foreground">Check Your Email</h2>
              <p className="text-sm text-muted-foreground">A temporary password has been sent to <span className="font-semibold text-foreground">{email}</span>. Please check your inbox (and spam folder), then use it to log in.</p>'''),
    ('''<label className="text-sm block mb-1">Phone Number</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Your registered phone number" />''',
     '''<label className="text-sm block mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Your registered email address" />'''),
]

applied = 0
for old, new in replacements:
    if old in content:
        content = content.replace(old, new, 1)
        applied += 1
with open(path, 'w') as f:
    f.write(content)
print(f"StudentForgot.tsx: {applied}/{len(replacements)} replacements applied")
