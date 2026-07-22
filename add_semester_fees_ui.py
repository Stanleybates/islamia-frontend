#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/pages/AdminPanel.tsx")

SEMESTERS = [
    'Semester 1 (Foundation)',
    'Semester 2 (Intermediate)',
    'Semester 3 (Advanced)',
    'Semester 4 (Specialization)',
]

# 1. Add state
OLD_STATE = "  const [fee, setFee] = React.useState('');"
NEW_STATE = """  const [fee, setFee] = React.useState('');
  const [semesterFees, setSemesterFees] = React.useState<Record<string, string>>({});"""

# 2. Populate from local cache + fetch
OLD_LOCAL = "    if (localSettings.fee) setFee(String(localSettings.fee));"
NEW_LOCAL = """    if (localSettings.fee) setFee(String(localSettings.fee));"""  # unchanged, semesterFees only comes from server

OLD_FETCH = """        if (d.fee) setFee(String(d.fee));"""
NEW_FETCH = """        if (d.fee) setFee(String(d.fee));
        if (d.semesterFees) {
          try { setSemesterFees(JSON.parse(d.semesterFees)); } catch { /* ignore parse errors */ }
        }"""

# 3. Include in save payload
OLD_SAVE = "body: JSON.stringify({ semester, fee: Number(fee), admissionStart, admissionEnd, examWindowStart, examWindowEnd, vacationDays: vacationDays ? Number(vacationDays) : null, reopeningDate }),"
NEW_SAVE = "body: JSON.stringify({ semester, fee: Number(fee), admissionStart, admissionEnd, examWindowStart, examWindowEnd, vacationDays: vacationDays ? Number(vacationDays) : null, reopeningDate, semesterFees }),"

# 4. Add UI section (right after the Semester Fee input block)
OLD_UI = """        <div>
          <label className="text-sm font-medium block mb-1">Semester Fee (GHS)</label>
          <input type="number" value={fee} onChange={e => setFee(e.target.value)} className="w-full px-3 py-2 border rounded text-sm" placeholder="e.g. 500" />
        </div>"""

NEW_UI = """        <div>
          <label className="text-sm font-medium block mb-1">Semester Fee (GHS)</label>
          <input type="number" value={fee} onChange={e => setFee(e.target.value)} className="w-full px-3 py-2 border rounded text-sm" placeholder="e.g. 500" />
          <p className="text-xs text-muted-foreground mt-1">This is the default fee shown to new applicants. Continuing students pay the fee set for their specific semester below.</p>
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">Per-Semester Fees (GHS) — for continuing students</label>
          <div className="grid gap-3 md:grid-cols-2">
            %s
          </div>
        </div>""" % "\n            ".join(
    f'<div><label className="text-xs text-muted-foreground block mb-1">{sem}</label><input type="number" value={{semesterFees["{sem}"] || ""}} onChange={{e => setSemesterFees({{ ...semesterFees, "{sem}": e.target.value }})}} className="w-full px-3 py-2 border rounded text-sm" placeholder="e.g. 500" /></div>'
    for sem in SEMESTERS
)

def main():
    text = FILE_PATH.read_text()
    if "semesterFees" in text and OLD_STATE not in text:
        print("Already applied. Nothing to do.")
        return

    backup = FILE_PATH.with_suffix(".tsx.bak17")
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
