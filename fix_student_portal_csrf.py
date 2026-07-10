path = 'src/pages/StudentPortal.tsx'

with open(path, 'r') as f:
    content = f.read()

patches = []

patches.append((
    "import { apiUrl } from '@/lib/apiClient';",
    "import { apiUrl } from '@/lib/apiClient';\nimport { getCsrfToken } from '@/lib/csrf';"
))

patches.append((
    """      const res = await fetch(apiUrl('/api/auth/forgot'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: forgotPhone }),
      });""",
    """      const csrfToken = await getCsrfToken();
      const res = await fetch(apiUrl('/api/auth/forgot'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
        body: JSON.stringify({ phone: forgotPhone }),
      });"""
))

patches.append((
    """      const res = await fetch(apiUrl('/api/student/change-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({
          currentPassword: securityForm.currentPassword,
          newPassword: securityForm.newPassword,
        }),
      });""",
    """      const csrfToken = await getCsrfToken();
      const res = await fetch(apiUrl('/api/student/change-password'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token, 'x-csrf-token': csrfToken },
        body: JSON.stringify({
          currentPassword: securityForm.currentPassword,
          newPassword: securityForm.newPassword,
        }),
      });"""
))

patches.append((
    """                      await fetch(apiUrl('/api/student/notifications/read-all'), {
                        method: 'PUT',
                        headers: { Authorization: 'Bearer ' + token },
                      });""",
    """                      const csrfToken = await getCsrfToken();
                      await fetch(apiUrl('/api/student/notifications/read-all'), {
                        method: 'PUT',
                        credentials: 'include',
                        headers: { Authorization: 'Bearer ' + token, 'x-csrf-token': csrfToken },
                      });"""
))

patches.append((
    """                        await fetch(apiUrl(`/api/student/notifications/${n.id}/read`), {
                          method: 'PUT',
                          headers: { Authorization: 'Bearer ' + token },
                        });""",
    """                        const csrfToken = await getCsrfToken();
                        await fetch(apiUrl(`/api/student/notifications/${n.id}/read`), {
                          method: 'PUT',
                          credentials: 'include',
                          headers: { Authorization: 'Bearer ' + token, 'x-csrf-token': csrfToken },
                        });"""
))

applied = 0
skipped = 0
missing = 0
for old, new in patches:
    if new in content:
        skipped += 1
        continue
    if old in content:
        content = content.replace(old, new, 1)
        applied += 1
    else:
        missing += 1
        print("NOT FOUND:", old[:70])

with open(path, 'w') as f:
    f.write(content)

print(f"Applied: {applied}, Already patched: {skipped}, Not found: {missing}")
