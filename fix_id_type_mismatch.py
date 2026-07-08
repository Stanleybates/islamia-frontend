path = 'src/pages/AdminPanel.tsx'

with open(path, 'r') as f:
    content = f.read()

old = "x.id === updated.id"
new = "String(x.id) === String(updated.id)"

count = content.count(old)
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print(f"Replaced {count} occurrence(s) of 'x.id === updated.id' with string-safe comparison")
