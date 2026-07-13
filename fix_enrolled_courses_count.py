#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/pages/StudentPortal.tsx")

OLD = """                  <div>
                    <p className="text-2xl font-bold text-foreground">3</p>
                    <p className="text-xs text-muted-foreground">Enrolled Courses</p>
                  </div>"""

NEW = """                  <div>
                    <p className="text-2xl font-bold text-foreground">{studentCourses.length}</p>
                    <p className="text-xs text-muted-foreground">Enrolled Courses</p>
                  </div>"""

def main():
    text = FILE_PATH.read_text()
    if "studentCourses.length}</p>\n                    <p className=\"text-xs text-muted-foreground\">Enrolled Courses" in text:
        print("Already applied. Nothing to do.")
        return
    if OLD not in text:
        print("ERROR: Could not find the expected block. Nothing was modified.")
        return
    backup = FILE_PATH.with_suffix(".tsx.bak4")
    shutil.copy(FILE_PATH, backup)
    print(f"Backup saved to {backup}")
    text = text.replace(OLD, NEW, 1)
    FILE_PATH.write_text(text)
    print("Patched successfully.")

if __name__ == "__main__":
    main()
