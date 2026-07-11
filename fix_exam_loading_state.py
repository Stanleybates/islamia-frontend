path = 'src/pages/AdminPanel.tsx'

with open(path, 'r') as f:
    content = f.read()

patches = []

patches.append((
    "  const [showAddExam, setShowAddExam] = useState(false);",
    "  const [showAddExam, setShowAddExam] = useState(false);\n  const [savingExam, setSavingExam] = useState(false);"
))

old_button = """                      <div className="flex gap-2">
                        <Button onClick={async () => {
                          if (examClash) { toast.error('Please resolve time clash before saving'); return; }
                          try {
                            const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                            const csrfToken = await getCsrfToken();
                            const headers: any = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s?.token, 'x-csrf-token': csrfToken };
                            const res = await fetch(apiUrl('/api/admin/exams'), { method: 'POST', headers, body: JSON.stringify(newExam) });
                            if (!res.ok) {
                              let msg = 'Something went wrong. Please check your connection and try again.';
                              try { const e = await res.json(); msg = e.message || msg; } catch {}
                              throw new Error(msg);
                            }
                            const data = await res.json();
                            setExams(prev => [data, ...prev]);
                            setNewExam({ course: '', title: '', exam_link: '', start_time: '', end_time: '', num_questions: '', duration: '60', instructions: '' });
                            setShowAddExam(false);
                            toast.success('Exam scheduled — awaiting super admin approval');
                          } catch (e: any) { toast.error(e.message || 'Something went wrong. Please try again.'); }
                        }}>Save</Button>
                        <Button variant="outline" onClick={() => setShowAddExam(false)}>Cancel</Button>
                      </div>"""

new_button = """                      <div className="flex gap-2">
                        <Button disabled={savingExam} onClick={async () => {
                          if (examClash) { toast.error('Please resolve time clash before saving'); return; }
                          setSavingExam(true);
                          try {
                            const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                            const csrfToken = await getCsrfToken();
                            const headers: any = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s?.token, 'x-csrf-token': csrfToken };
                            const res = await fetch(apiUrl('/api/admin/exams'), { method: 'POST', headers, body: JSON.stringify(newExam) });
                            if (!res.ok) {
                              let msg = 'Something went wrong. Please check your connection and try again.';
                              try { const e = await res.json(); msg = e.message || msg; } catch {}
                              throw new Error(msg);
                            }
                            const data = await res.json();
                            setExams(prev => [data, ...prev]);
                            setNewExam({ course: '', title: '', exam_link: '', start_time: '', end_time: '', num_questions: '', duration: '60', instructions: '' });
                            setShowAddExam(false);
                            toast.success('Exam scheduled — awaiting super admin approval');
                          } catch (e: any) { toast.error(e.message || 'Something went wrong. Please try again.'); }
                          finally { setSavingExam(false); }
                        }}>{savingExam ? 'Saving...' : 'Save'}</Button>
                        <Button variant="outline" disabled={savingExam} onClick={() => setShowAddExam(false)}>Cancel</Button>
                      </div>"""

patches.append((old_button, new_button))

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
