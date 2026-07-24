#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/pages/AdminPanel.tsx")

OLD = """                    <div className="bg-card rounded-xl border border-border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/50">
                            <th className="text-left p-4 font-semibold">Course</th>
                            <th className="text-left p-4 font-semibold">Title</th>
                            <th className="text-left p-4 font-semibold">Date</th>
                            <th className="text-left p-4 font-semibold">Start</th>
                            <th className="text-left p-4 font-semibold">End</th>
                            <th className="text-left p-4 font-semibold">Duration</th>
                            <th className="text-left p-4 font-semibold">Questions</th>
                            <th className="text-left p-4 font-semibold">Set By</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exams
                            .filter((e: any) => e.approval_status === 'approved')
                            .sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                            .map((e: any) => (
                              <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                                <td className="p-4 font-medium text-foreground">{e.course}</td>
                                <td className="p-4 text-muted-foreground">{e.title}</td>
                                <td className="p-4 text-muted-foreground">{e.start_time ? new Date(e.start_time).toLocaleDateString() : '—'}</td>
                                <td className="p-4 text-muted-foreground">{e.start_time ? new Date(e.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—'}</td>
                                <td className="p-4 text-muted-foreground">{e.end_time ? new Date(e.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—'}</td>
                                <td className="p-4 text-muted-foreground">{e.duration ? `${e.duration} mins` : '—'}</td>
                                <td className="p-4 text-muted-foreground">{e.num_questions || '—'}</td>
                                <td className="p-4 text-muted-foreground">{e.set_by_name || '—'}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}"""

NEW = """                    <div className="space-y-3">
                      {exams
                        .filter((e: any) => e.approval_status === 'approved')
                        .sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                        .map((e: any) => (
                          <div key={e.id} className="bg-card rounded-xl border border-border p-4">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="min-w-0">
                                <p className="font-heading font-semibold text-foreground truncate">{e.title}</p>
                                <p className="text-xs text-muted-foreground truncate">{e.course}</p>
                              </div>
                              <p className="text-xs text-muted-foreground flex-shrink-0">{e.start_time ? new Date(e.start_time).toLocaleDateString() : '—'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
                              <div><span className="font-medium text-foreground">Start:</span> {e.start_time ? new Date(e.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—'}</div>
                              <div><span className="font-medium text-foreground">End:</span> {e.end_time ? new Date(e.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—'}</div>
                              <div><span className="font-medium text-foreground">Duration:</span> {e.duration ? `${e.duration} mins` : '—'}</div>
                              <div><span className="font-medium text-foreground">Questions:</span> {e.num_questions || '—'}</div>
                              <div className="col-span-2"><span className="font-medium text-foreground">Set by:</span> {e.set_by_name || '—'}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}"""

def main():
    text = FILE_PATH.read_text()
    if "grid grid-cols-2 gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3" in text:
        print("Already applied. Nothing to do.")
        return
    if OLD not in text:
        print("ERROR: Could not find the expected block. Nothing was modified.")
        return
    backup = FILE_PATH.with_suffix(".tsx.baktimetable")
    shutil.copy(FILE_PATH, backup)
    print(f"Backup saved to {backup}")
    text = text.replace(OLD, NEW, 1)
    FILE_PATH.write_text(text)
    print("Patched successfully.")

if __name__ == "__main__":
    main()
