#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/pages/StudentPortal.tsx")

OLD = """  useEffect(() => {
    const session = localStorage.getItem('ami_student_session');
    if (session) {
      try {
        const s = JSON.parse(session);
        const token = s?.token;
        if (!token) throw new Error('No token');
        // Check if browser was reopened (sessionStorage cleared on close)
        if (!sessionStorage.getItem('ami_student_active')) {"""

NEW = """  useEffect(() => {
    loadFeeStatus();
  }, []);

  useEffect(() => {
    const session = localStorage.getItem('ami_student_session');
    if (session) {
      try {
        const s = JSON.parse(session);
        const token = s?.token;
        if (!token) throw new Error('No token');
        // Check if browser was reopened (sessionStorage cleared on close)
        if (!sessionStorage.getItem('ami_student_active')) {"""

def main():
    text = FILE_PATH.read_text()
    if "loadFeeStatus();\n  }, []);" in text:
        print("Already applied. Nothing to do.")
        return
    if OLD not in text:
        print("ERROR: Could not find the expected block. Nothing was modified.")
        return
    backup = FILE_PATH.with_suffix(".tsx.bak2")
    shutil.copy(FILE_PATH, backup)
    print(f"Backup saved to {backup}")
    text = text.replace(OLD, NEW, 1)
    FILE_PATH.write_text(text)
    print("Patched successfully.")

if __name__ == "__main__":
    main()
