path = 'src/pages/StudentPortal.tsx'

with open(path, 'r') as f:
    content = f.read()

old = """                    const method = course.enrolled ? 'DELETE' : 'POST';
                    try {
                      const res = await fetch(apiUrl(`/api/student/courses/${course.id}/enroll`), {
                        method,
                        headers: { Authorization: 'Bearer ' + token },
                      });"""

new = """                    const method = course.enrolled ? 'DELETE' : 'POST';
                    try {
                      const csrfToken = await getCsrfToken();
                      const res = await fetch(apiUrl(`/api/student/courses/${course.id}/enroll`), {
                        method,
                        credentials: 'include',
                        headers: { Authorization: 'Bearer ' + token, 'x-csrf-token': csrfToken },
                      });"""

if new in content:
    print("Already patched, skipping")
elif old in content:
    content = content.replace(old, new, 1)
    with open(path, 'w') as f:
        f.write(content)
    print("Patched: added CSRF token to enroll/unenroll action")
else:
    print("Pattern not found — check manually")
