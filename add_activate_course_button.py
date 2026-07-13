#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/pages/AdminPanel.tsx")

OLD = '''                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${c.status === "Active" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>{c.status}</span>
                        {isSuperAdmin && <button onClick={async () => {
                          try {
                            const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                            const token = s?.token;
                            const csrfToken = await getCsrfToken();
                            const headers: any = { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken };
                            if (token) headers['Authorization'] = `Bearer ${token}`;
                            const res = await fetch(apiUrl('/api/admin/courses/' + c.id), { method: 'DELETE', headers });
                            setCourses(prev => prev.filter(x => x.id !== c.id));
                            toast.success('Course deleted');
                          } catch (e: any) { toast.error(e.message); }
                        }} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>}'''

NEW = '''                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${c.status === "Active" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>{c.status}</span>
                        {isSuperAdmin && c.status !== "Active" && <button onClick={async () => {
                          try {
                            const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                            const token = s?.token;
                            const csrfToken = await getCsrfToken();
                            const headers: any = { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken };
                            if (token) headers['Authorization'] = `Bearer ${token}`;
                            const res = await fetch(apiUrl('/api/admin/courses/' + c.id), { method: 'PUT', headers, body: JSON.stringify({ status: 'Active' }) });
                            if (!res.ok) { const err = await res.json(); throw new Error(err.message || 'Failed to activate course'); }
                            const updated = await res.json();
                            setCourses(prev => prev.map(x => x.id === c.id ? { ...x, status: updated.status } : x));
                            toast.success('Course activated');
                          } catch (e: any) { toast.error(e.message); }
                        }} className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20">Activate</button>}
                        {isSuperAdmin && <button onClick={async () => {
                          try {
                            const s = JSON.parse(localStorage.getItem('ami_admin_session') || '{}');
                            const token = s?.token;
                            const csrfToken = await getCsrfToken();
                            const headers: any = { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken };
                            if (token) headers['Authorization'] = `Bearer ${token}`;
                            const res = await fetch(apiUrl('/api/admin/courses/' + c.id), { method: 'DELETE', headers });
                            setCourses(prev => prev.filter(x => x.id !== c.id));
                            toast.success('Course deleted');
                          } catch (e: any) { toast.error(e.message); }
                        }} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>}'''

def main():
    text = FILE_PATH.read_text()
    if "Course activated" in text:
        print("Already applied. Nothing to do.")
        return
    if OLD not in text:
        print("ERROR: Could not find the expected block. Nothing was modified.")
        return
    backup = FILE_PATH.with_suffix(".tsx.bak9")
    shutil.copy(FILE_PATH, backup)
    print(f"Backup saved to {backup}")
    text = text.replace(OLD, NEW, 1)
    FILE_PATH.write_text(text)
    print("Patched successfully.")

if __name__ == "__main__":
    main()
