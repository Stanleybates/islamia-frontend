path = 'src/pages/AdminPanel.tsx'

with open(path, 'r') as f:
    content = f.read()

old = """      const session = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
      const token = session?.token;
      const res = await fetch(apiUrl(`/api/admin/admins/${userId}/assign-courses`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ assignedCourses }),
      });"""

new = """      const session = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
      const token = session?.token;
      const csrfToken = await getCsrfToken();
      const res = await fetch(apiUrl(`/api/admin/admins/${userId}/assign-courses`), {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify({ assignedCourses }),
      });"""

if old in content:
    content = content.replace(old, new)
    with open(path, 'w') as f:
        f.write(content)
    print("Patched assign-courses fetch call")
else:
    print("Pattern not found — check file manually")
