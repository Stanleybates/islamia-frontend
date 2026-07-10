path = 'src/components/AdmissionFormDialog.tsx'

with open(path, 'r') as f:
    content = f.read()

patches = []

patches.append((
    'import { formatSemesterDate, readSemesterSettings } from "@/lib/semester-settings";',
    'import { formatSemesterDate, readSemesterSettings } from "@/lib/semester-settings";\nimport { getCsrfToken } from "@/lib/csrf";'
))

patches.append((
    """      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(apiUrl + '/api/auth/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });""",
    """      const apiUrl = import.meta.env.VITE_API_URL || '';
      const csrfToken = await getCsrfToken();
      const res = await fetch(apiUrl + '/api/auth/apply', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
        body: JSON.stringify(payload),
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
