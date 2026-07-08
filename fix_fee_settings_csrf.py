path = 'src/pages/AdminPanel.tsx'

with open(path, 'r') as f:
    content = f.read()

old = """      const endpoint = notify ? apiUrl('/api/admin/settings/notify') : apiUrl('/api/admin/settings');
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ semester, fee: Number(fee), admissionStart, admissionEnd, examWindowStart, examWindowEnd }),
      });
      const data = await res.json();
      writeSemesterSettings({ semester, fee: Number(fee), admissionStart, admissionEnd });
      setMsg(data.message);"""

new = """      const csrfToken = await getCsrfToken();
      const endpoint = notify ? apiUrl('/api/admin/settings/notify') : apiUrl('/api/admin/settings');
      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token, 'x-csrf-token': csrfToken },
        body: JSON.stringify({ semester, fee: Number(fee), admissionStart, admissionEnd, examWindowStart, examWindowEnd }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.message || 'Failed to save settings');
        return;
      }
      writeSemesterSettings({ semester, fee: Number(fee), admissionStart, admissionEnd });
      setMsg(data.message);"""

if old in content:
    content = content.replace(old, new)
    with open(path, 'w') as f:
        f.write(content)
    print("Patched fee settings save() function")
else:
    print("Pattern not found — check file manually")
