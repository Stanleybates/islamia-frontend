#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/pages/AdminPanel.tsx")

# 1. Add state near exams state
OLD_STATE = "  const [exams, setExams] = useState<any[]>([]);"
NEW_STATE = """  const [exams, setExams] = useState<any[]>([]);
  const [examWindowMain, setExamWindowMain] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });"""

# 2. Populate it from settingsRes
OLD_SETTINGS = """          if (settingsRes?.name) {
  setSettings({ name: settingsRes.name, contactNumber: settingsRes.contact_number, email: settingsRes.email });"""
NEW_SETTINGS = """          setExamWindowMain({ start: settingsRes?.examWindowStart || null, end: settingsRes?.examWindowEnd || null });
          if (settingsRes?.name) {
  setSettings({ name: settingsRes.name, contactNumber: settingsRes.contact_number, email: settingsRes.email });"""

# 3. Gate the button + show a message when no window is set for sub-admins
OLD_BUTTON = """                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">Formal exams with time window and third-party link.</p>
                    {(isSuperAdmin || currentAssignedCourseIds.length > 0) && (
                      <Button variant="gold" onClick={() => setShowAddExam(true)} className="gap-2"><Plus size={16} /> Schedule Exam</Button>
                    )}
                  </div>"""
NEW_BUTTON = """                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">Formal exams with time window and third-party link.</p>
                    {(isSuperAdmin || currentAssignedCourseIds.length > 0) && (isSuperAdmin || (examWindowMain.start && examWindowMain.end)) && (
                      <Button variant="gold" onClick={() => setShowAddExam(true)} className="gap-2"><Plus size={16} /> Schedule Exam</Button>
                    )}
                  </div>
                  {!isSuperAdmin && (!examWindowMain.start || !examWindowMain.end) && (
                    <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-sm text-accent">
                      The Super Admin has not set an exam window yet. You'll be able to schedule exams once one is configured.
                    </div>
                  )}"""

def main():
    text = FILE_PATH.read_text()
    if "examWindowMain" in text:
        print("Already applied. Nothing to do.")
        return

    backup = FILE_PATH.with_suffix(".tsx.bak11")
    shutil.copy(FILE_PATH, backup)
    print(f"Backup saved to {backup}")

    changed = False
    for old, new, label in [(OLD_STATE, NEW_STATE, "state"), (OLD_SETTINGS, NEW_SETTINGS, "settings population"), (OLD_BUTTON, NEW_BUTTON, "button gate")]:
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
