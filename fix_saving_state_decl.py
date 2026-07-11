path = 'src/pages/AdminPanel.tsx'

with open(path, 'r') as f:
    content = f.read()

old = "  const [showAddAssessment, setShowAddAssessment] = useState(false);"
new = "  const [showAddAssessment, setShowAddAssessment] = useState(false);\n  const [savingAssessment, setSavingAssessment] = useState(false);"

if new in content:
    print("Already patched, skipping")
elif old in content:
    content = content.replace(old, new, 1)
    with open(path, 'w') as f:
        f.write(content)
    print("Patched: added savingAssessment state declaration")
else:
    print("Pattern not found — check manually")
