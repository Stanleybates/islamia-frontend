import re

path = 'src/pages/AdminPanel.tsx'

with open(path, 'r') as f:
    content = f.read()

old_fn = """  const getAuthHeader = () => {
    try {
      const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
      const token = s?.token; return token ? { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
    } catch { return { 'Content-Type': 'application/json' }; }
  };"""

new_fn = """  const getAuthHeader = async () => {
    const csrfToken = await getCsrfToken();
    try {
      const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
      const token = s?.token;
      const base: Record<string, string> = { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken };
      return token ? { ...base, Authorization: 'Bearer ' + token } : base;
    } catch { return { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken }; }
  };"""

if new_fn in content:
    print("getAuthHeader already patched, skipping function replace")
elif old_fn in content:
    content = content.replace(old_fn, new_fn)
    print("Patched getAuthHeader to be async and include CSRF token")
else:
    print("WARNING: getAuthHeader pattern not found — check manually")

content, n1 = re.subn(r'(?<!await )getAuthHeader\(\)', 'await getAuthHeader()', content)
print(f"Updated {n1} call site(s) to await getAuthHeader()")

with open(path, 'w') as f:
    f.write(content)

print("Done. File saved.")
