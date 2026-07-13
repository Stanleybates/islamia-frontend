#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/pages/StudentLogin.tsx")

OLD = "      await apiClient.studentLogin(indexNumber, password);"
NEW = "      await apiClient.studentLogin(indexNumber.trim(), password.trim());"

def main():
    text = FILE_PATH.read_text()
    if "password.trim()" in text:
        print("Already applied. Nothing to do.")
        return
    if OLD not in text:
        print("ERROR: Could not find the expected line. Nothing was modified.")
        return
    backup = FILE_PATH.with_suffix(".tsx.bak")
    shutil.copy(FILE_PATH, backup)
    print(f"Backup saved to {backup}")
    text = text.replace(OLD, NEW, 1)
    FILE_PATH.write_text(text)
    print("Patched successfully.")

if __name__ == "__main__":
    main()
