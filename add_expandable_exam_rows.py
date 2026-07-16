#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/pages/AdminPanel.tsx")

# 1. Add ChevronDown import
OLD_IMPORT = "  ClipboardList, Bell\n} from \"lucide-react\";"
NEW_IMPORT = "  ClipboardList, Bell, ChevronDown\n} from \"lucide-react\";"

# 2. Add expand state near examWindowMain
OLD_STATE = "  const [examWindowMain, setExamWindowMain] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });"
NEW_STATE = """  const [examWindowMain, setExamWindowMain] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });
  const [expandedExamId, setExpandedExamId] = useState<any>(null);"""

# 3. Replace the whole table thead+tbody row rendering
OLD_TABLE = '''                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="text-left p-4 font-semibold">Title</th>
                          <th className="text-left p-4 font-semibold">Course</th>
                          <th className="text-left p-4 font-semibold">Start</th>
                          <th className="text-left p-4 font-semibold">End</th>
                          <th className="text-left p-4 font-semibold">Link</th>
                          <th className="text-left p-4 font-semibold">Approval</th>
                          <th className="text-left p-4 font-semibold"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {exams.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No exams scheduled yet</td></tr>}
                        {exams.map((e: any) => (
                          <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                            <td className="p-4 font-medium">{e.title}</td>
                            <td className="p-4 text-muted-foreground">{e.course}</td>
                            <td className="p-4 text-muted-foreground text-xs">{e.start_time ? new Date(e.start_time).toLocaleString() : '—'}</td>
                            <td className="p-4 text-muted-foreground text-xs">{e.end_time ? new Date(e.end_time).toLocaleString() : '—'}</td>
                            <td className="p-4 text-xs">
                              {e.exam_link ? <a href={e.exam_link} target="_blank" rel="noopener noreferrer" className="text-primary underline">Open Link</a> : '—'}
                            </td>
                            <td className="p-4">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${e.approval_status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {e.approval_status === 'approved' ? 'Approved' : 'Pending'}
                              </span>
                            </td>
                            <td className="p-4 flex gap-2">
                              {isSuperAdmin && e.approval_status !== 'approved' && (
                                <Button size="sm" onClick={async () => {
                                  try {
                                    const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                                    const csrfToken = await getCsrfToken();
                                    const res = await fetch(apiUrl('/api/admin/exams/' + e.id + '/approve'), { method: 'PUT', credentials: 'include', headers: { Authorization: 'Bearer ' + s?.token, 'x-csrf-token': csrfToken } });
                                    if (!res.ok) throw new Error('Failed');
                                    setExams(prev => prev.map(x => x.id === e.id ? {...x, approval_status: 'approved'} : x));
                                    toast.success('Exam approved');
                                  } catch (err: any) { toast.error(err.message); }
                                }}>Approve</Button>
                              )}
                              <Button size="sm" variant="outline" onClick={async () => {
                                const newStart = prompt('New start time (YYYY-MM-DDTHH:MM):');
                                const newEnd = prompt('New end time (YYYY-MM-DDTHH:MM):');
                                if (!newStart || !newEnd) return;
                                try {
                                  const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                                  const csrfToken = await getCsrfToken();
                                  const res = await fetch(apiUrl('/api/admin/exams/' + e.id), {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s?.token, 'x-csrf-token': csrfToken },
                                    body: JSON.stringify({ start_time: newStart, end_time: newEnd }),
                                  });
                                  if (!res.ok) throw new Error('Failed');
                                  const data = await res.json();
                                  setExams(prev => prev.map(x => x.id === e.id ? {...x, ...data} : x));
                                  toast.success('Exam rescheduled — students notified');
                                } catch (err: any) { toast.error(err.message); }
                              }}>Reschedule</Button>
                              <Button size="sm" variant="outline" onClick={async () => {
                                try {
                                  const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                                  const csrfToken = await getCsrfToken();
                                  const res = await fetch(apiUrl('/api/admin/exams/' + e.id), {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s?.token, 'x-csrf-token': csrfToken },
                                    body: JSON.stringify({ status: 'on_hold' }),
                                  });
                                  if (!res.ok) throw new Error('Failed');
                                  setExams(prev => prev.map(x => x.id === e.id ? {...x, status: 'on_hold'} : x));
                                  toast.success('Exam put on hold — students notified');
                                } catch (err: any) { toast.error(err.message); }
                              }} className="text-accent border-accent/30">Hold</Button>
                              {isSuperAdmin && (
                                <button onClick={async () => {
                                  try {
                                    const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                                    const csrfToken = await getCsrfToken();
                                    await fetch(apiUrl('/api/admin/exams/' + e.id), { method: 'DELETE', credentials: 'include', headers: { Authorization: 'Bearer ' + s?.token, 'x-csrf-token': csrfToken } });
                                    setExams(prev => prev.filter(x => x.id !== e.id));
                                    toast.success('Exam deleted');
                                  } catch (err: any) { toast.error(err.message); }
                                }} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                              )}
                            </td>
                          </tr>
                        ))}'''

