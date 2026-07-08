path = 'src/pages/AdminPanel.tsx'

with open(path, 'r') as f:
    content = f.read()

old = """                        const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                        const headers: any = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s?.token };
                        const normalizedExamDates = normalizeExamDates(newAssessment.examDates || newAssessment.posted);"""

new = """                        const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                        const csrfToken = await getCsrfToken();
                        const headers: any = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s?.token, 'x-csrf-token': csrfToken };
                        const normalizedExamDates = normalizeExamDates(newAssessment.examDates || newAssessment.posted);"""

if new in content:
    print("Already patched, skipping")
elif old in content:
    content = content.replace(old, new, 1)
    with open(path, 'w') as f:
        f.write(content)
    print("Patched assessments POST with CSRF token")
else:
    print("Pattern not found — check manually")
