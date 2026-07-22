#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/components/PaymentSection.tsx")

OLD = """    // Auto-fill from payment link (?code=...)
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      setAdmissionId(code.toUpperCase());
      lookupAdmission(code);
    }
    return () => clearInterval(interval);"""

NEW = """    // Auto-fill from payment link (?code=...)
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      setAdmissionId(code.toUpperCase());
      lookupAdmission(code);
    }
    // Manually scroll to the payments section - React renders this content
    // after the initial page load, so the browser's native scroll-to-hash
    // (which only works if the element exists at load time) doesn't fire.
    if (window.location.hash === '#payments') {
      setTimeout(() => {
        document.getElementById('payments')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
    return () => clearInterval(interval);"""

def main():
    text = FILE_PATH.read_text()
    if "Manually scroll to the payments section" in text:
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
