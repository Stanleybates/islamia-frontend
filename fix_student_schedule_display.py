path = 'src/pages/StudentPortal.tsx'

with open(path, 'r') as f:
    content = f.read()

patches = []

patches.append((
    '<p className="font-medium text-foreground">{s.course}</p>',
    '<p className="font-medium text-foreground">{s.course_title || s.course}</p>'
))

patches.append((
    "doc.text(`  ${s.course}`, 10, y);",
    "doc.text(`  ${s.course_title || s.course}`, 10, y);"
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
