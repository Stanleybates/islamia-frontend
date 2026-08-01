#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/pages/AdminPanel.tsx")

REPLACEMENTS = [
    ("apiUrl('/api/admin/applications')", "apiUrl('/api/admin/applications?limit=200')"),
    ("apiUrl('/api/admin/students')", "apiUrl('/api/admin/students?limit=200')"),
    ("apiUrl('/api/admin/admins')", "apiUrl('/api/admin/admins?limit=200')"),
    ("apiUrl('/api/admin/grades')", "apiUrl('/api/admin/grades?limit=200')"),
    ("apiUrl('/api/admin/payments')", "apiUrl('/api/admin/payments?limit=200')"),
]

def main():
    text = FILE_PATH.read_text()
    backup = FILE_PATH.with_suffix(".tsx.bakpagination")
    shutil.copy(FILE_PATH, backup)
    print(f"Backup saved to {backup}")

    total_replacements = 0
    for old, new in REPLACEMENTS:
        count = text.count(old)
        if count > 0:
            text = text.replace(old, new)
            total_replacements += count
            print(f"Replaced {count} occurrence(s) of {old}")
        else:
            print(f"WARNING: no occurrences found for {old}")

    if total_replacements > 0:
        FILE_PATH.write_text(text)
        print(f"File saved. Total replacements: {total_replacements}")
    else:
        print("No changes made.")

if __name__ == "__main__":
    main()
