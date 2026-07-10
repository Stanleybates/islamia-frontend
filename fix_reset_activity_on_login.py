path = 'src/pages/AdminLogin.tsx'

with open(path, 'r') as f:
    content = f.read()

old = """      await apiClient.adminLogin(email, password);
      sessionStorage.setItem('ami_admin_active', '1');"""

new = """      await apiClient.adminLogin(email, password);
      localStorage.setItem('ami_last_activity_ts', String(Date.now()));
      sessionStorage.setItem('ami_admin_active', '1');"""

if new in content:
    print("Already patched, skipping")
elif old in content:
    content = content.replace(old, new, 1)
    with open(path, 'w') as f:
        f.write(content)
    print("Patched: reset last-activity timestamp on successful login")
else:
    print("Pattern not found — check manually")
