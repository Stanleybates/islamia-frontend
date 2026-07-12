#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/pages/AdminPanel.tsx")

OLD = """        // If approved, automatically confirm payment (backend will verify Paystack or mark manual)
        if (status === 'Approved') {
          try {
            const res2 = await fetch(apiUrl('/api/admin/applications/' + parseInt(dbId) + '/confirm'), {
              method: 'PUT', headers,
              body: JSON.stringify({ manual: true }),
            });
            const d2 = await res2.json();
            if (!res2.ok) throw new Error(d2.message || 'Payment confirm failed');
            // update application entry from server response if provided
            if (d2.application) setApplications(prev => prev.map(a => a.id === appId ? d2.application : a));
            toast.success(d2.message || 'Payment confirmed and student enrolled.');
            await loadDashboardData();
          } catch (e: any) {
            toast.error(e.message || 'Auto-confirm payment failed');
          }
        }"""

NEW = "        // Payment is confirmed later via Paystack webhook once the student actually pays."

def main():
    text = FILE_PATH.read_text()
    if NEW in text:
        print("Already removed. Nothing to do.")
        return
    if OLD not in text:
        print("ERROR: Could not find the block to remove. Nothing was modified.")
        return
    backup = FILE_PATH.with_suffix(".tsx.bak3")
    shutil.copy(FILE_PATH, backup)
    print(f"Backup saved to {backup}")
    text = text.replace(OLD, NEW, 1)
    FILE_PATH.write_text(text)
    print("Frontend patched successfully — auto-confirm call removed.")

if __name__ == "__main__":
    main()
