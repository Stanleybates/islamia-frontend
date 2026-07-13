#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/pages/AdminPanel.tsx")

# 1. Extend Student interface
OLD_INTERFACE = "interface Student { id: string; name: string; email: string; semester: string; status: string; gpa: string; }"
NEW_INTERFACE = "interface Student { id: string; name: string; email: string; semester: string; status: string; gpa: string; indexNumber?: string; enrolledCourses?: string[]; }"

# 2. First mapping (line ~397)
OLD_MAP1 = "if (studentsRes?.data) setStudents(studentsRes.data.map((s) => ({ id: String(s.id), name: s.username || s.email, email: s.email, semester: s.semester || 'Sem 1', status: 'Active', gpa: '0.0', enrolledCourses: s.enrolled_courses || [] })));"
NEW_MAP1 = "if (studentsRes?.data) setStudents(studentsRes.data.map((s) => ({ id: String(s.id), name: s.username || s.email, email: s.email, semester: s.semester || 'Sem 1', status: 'Active', gpa: '0.0', indexNumber: s.index_number || '', enrolledCourses: s.enrolled_courses || [] })));"

# 3. Second mapping (line ~510)
OLD_MAP2 = """  const mapped = studentsRes.data.map((s: any) => ({
    id: String(s.id),
    name: s.username || s.email,
    email: s.email,
    semester: 'Sem 1',
    status: 'Active',
    gpa: '0.0',
  }));"""
NEW_MAP2 = """  const mapped = studentsRes.data.map((s: any) => ({
    id: String(s.id),
    name: s.username || s.email,
    email: s.email,
    semester: 'Sem 1',
    status: 'Active',
    gpa: '0.0',
    indexNumber: s.index_number || '',
    enrolledCourses: s.enrolled_courses || [],
  }));"""

# 4. Replace the free-text student input with a filtered dropdown
OLD_INPUT = '''<input value={newGrade.student} onChange={(e) => setNewGrade({ ...newGrade, student: e.target.value })} className={inputClass} placeholder="Student Index Number" />'''
NEW_INPUT = '''<select value={newGrade.student} onChange={(e) => setNewGrade({ ...newGrade, student: e.target.value })} className={inputClass}>
                      <option value="">{newGrade.course ? 'Select Enrolled Student' : 'Select a course first'}</option>
                      {students.filter((s: any) => !newGrade.course || (s.enrolledCourses || []).includes(newGrade.course)).map((s: any) => (
                        <option key={s.id} value={s.indexNumber}>{s.indexNumber} - {s.name}</option>
                      ))}
                    </select>'''

def main():
    text = FILE_PATH.read_text()
    if "Select Enrolled Student" in text:
        print("Already applied. Nothing to do.")
        return

    backup = FILE_PATH.with_suffix(".tsx.bak6")
    shutil.copy(FILE_PATH, backup)
    print(f"Backup saved to {backup}")

    changed = False
    for old, new, label in [
        (OLD_INTERFACE, NEW_INTERFACE, "Student interface"),
        (OLD_MAP1, NEW_MAP1, "mapping 1"),
        (OLD_MAP2, NEW_MAP2, "mapping 2"),
        (OLD_INPUT, NEW_INPUT, "student input -> dropdown"),
    ]:
        if old in text:
            text = text.replace(old, new, 1)
            changed = True
            print(f"Patched: {label}")
        else:
            print(f"WARNING: could not find block for {label}, skipping.")

    if changed:
        FILE_PATH.write_text(text)
        print("File saved.")
    else:
        print("No changes made.")

if __name__ == "__main__":
    main()
