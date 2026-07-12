#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/pages/AdminPanel.tsx")

OLD = '''app.status === "Pending" ? "bg-accent/10 text-accent" :
                            app.status === "Approved" ? "bg-yellow-500/10 text-yellow-600" :
                            app.status === "Enrolled" ? "bg-primary/10 text-primary" :
                            "bg-destructive/10 text-destructive"'''

NEW = '''app.status === "Pending" ? "bg-accent/10 text-accent" :
                            app.status === "Approved" ? "bg-yellow-500/10 text-yellow-600" :
                            app.status === "Paid" ? "bg-green-500/10 text-green-600" :
                            app.status === "Enrolled" ? "bg-primary/10 text-primary" :
                            "bg-destructive/10 text-destructive"'''

def main():
    if not FILE_PATH.exists():
        print(f"ERROR: {FILE_PATH} not found. Run this from your frontend project root.")
        return

    text = FILE_PATH.read_text()

    if NEW in text:
        print("Fix already applied. Nothing to do.")
        return

    if OLD not in text:
        print("ERROR: Could not find the expected block. Nothing was modified.")
        return

    backup_path = FILE_PATH.with_suffix(".tsx.bak2")
    shutil.copy(FILE_PATH, backup_path)
    print(f"Backup saved to {backup_path}")

    text = text.replace(OLD, NEW, 1)
    FILE_PATH.write_text(text)
    print(f"Patched {FILE_PATH} successfully.")

if __name__ == "__main__":
    main()
