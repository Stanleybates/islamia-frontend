#!/usr/bin/env python3
"""
Cleanup: removes stray *.bak* files scattered throughout the repo (found
in controllers/, routes/, models/, middleware/, pages/, components/,
lib/, etc. -- not just the root), and makes sure *.bak* is gitignored
going forward so this doesn't build back up.

These accumulate two ways:
  1. An editor/tool that auto-saves a numbered or timestamped backup on
     every edit (e.g. file.js.bak2, file.js.bak_20260806_015941).
  2. The one-off fix/patch scripts we've been running this session, which
     each save a single file.ext.bak before patching.

Either way, none of them are referenced by your actual code -- they're
just old copies sitting in the working tree. This script deletes them
all and adds "*.bak*" to .gitignore so new ones never get committed.

Usage (run from the root of a repo, e.g. in Termux):
    python cleanup_bak_files.py

Run this separately in EACH repo (backend and frontend).

Safe by design:
  - Only touches files matching *.bak* (with a dot before "bak", so it
    won't accidentally match something like "backup.js").
  - Skips node_modules/ and .git/ entirely.
  - Prints every file it removes and the total space freed.
"""

import fnmatch
import os
import sys

PATTERN = "*.bak*"


def find_bak_files(root):
    matches = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in ("node_modules", ".git")]
        for name in filenames:
            if fnmatch.fnmatch(name, PATTERN):
                matches.append(os.path.join(dirpath, name))
    return matches


def ensure_gitignore_entry(cwd, pattern):
    gitignore_path = os.path.join(cwd, ".gitignore")

    if not os.path.exists(gitignore_path):
        with open(gitignore_path, "w", encoding="utf-8") as f:
            f.write(pattern + "\n")
        print(f"Created .gitignore with entry: {pattern}")
        return

    with open(gitignore_path, "r", encoding="utf-8") as f:
        lines = f.read().splitlines()

    normalized = {line.strip() for line in lines}
    if pattern in normalized:
        print(f".gitignore already ignores '{pattern}' -- nothing to add.")
        return

    with open(gitignore_path, "a", encoding="utf-8") as f:
        if lines and lines[-1].strip() != "":
            f.write("\n")
        f.write(pattern + "\n")
    print(f"Added to .gitignore: {pattern}")


def main():
    cwd = os.getcwd()
    files = find_bak_files(cwd)

    if not files:
        print("No *.bak* files found. Nothing to clean up.")
    else:
        total_bytes = 0
        for path in files:
            try:
                total_bytes += os.path.getsize(path)
            except OSError:
                pass

        print(f"Found {len(files)} .bak file(s), {total_bytes / 1024 / 1024:.1f} MB total.\n")
        for path in files:
            rel = os.path.relpath(path, cwd)
            try:
                os.remove(path)
                print(f"Deleted: {rel}")
            except OSError as e:
                print(f"Could not delete {rel}: {e}")

        print(f"\nRemoved {len(files)} file(s), freed {total_bytes / 1024 / 1024:.1f} MB.")

    ensure_gitignore_entry(cwd, PATTERN)

    print("\nDone. Remember to run this separately in the other repo too")
    print("(backend and frontend), and check with `git status` whether any")
    print("of these .bak files were previously tracked by git -- if so,")
    print("they'll show as deleted and you'll want to commit that removal.")


if __name__ == "__main__":
    main()