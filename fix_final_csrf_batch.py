path = 'src/pages/AdminPanel.tsx'

with open(path, 'r') as f:
    content = f.read()

patches = []

patches.append((
    """      const res = await fetch(apiUrl('/api/admin/change-password'), {
        method: 'POST',                                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },            body: JSON.stringify({ currentPassword, password: newPassword }),
      });""",
    """      const csrfToken = await getCsrfToken();
      const res = await fetch(apiUrl('/api/admin/change-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token, 'x-csrf-token': csrfToken },
        body: JSON.stringify({ currentPassword, password: newPassword }),
      });"""
))
patches.append((
    """      const res = await fetch(apiUrl('/api/admin/change-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ currentPassword, password: newPassword }),
      });""",
    """      const csrfToken = await getCsrfToken();
      const res = await fetch(apiUrl('/api/admin/change-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token, 'x-csrf-token': csrfToken },
        body: JSON.stringify({ currentPassword, password: newPassword }),
      });"""
))

patches.append((
    """        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // Update application status first""",
    """        const csrfToken = await getCsrfToken();
        const headers: any = { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // Update application status first"""
))
patches.append((
    """            const headers2: any = { 'Content-Type': 'application/json' };
            if (token2) headers2['Authorization'] = `Bearer ${token2}`;
            await fetch(apiUrl('/api/admin/applications/' + parseInt(dbId)), { method: 'PUT', headers: headers2, body: JSON.stringify({ status: prevApp?.status || 'Pending' }) });""",
    """            const csrfToken2 = await getCsrfToken();
            const headers2: any = { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken2 };
            if (token2) headers2['Authorization'] = `Bearer ${token2}`;
            await fetch(apiUrl('/api/admin/applications/' + parseInt(dbId)), { method: 'PUT', headers: headers2, body: JSON.stringify({ status: prevApp?.status || 'Pending' }) });"""
))

patches.append((
    """                            const headers: any = { 'Content-Type': 'application/json' };
                            if (token) headers['Authorization'] = `Bearer ${token}`;
                            const res = await fetch(apiUrl('/api/admin/courses/' + c.id), { method: 'DELETE', headers });""",
    """                            const csrfToken = await getCsrfToken();
                            const headers: any = { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken };
                            if (token) headers['Authorization'] = `Bearer ${token}`;
                            const res = await fetch(apiUrl('/api/admin/courses/' + c.id), { method: 'DELETE', headers });"""
))

patches.append((
    """                                  const sess = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                                  await fetch(apiUrl('/api/admin/schedule/' + s.id), { method: 'DELETE', credentials: 'include', headers: { Authorization: 'Bearer ' + sess?.token } });""",
    """                                  const sess = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                                  const csrfToken = await getCsrfToken();
                                  await fetch(apiUrl('/api/admin/schedule/' + s.id), { method: 'DELETE', credentials: 'include', headers: { Authorization: 'Bearer ' + sess?.token, 'x-csrf-token': csrfToken } });"""
))

patches.append((
    """                                  const tok = JSON.parse(localStorage.getItem('ami_admin_session') || '{}')?.token;
                                  await fetch(apiUrl('/api/admin/admins/' + s.id), { method: 'DELETE', credentials: 'include', headers: { Authorization: 'Bearer ' + tok } });""",
    """                                  const tok = JSON.parse(localStorage.getItem('ami_admin_session') || '{}')?.token;
                                  const csrfToken = await getCsrfToken();
                                  await fetch(apiUrl('/api/admin/admins/' + s.id), { method: 'DELETE', credentials: 'include', headers: { Authorization: 'Bearer ' + tok, 'x-csrf-token': csrfToken } });"""
))

patches.append((
    """                                const headers: any = { Authorization: 'Bearer ' + s?.token };
                                const res = await fetch(apiUrl('/api/admin/assessments/' + a.id + '/approve'), { method: 'PUT', headers });""",
    """                                const csrfToken = await getCsrfToken();
                                const headers: any = { Authorization: 'Bearer ' + s?.token, 'x-csrf-token': csrfToken };
                                const res = await fetch(apiUrl('/api/admin/assessments/' + a.id + '/approve'), { method: 'PUT', headers });"""
))

patches.append((
    """                                const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                                await fetch(apiUrl('/api/admin/assessments/' + a.id), { method: 'DELETE', credentials: 'include', headers: { Authorization: 'Bearer ' + s?.token } });""",
    """                                const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                                const csrfToken = await getCsrfToken();
                                await fetch(apiUrl('/api/admin/assessments/' + a.id), { method: 'DELETE', credentials: 'include', headers: { Authorization: 'Bearer ' + s?.token, 'x-csrf-token': csrfToken } });"""
))

patches.append((
    """                                    const res = await fetch(apiUrl('/api/admin/exams/' + e.id + '/approve'), { method: 'PUT', credentials: 'include', headers: { Authorization: 'Bearer ' + s?.token } });""",
    """                                    const csrfToken = await getCsrfToken();
                                    const res = await fetch(apiUrl('/api/admin/exams/' + e.id + '/approve'), { method: 'PUT', credentials: 'include', headers: { Authorization: 'Bearer ' + s?.token, 'x-csrf-token': csrfToken } });"""
))

patches.append((
    """                                  const res = await fetch(apiUrl('/api/admin/exams/' + e.id), {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s?.token },
                                    body: JSON.stringify({ start_time: newStart, end_time: newEnd }),
                                  });""",
    """                                  const csrfToken = await getCsrfToken();
                                  const res = await fetch(apiUrl('/api/admin/exams/' + e.id), {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s?.token, 'x-csrf-token': csrfToken },
                                    body: JSON.stringify({ start_time: newStart, end_time: newEnd }),
                                  });"""
))

patches.append((
    """                                  const res = await fetch(apiUrl('/api/admin/exams/' + e.id), {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s?.token },
                                    body: JSON.stringify({ status: 'on_hold' }),
                                  });""",
    """                                  const csrfToken = await getCsrfToken();
                                  const res = await fetch(apiUrl('/api/admin/exams/' + e.id), {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s?.token, 'x-csrf-token': csrfToken },
                                    body: JSON.stringify({ status: 'on_hold' }),
                                  });"""
))

patches.append((
    """                                    const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                                    await fetch(apiUrl('/api/admin/exams/' + e.id), { method: 'DELETE', credentials: 'include', headers: { Authorization: 'Bearer ' + s?.token } });""",
    """                                    const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                                    const csrfToken = await getCsrfToken();
                                    await fetch(apiUrl('/api/admin/exams/' + e.id), { method: 'DELETE', credentials: 'include', headers: { Authorization: 'Bearer ' + s?.token, 'x-csrf-token': csrfToken } });"""
))

applied = 0
skipped = 0
missing = 0
missing_list = []

for old, new in patches:
    if new in content:
        skipped += 1
        continue
    if old in content:
        content = content.replace(old, new, 1)
        applied += 1
    else:
        missing += 1
        missing_list.append(old[:70])

with open(path, 'w') as f:
    f.write(content)

print(f"Applied: {applied}, Already patched: {skipped}, Not found: {missing}")
if missing_list:
    print("\nNot found (check manually):")
    for m in missing_list:
        print(" -", m, "...")
