#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/pages/AdminPanel.tsx")

OLD = """  const handleUpdateGrade = (idx: number) => {
    const midterm = Number(editGradeData.midterm);
    const final_ = Number(editGradeData.final);
    const grade = calcGrade(midterm, final_);
    const updated = [...grades];
    updated[idx] = {
      ...updated[idx],
      midterm,
      final: final_,
      grade,
      status: currentAdmin?.role === "super" ? "approved" : updated[idx].status,
      approvedBy: currentAdmin?.role === "super" ? currentAdmin?.username || updated[idx].approvedBy : updated[idx].approvedBy,
      approvedAt: currentAdmin?.role === "super" ? new Date().toISOString() : updated[idx].approvedAt,
    };
    setGrades(updated);
    setEditingGrade(null);
    toast.success("Grade updated successfully!");
  };"""

NEW = """  const handleUpdateGrade = async (idx: number) => {
    const midterm = Number(editGradeData.midterm);
    const final_ = Number(editGradeData.final);
    const grade = calcGrade(midterm, final_);
    const gradeRow = grades[idx];

    try {
      const csrfToken = await getCsrfToken();
      const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}`, 'x-csrf-token': csrfToken };
      const res = await fetch(apiUrl('/api/admin/grades/' + gradeRow.id), {
        method: 'PUT',
        headers,
        body: JSON.stringify({ midterm, final: final_, grade }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error("Failed to update grade", { description: err.message });
        return;
      }
      const updatedRow = await res.json();
      setGrades((g) => g.map((x, i) => i === idx ? { ...x, ...updatedRow } : x));
      setEditingGrade(null);
      toast.success("Grade updated successfully!");
    } catch (e) {
      toast.error("Error updating grade");
    }
  };"""

def main():
    text = FILE_PATH.read_text()
    if "gradeRow.id" in text:
        print("Already applied. Nothing to do.")
        return
    if OLD not in text:
        print("ERROR: Could not find the expected block. Nothing was modified.")
        return
    backup = FILE_PATH.with_suffix(".tsx.bak5")
    shutil.copy(FILE_PATH, backup)
    print(f"Backup saved to {backup}")
    text = text.replace(OLD, NEW, 1)
    FILE_PATH.write_text(text)
    print("Patched successfully.")

if __name__ == "__main__":
    main()
