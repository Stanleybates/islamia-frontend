path = 'src/pages/AdminPanel.tsx'

with open(path, 'r') as f:
    content = f.read()

# Try patching from the v1 version first
old_v1 = """              <div className="grid gap-3 sm:grid-cols-2">
                {courses.filter((course) => {
                  const takenByOther = adminAccounts.some(
                    (a) => a.id !== selectedAdmin.id && normalizeAssignedCourses(a.assignedCourses).includes(course.id)
                  );
                  return !takenByOther;
                }).map((course) => ("""

# Fallback: original unpatched version
old_original = """              <div className="grid gap-3 sm:grid-cols-2">
                {courses.map((course) => ("""

new = """              <div className="grid gap-3 sm:grid-cols-2">
                {courses.filter((course) => {
                  const takenByAnyone = adminAccounts.some(
                    (a) => normalizeAssignedCourses(a.assignedCourses).includes(course.id)
                  );
                  return !takenByAnyone;
                }).map((course) => ("""

if new in content:
    print("Already patched, skipping")
elif old_v1 in content:
    content = content.replace(old_v1, new, 1)
    with open(path, 'w') as f:
        f.write(content)
    print("Patched from v1 to final version (only unassigned courses show)")
elif old_original in content:
    content = content.replace(old_original, new, 1)
    with open(path, 'w') as f:
        f.write(content)
    print("Patched original version directly (only unassigned courses show)")
else:
    print("Pattern not found — check manually")
