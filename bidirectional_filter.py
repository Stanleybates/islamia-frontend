#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/pages/AdminPanel.tsx")

OLD = '''{isSuperAdmin ? (
                      <select value={newGrade.course} onChange={(e) => setNewGrade({ ...newGrade, course: e.target.value })} className={inputClass}>
                        <option value="">Select Course</option>
                        {courses.map((c: any) => (
                          <option key={c.id} value={c.title}>{c.title}</option>
                        ))}
                      </select>
                    ) : (
                      <select value={newGrade.course} onChange={(e) => setNewGrade({ ...newGrade, course: e.target.value })} className={inputClass}>
                        <option value="">Select Course</option>
                        {currentAssignedCourses.map((c: any) => (
                          <option key={c.id} value={c.title}>{c.title}</option>
                        ))}
                      </select>
                    )}'''

NEW = '''{(() => {
                      const selectedStudent = students.find((s: any) => s.indexNumber === newGrade.student);
                      const selectedStudentCourses: string[] | null = selectedStudent ? (selectedStudent.enrolledCourses || []) : null;
                      const courseOptions = isSuperAdmin ? courses : currentAssignedCourses;
                      const filteredCourseOptions = courseOptions.filter((c: any) => !selectedStudentCourses || selectedStudentCourses.includes(c.title));
                      return (
                        <select value={newGrade.course} onChange={(e) => setNewGrade({ ...newGrade, course: e.target.value })} className={inputClass}>
                          <option value="">{selectedStudentCourses ? 'Select Enrolled Course' : 'Select Course'}</option>
                          {filteredCourseOptions.map((c: any) => (
                            <option key={c.id} value={c.title}>{c.title}</option>
                          ))}
                        </select>
                      );
                    })()}'''

def main():
    text = FILE_PATH.read_text()
    if "selectedStudentCourses" in text:
        print("Already applied. Nothing to do.")
        return
    if OLD not in text:
        print("ERROR: Could not find the expected block. Nothing was modified.")
        return
    backup = FILE_PATH.with_suffix(".tsx.bak8")
    shutil.copy(FILE_PATH, backup)
    print(f"Backup saved to {backup}")
    text = text.replace(OLD, NEW, 1)
    FILE_PATH.write_text(text)
    print("Patched successfully.")

if __name__ == "__main__":
    main()
