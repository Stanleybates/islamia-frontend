#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/pages/AdminPanel.tsx")

# 1. Add state
OLD_STATE = "  const [examWindowEnd, setExamWindowEnd] = React.useState('');"
NEW_STATE = """  const [examWindowEnd, setExamWindowEnd] = React.useState('');
  const [vacationDays, setVacationDays] = React.useState('');
  const [reopeningDate, setReopeningDate] = React.useState('');"""

# 2. Populate from fetch
OLD_FETCH = """        if (d.examWindowEnd) setExamWindowEnd(d.examWindowEnd);"""
NEW_FETCH = """        if (d.examWindowEnd) setExamWindowEnd(d.examWindowEnd);
        if (d.vacationDays) setVacationDays(String(d.vacationDays));
        if (d.reopeningDate) setReopeningDate(d.reopeningDate);"""

# 3. Include in save payload
OLD_SAVE = "body: JSON.stringify({ semester, fee: Number(fee), admissionStart, admissionEnd, examWindowStart, examWindowEnd }),"
NEW_SAVE = "body: JSON.stringify({ semester, fee: Number(fee), admissionStart, admissionEnd, examWindowStart, examWindowEnd, vacationDays: vacationDays ? Number(vacationDays) : null, reopeningDate }),"

# 4. Add UI fields after the exam window box
OLD_UI = '''        {(examWindowStart || examWindowEnd) && (
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
            <p><span className="font-medium text-foreground">Exam Window:</span> {formatSemesterDate(examWindowStart)} → {formatSemesterDate(examWindowEnd)}</p>
            <p className="mt-1 text-muted-foreground">Sub-admins can only schedule exams within this window.</p>
          </div>
        )}
        <div className="flex gap-3">'''

NEW_UI = '''        {(examWindowStart || examWindowEnd) && (
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
            <p><span className="font-medium text-foreground">Exam Window:</span> {formatSemesterDate(examWindowStart)} → {formatSemesterDate(examWindowEnd)}</p>
            <p className="mt-1 text-muted-foreground">Sub-admins can only schedule exams within this window.</p>
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium block mb-1">Vacation Length (days)</label>
            <input type="number" min="0" value={vacationDays} onChange={e => setVacationDays(e.target.value)} className="w-full px-3 py-2 border rounded text-sm" placeholder="e.g. 14" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Reopening Date</label>
            <input type="date" value={reopeningDate} onChange={e => setReopeningDate(e.target.value)} className="w-full px-3 py-2 border rounded text-sm" />
          </div>
        </div>
        {(vacationDays || reopeningDate) && (
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
            {examWindowEnd && <p><span className="font-medium text-foreground">Vacation Starts:</span> {formatSemesterDate(new Date(new Date(examWindowEnd).getTime() + 86400000).toISOString().slice(0, 10))}</p>}
            {vacationDays && <p><span className="font-medium text-foreground">Vacation Length:</span> {vacationDays} day{Number(vacationDays) === 1 ? '' : 's'}</p>}
            <p><span className="font-medium text-foreground">Reopening Date:</span> {formatSemesterDate(reopeningDate)}</p>
            <p className="mt-1 text-muted-foreground">Eligible students are automatically promoted to the next semester on the reopening date.</p>
          </div>
        )}
        <div className="flex gap-3">'''

def main():
    text = FILE_PATH.read_text()
    if "vacationDays" in text and OLD_STATE not in text:
        print("Already applied. Nothing to do.")
        return

    backup = FILE_PATH.with_suffix(".tsx.bak15")
    shutil.copy(FILE_PATH, backup)
    print(f"Backup saved to {backup}")

    changed = False
    for old, new, label in [(OLD_STATE, NEW_STATE, "state"), (OLD_FETCH, NEW_FETCH, "fetch populate"), (OLD_SAVE, NEW_SAVE, "save payload"), (OLD_UI, NEW_UI, "UI fields")]:
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
