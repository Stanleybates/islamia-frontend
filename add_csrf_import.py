path = 'src/pages/AdminPanel.tsx'

with open(path, 'r') as f:
    content = f.read()

old = 'import { apiUrl } from "@/lib/apiClient";'
new = 'import { apiUrl } from "@/lib/apiClient";\nimport { getCsrfToken } from "@/lib/csrf";'

if new in content:
    print("Import already present, skipping")
elif old in content:
    content = content.replace(old, new, 1)
    with open(path, 'w') as f:
        f.write(content)
    print("Added getCsrfToken import")
else:
    print("Pattern not found — check file manually")