NEW_TABLE = '''                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    {exams.length === 0 && <div className="p-6 text-center text-muted-foreground text-sm">No exams scheduled yet</div>}
                    {exams.map((e: any) => {
                      const isExpanded = expandedExamId === e.id;
                      return (
                      <div key={e.id} className="border-b border-border last:border-0">
                        <button
                          onClick={() => setExpandedExamId(isExpanded ? null : e.id)}
                          className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-muted/30"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">{e.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{e.course}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${e.approval_status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {e.approval_status === 'approved' ? 'Approved' : 'Pending'}
                            </span>
                            <ChevronDown size={16} className={`text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </div>
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-4 space-y-3 text-sm">
                            <div className="grid grid-cols-2 gap-3 bg-muted/30 rounded-lg p-3">
                              <div><p className="text-xs text-muted-foreground">Start</p><p>{e.start_time ? new Date(e.start_time).toLocaleString() : '—'}</p></div>
                              <div><p className="text-xs text-muted-foreground">End</p><p>{e.end_time ? new Date(e.end_time).toLocaleString() : '—'}</p></div>
                              <div><p className="text-xs text-muted-foreground">Questions</p><p>{e.num_questions ?? '—'}</p></div>
                              <div><p className="text-xs text-muted-foreground">Duration</p><p>{e.duration ? `${e.duration} mins` : '—'}</p></div>
                              <div><p className="text-xs text-muted-foreground">Set by</p><p>{e.set_by_name || '—'}</p></div>
                              <div><p className="text-xs text-muted-foreground">Link</p><p>{e.exam_link ? <a href={e.exam_link} target="_blank" rel="noopener noreferrer" className="text-primary underline" onClick={(ev) => ev.stopPropagation()}>Open Link</a> : '—'}</p></div>
                              {e.instructions && <div className="col-span-2"><p className="text-xs text-muted-foreground">Instructions</p><p>{e.instructions}</p></div>}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {isSuperAdmin && e.approval_status !== 'approved' && (
                                <Button size="sm" onClick={async () => {
                                  try {
                                    const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                                    const csrfToken = await getCsrfToken();
                                    const res = await fetch(apiUrl('/api/admin/exams/' + e.id + '/approve'), { method: 'PUT', credentials: 'include', headers: { Authorization: 'Bearer ' + s?.token, 'x-csrf-token': csrfToken } });
                                    if (!res.ok) throw new Error('Failed');
                                    setExams(prev => prev.map(x => x.id === e.id ? {...x, approval_status: 'approved'} : x));
                                    toast.success('Exam approved');
                                  } catch (err: any) { toast.error(err.message); }
                                }}>Approve</Button>
                              )}
                              <Button size="sm" variant="outline" onClick={async () => {
                                const newStart = prompt('New start time (YYYY-MM-DDTHH:MM):');
                                const newEnd = prompt('New end time (YYYY-MM-DDTHH:MM):');
                                if (!newStart || !newEnd) return;
                                try {
                                  const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                                  const csrfToken = await getCsrfToken();
                                  const res = await fetch(apiUrl('/api/admin/exams/' + e.id), {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s?.token, 'x-csrf-token': csrfToken },
                                    body: JSON.stringify({ start_time: newStart, end_time: newEnd }),
                                  });
                                  if (!res.ok) throw new Error('Failed');
                                  const data = await res.json();
                                  setExams(prev => prev.map(x => x.id === e.id ? {...x, ...data} : x));
                                  toast.success('Exam rescheduled — students notified');
                                } catch (err: any) { toast.error(err.message); }
                              }}>Reschedule</Button>
                              <Button size="sm" variant="outline" onClick={async () => {
                                try {
                                  const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                                  const csrfToken = await getCsrfToken();
                                  const res = await fetch(apiUrl('/api/admin/exams/' + e.id), {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s?.token, 'x-csrf-token': csrfToken },
                                    body: JSON.stringify({ status: 'on_hold' }),
                                  });
                                  if (!res.ok) throw new Error('Failed');
                                  setExams(prev => prev.map(x => x.id === e.id ? {...x, status: 'on_hold'} : x));
                                  toast.success('Exam put on hold — students notified');
                                } catch (err: any) { toast.error(err.message); }
                              }} className="text-accent border-accent/30">Hold</Button>
                              {isSuperAdmin && (
                                <Button size="sm" variant="outline" onClick={async () => {
                                  try {
                                    const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                                    const csrfToken = await getCsrfToken();
                                    await fetch(apiUrl('/api/admin/exams/' + e.id), { method: 'DELETE', credentials: 'include', headers: { Authorization: 'Bearer ' + s?.token, 'x-csrf-token': csrfToken } });
                                    setExams(prev => prev.filter(x => x.id !== e.id));
                                    toast.success('Exam deleted');
                                  } catch (err: any) { toast.error(err.message); }
                                }} className="text-destructive border-destructive/30">Delete</Button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      );
                    })}'''

def main():
    text = FILE_PATH.read_text()
    if "expandedExamId" in text and OLD_STATE not in text:
        print("Already applied. Nothing to do.")
        return

    backup = FILE_PATH.with_suffix(".tsx.bak12")
    shutil.copy(FILE_PATH, backup)
    print(f"Backup saved to {backup}")

    changed = False
    for old, new, label in [(OLD_IMPORT, NEW_IMPORT, "import"), (OLD_STATE, NEW_STATE, "state"), (OLD_TABLE, NEW_TABLE, "table -> expandable rows")]:
        if old in text:
            text = text.replace(old, new, 1)
            changed = True
            print(f"Patched: {label}")
        else:
            print(f"WARNING: could not find block for {label}")

    if changed:
        FILE_PATH.write_text(text)
        print("File saved.")

if __name__ == "__main__":
    main()
