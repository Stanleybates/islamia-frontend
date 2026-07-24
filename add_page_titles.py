#!/usr/bin/env python3
import shutil
from pathlib import Path

# path -> (component start marker, title text)
PAGES = {
    "src/pages/StudentLogin.tsx": ("const StudentLogin = () => {", "Student Login | Allahul Musta'an Institute"),
    "src/pages/StudentPortal.tsx": ("const StudentPortal = () => {", "Student Portal | Allahul Musta'an Institute"),
    "src/pages/StudentSignup.tsx": ("const StudentSignup = () => {", "Student Sign Up | Allahul Musta'an Institute"),
    "src/pages/StudentForgot.tsx": ("const StudentForgot = () => {", "Forgot Password | Allahul Musta'an Institute"),
    "src/pages/AdminLogin.tsx": ("const AdminLogin = () => {", "Admin Login | Allahul Musta'an Institute"),
    "src/pages/AdminPanel.tsx": ("const AdminPanel = () => {", "Admin Panel | Allahul Musta'an Institute"),
    "src/pages/Index.tsx": ("const Index = () => {", "Allahul Musta'an Institute - Admissions & Student Portal"),
}

IMPORT_LINE = 'import useDocumentTitle from "@/hooks/useDocumentTitle";'

def process(path_str, marker, title):
    path = Path(path_str)
    if not path.exists():
        print(f"SKIP: {path_str} not found")
        return
    text = path.read_text()
    if "useDocumentTitle(" in text:
        print(f"{path_str}: already applied, skipping")
        return
    if marker not in text:
        print(f"{path_str}: WARNING - marker not found, skipping")
        return

    backup = path.with_suffix(path.suffix + ".baktitle")
    shutil.copy(path, backup)

    # Add import at top if not present
    if IMPORT_LINE not in text:
        lines = text.split("\n")
        # insert after the last import line
        last_import_idx = 0
        for i, line in enumerate(lines):
            if line.strip().startswith("import "):
                last_import_idx = i
        lines.insert(last_import_idx + 1, IMPORT_LINE)
        text = "\n".join(lines)

    # Add the hook call right after the component opening line
    replacement = marker + f'\n  useDocumentTitle("{title}");'
    text = text.replace(marker, replacement, 1)

    path.write_text(text)
    print(f"{path_str}: patched (backup: {backup})")

for path_str, (marker, title) in PAGES.items():
    process(path_str, marker, title)
