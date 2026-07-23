#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/lib/apiClient.ts")

OLD = """export function apiUrl(path: string) {
  if (!RAW_BASE) return path;
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (RAW_BASE === origin) return path;
  }
  return RAW_BASE + path;
}"""

NEW = """export function apiUrl(path: string) {
  if (!RAW_BASE) return path;
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (RAW_BASE === origin) return path;
  }
  return RAW_BASE + path;
}

// Wraps fetch to always send credentials (cookies) - required so the
// csrf_secret cookie actually reaches the backend on cross-subdomain
// requests. Without this, CSRF-protected endpoints fail with
// "CSRF token missing" even when the x-csrf-token header is present,
// because the cookie half of the pair never gets sent.
export function apiFetch(url: string, options: RequestInit = {}) {
  return fetch(url, { credentials: 'include', ...options, credentials: 'include' });
}"""

def main():
    text = FILE_PATH.read_text()
    if "export function apiFetch" in text:
        print("Already applied. Nothing to do.")
        return
    if OLD not in text:
        print("ERROR: Could not find the expected block. Nothing was modified.")
        return
    backup = FILE_PATH.with_suffix(".ts.bak")
    shutil.copy(FILE_PATH, backup)
    print(f"Backup saved to {backup}")
    text = text.replace(OLD, NEW, 1)
    FILE_PATH.write_text(text)
    print("Patched successfully.")

if __name__ == "__main__":
    main()
