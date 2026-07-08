path = 'src/pages/AdminPanel.tsx'

with open(path, 'r') as f:
    content = f.read()

patches = []

patches.append((
    'const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };',
    'const csrfToken = await getCsrfToken();\n    const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}`, \'x-csrf-token\': csrfToken };'
))

patches.append((
    """      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(apiUrl('/api/admin/courses'), { method: 'POST', headers, body: JSON.stringify({ title: newCourse.title, semester: newCourse.semester, status: 'Upcoming' }) });""",
    """      const csrfToken = await getCsrfToken();
      const headers: any = { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(apiUrl('/api/admin/courses'), { method: 'POST', headers, body: JSON.stringify({ title: newCourse.title, semester: newCourse.semester, status: 'Upcoming' }) });"""
))

patches.append((
    """                            const res = await fetch(apiUrl('/api/admin/schedule'), {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s?.token },
                              body: JSON.stringify(newSchedule),
                            });""",
    """                            const csrfToken = await getCsrfToken();
                            const res = await fetch(apiUrl('/api/admin/schedule'), {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s?.token, 'x-csrf-token': csrfToken },
                              body: JSON.stringify(newSchedule),
                            });"""
))

patches.append((
    """                        const headers: any = { 'Content-Type': 'application/json' };
                        if (token) headers['Authorization'] = `Bearer ${token}`;
                        const res = await fetch(apiUrl('/api/admin/signup'), {
                          method: 'POST',
                          headers,
                          body: JSON.stringify({ username: newStaff.name, email: newStaff.email, phone: newStaff.contact, password: newStaff.course, confirmPassword: newStaff.department }),
                        });""",
    """                        const csrfToken = await getCsrfToken();
                        const headers: any = { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken };
                        if (token) headers['Authorization'] = `Bearer ${token}`;
                        const res = await fetch(apiUrl('/api/admin/signup'), {
                          method: 'POST',
                          headers,
                          body: JSON.stringify({ username: newStaff.name, email: newStaff.email, phone: newStaff.contact, password: newStaff.course, confirmPassword: newStaff.department }),
                        });"""
))

patches.append((
    """                              const res = await fetch(apiUrl('/api/admin/exams/check-clash'), {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s?.token },
                                body: JSON.stringify({ course: newExam.course, start_time: newExam.start_time, end_time: end }),
                              });""",
    """                              const csrfToken = await getCsrfToken();
                              const res = await fetch(apiUrl('/api/admin/exams/check-clash'), {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s?.token, 'x-csrf-token': csrfToken },
                                body: JSON.stringify({ course: newExam.course, start_time: newExam.start_time, end_time: end }),
                              });"""
))

patches.append((
    """                            const headers: any = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s?.token };
                            const res = await fetch(apiUrl('/api/admin/exams'), { method: 'POST', headers, body: JSON.stringify(newExam) });""",
    """                            const csrfToken = await getCsrfToken();
                            const headers: any = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s?.token, 'x-csrf-token': csrfToken };
                            const res = await fetch(apiUrl('/api/admin/exams'), { method: 'POST', headers, body: JSON.stringify(newExam) });"""
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
        print("NOT FOUND (check manually):")
        print(old[:80] + "...")
        print()

with open(path, 'w') as f:
    f.write(content)

print(f"Applied: {applied}, Already patched: {skipped}, Not found: {missing}")
