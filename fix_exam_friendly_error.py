path = 'src/pages/AdminPanel.tsx'

with open(path, 'r') as f:
    content = f.read()

old = """                            const res = await fetch(apiUrl('/api/admin/exams'), { method: 'POST', headers, body: JSON.stringify(newExam) });
                            if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
                            const data = await res.json();
                            setExams(prev => [data, ...prev]);
                            setNewExam({ course: '', title: '', exam_link: '', start_time: '', end_time: '', num_questions: '', duration: '60', instructions: '' });
                            setShowAddExam(false);
                            toast.success('Exam scheduled — awaiting super admin approval');
                          } catch (e: any) { toast.error(e.message); }"""

new = """                            const res = await fetch(apiUrl('/api/admin/exams'), { method: 'POST', headers, body: JSON.stringify(newExam) });
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
                          } catch (e: any) { toast.error(e.message || 'Something went wrong. Please try again.'); }"""

if new in content:
    print("Already patched, skipping")
elif old in content:
    content = content.replace(old, new, 1)
    with open(path, 'w') as f:
        f.write(content)
    print("Patched: exam submission now shows friendly error on non-JSON/server failures")
else:
    print("Pattern not found — check manually")
