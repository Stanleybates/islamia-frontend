path = 'src/pages/AdminPanel.tsx'

with open(path, 'r') as f:
    content = f.read()

old = '<h3 className="font-heading font-semibold text-foreground">New Exam Upload</h3>'
new = '<h3 className="font-heading font-semibold text-foreground">New Assessment</h3>'

count = content.count(old)
if count == 0:
    print("Pattern not found — check manually")
else:
    content = content.replace(old, new)
    with open(path, 'w') as f:
        f.write(content)
    print(f"Patched {count} occurrence(s): 'New Exam Upload' -> 'New Assessment'")
