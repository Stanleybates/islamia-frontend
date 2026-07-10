files = ['src/pages/AdminForgot.tsx', 'src/pages/StudentForgot.tsx']

for path in files:
    with open(path, 'r') as f:
        content = f.read()

    old_import = "import { apiUrl } from '@/lib/apiClient';"
    new_import = "import { apiUrl } from '@/lib/apiClient';\nimport { getCsrfToken } from '@/lib/csrf';"

    old_fetch = """      const res = await fetch(apiUrl('/api/admin/forgot'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });""" if 'Admin' in path else """      const res = await fetch(apiUrl('/api/auth/forgot'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });"""

    endpoint = '/api/admin/forgot' if 'Admin' in path else '/api/auth/forgot'
    new_fetch = f"""      const csrfToken = await getCsrfToken();
      const res = await fetch(apiUrl('{endpoint}'), {{
        method: 'POST',
        credentials: 'include',
        headers: {{ 'Content-Type': 'application/json', 'x-csrf-token': csrfToken }},
        body: JSON.stringify({{ phone }}),
      }});"""

    changed = False
    if new_import not in content and old_import in content:
        content = content.replace(old_import, new_import, 1)
        changed = True
    if new_fetch not in content and old_fetch in content:
        content = content.replace(old_fetch, new_fetch, 1)
        changed = True

    with open(path, 'w') as f:
        f.write(content)

    print(f"{path}: {'patched' if changed else 'no changes / already patched'}")
