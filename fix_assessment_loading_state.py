path = 'src/pages/AdminPanel.tsx'

with open(path, 'r') as f:
    content = f.read()

old = """                  <div className="flex gap-2">
                    <Button onClick={async () => {
                      try {
                        const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                        const csrfToken = await getCsrfToken();
                        const headers: any = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s?.token, 'x-csrf-token': csrfToken };
                        const normalizedExamDates = normalizeExamDates(newAssessment.examDates || newAssessment.posted);
                        const payload = {
                          ...newAssessment,
                          examDates: normalizedExamDates,
                          exam_dates: normalizedExamDates,
                          posted: newAssessment.posted || normalizedExamDates[0] || "",
                          type: newAssessment.type || 'Exam',
                          examLink: newAssessment.examLink,
                          exam_link: newAssessment.examLink,
                          // uploads from super admins are published immediately so they appear in sub-admin and student portals
                          approval_status: 'approved'
                        };
                        const res = await fetch(apiUrl('/api/admin/assessments'), { method: 'POST', headers, body: JSON.stringify(payload) });
                        if (!res.ok) throw new Error('Failed to add');
                        const data = await res.json();
                        setAssessments(prev => [data, ...prev]);

                        setNewAssessment({ title: '', course: '', type: 'Exam', posted: '', examDates: '', status: 'Posted', weight: '', duration: '60', examLink: '' });
                        setShowAddAssessment(false);
                        toast.success('Exam link uploaded successfully');
                      } catch (e: any) { toast.error(e.message); }
                    }}>Save</Button>
                    <Button variant="outline" onClick={() => setShowAddAssessment(false)}>Cancel</Button>
                  </div>"""

new = """                  <div className="flex gap-2">
                    <Button disabled={savingAssessment} onClick={async () => {
                      setSavingAssessment(true);
                      try {
                        const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                        const csrfToken = await getCsrfToken();
                        const headers: any = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s?.token, 'x-csrf-token': csrfToken };
                        const normalizedExamDates = normalizeExamDates(newAssessment.examDates || newAssessment.posted);
                        const payload = {
                          ...newAssessment,
                          examDates: normalizedExamDates,
                          exam_dates: normalizedExamDates,
                          posted: newAssessment.posted || normalizedExamDates[0] || "",
                          type: newAssessment.type || 'Exam',
                          examLink: newAssessment.examLink,
                          exam_link: newAssessment.examLink,
                          // uploads from super admins are published immediately so they appear in sub-admin and student portals
                          approval_status: 'approved'
                        };
                        const res = await fetch(apiUrl('/api/admin/assessments'), { method: 'POST', headers, body: JSON.stringify(payload) });
                        if (!res.ok) {
                          let msg = 'Something went wrong. Please check your connection and try again.';
                          try { const e = await res.json(); msg = e.message || msg; } catch {}
                          throw new Error(msg);
                        }
                        const data = await res.json();
                        setAssessments(prev => [data, ...prev]);

                        setNewAssessment({ title: '', course: '', type: 'Exam', posted: '', examDates: '', status: 'Posted', weight: '', duration: '60', examLink: '' });
                        setShowAddAssessment(false);
                        toast.success('Exam link uploaded successfully');
                      } catch (e: any) { toast.error(e.message || 'Something went wrong. Please try again.'); }
                      finally { setSavingAssessment(false); }
                    }}>{savingAssessment ? 'Saving...' : 'Save'}</Button>
                    <Button variant="outline" disabled={savingAssessment} onClick={() => setShowAddAssessment(false)}>Cancel</Button>
                  </div>"""

if new in content:
    print("Already patched, skipping")
elif old in content:
    content = content.replace(old, new, 1)
    with open(path, 'w') as f:
        f.write(content)
    print("Patched: added loading state/feedback to assessment Save button")
else:
    print("Pattern not found — check manually")
