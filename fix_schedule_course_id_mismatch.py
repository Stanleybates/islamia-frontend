path = 'src/pages/AdminPanel.tsx'

with open(path, 'r') as f:
    content = f.read()

patches = []

patches.append((
    '{currentAssignedCourses.map((c: any) => <option key={c.id} value={c.title}>{c.title}</option>)}',
    '{currentAssignedCourses.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}'
))

patches.append((
    '''                      {schedules.map((s: any) => (
                        <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                          <td className="p-4 font-medium">{s.course}</td>
                          <td className="p-4 text-muted-foreground">{s.day_of_week}</td>
                          <td className="p-4 text-muted-foreground">{s.start_time} — {s.end_time}</td>
                          <td className="p-4 text-muted-foreground">{s.venue}</td>
                          <td className="p-4 text-muted-foreground">{s.platform || '—'}</td>
                          <td className="p-4 text-muted-foreground">{s.teacher_name || '—'}</td>
                        </tr>
                      ))}''',
    '''                      {schedules.map((s: any) => (
                        <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                          <td className="p-4 font-medium">{getCourseTitle(s.course, courses)}</td>
                          <td className="p-4 text-muted-foreground">{s.day_of_week}</td>
                          <td className="p-4 text-muted-foreground">{s.start_time} — {s.end_time}</td>
                          <td className="p-4 text-muted-foreground">{s.venue}</td>
                          <td className="p-4 text-muted-foreground">{s.platform || '—'}</td>
                          <td className="p-4 text-muted-foreground">{s.teacher_name || '—'}</td>
                        </tr>
                      ))}'''
))

patches.append((
    "doc.text(`  ${s.course} | ${s.start_time} - ${s.end_time} | ${s.venue}`, 10, y); y += 5;",
    "doc.text(`  ${getCourseTitle(s.course, courses)} | ${s.start_time} - ${s.end_time} | ${s.venue}`, 10, y); y += 5;"
))

patches.append((
    '''                        {schedules.filter((s: any) => currentAssignedCourseIds.includes(s.course)).map((s: any) => (
                          <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                            <td className="p-4 font-medium">{s.course}</td>''',
    '''                        {schedules.filter((s: any) => currentAssignedCourseIds.includes(s.course)).map((s: any) => (
                          <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                            <td className="p-4 font-medium">{getCourseTitle(s.course, courses)}</td>'''
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
