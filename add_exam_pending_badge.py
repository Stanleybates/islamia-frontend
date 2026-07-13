#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/pages/AdminPanel.tsx")

OLD_CALC = """            const notificationCount = pendingGradesCount + pendingAssessmentsCount + newAdmissionsCount;"""
NEW_CALC = """            const notificationCount = pendingGradesCount + pendingAssessmentsCount + newAdmissionsCount;
            const pendingExamsCount = isSuperAdmin ? exams.filter((e: any) => e.approval_status !== 'approved').length : 0;"""

OLD_BADGE = """              {item.key === "notifications" && notificationCount > 0 && (
                <span className="bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {notificationCount}
                </span>
              )}"""
NEW_BADGE = """              {item.key === "notifications" && notificationCount > 0 && (
                <span className="bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {notificationCount}
                </span>
              )}
              {item.key === "assessments" && pendingExamsCount > 0 && (
                <span className="bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {pendingExamsCount}
                </span>
              )}"""

def main():
    text = FILE_PATH.read_text()
    if "pendingExamsCount" in text:
        print("Already applied. Nothing to do.")
        return
    if OLD_CALC not in text or OLD_BADGE not in text:
        print("ERROR: Could not find expected blocks. Nothing was modified.")
        return
    backup = FILE_PATH.with_suffix(".tsx.bak10")
    shutil.copy(FILE_PATH, backup)
    print(f"Backup saved to {backup}")
    text = text.replace(OLD_CALC, NEW_CALC, 1)
    text = text.replace(OLD_BADGE, NEW_BADGE, 1)
    FILE_PATH.write_text(text)
    print("Patched successfully.")

if __name__ == "__main__":
    main()
