import re

path = 'src/pages/AdminPanel.tsx'
with open(path, 'r') as f:
    lines = f.readlines()

issues = []
for i, line in enumerate(lines):
    if re.search(r"method:\s*'(POST|PUT|DELETE)'", line):
        window_start = max(0, i - 15)
        window = ''.join(lines[window_start:i+3])
        if 'csrf' not in window.lower() and 'getAuthHeader' not in window:
            issues.append((i + 1, line.strip()))

if issues:
    print(f"Found {len(issues)} potentially unprotected call(s):")
    for ln, txt in issues:
        print(f"  Line {ln}: {txt}")
else:
    print("No unprotected POST/PUT/DELETE calls found nearby CSRF-free windows.")
