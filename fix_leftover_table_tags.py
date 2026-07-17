#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/pages/AdminPanel.tsx")

OLD = """                      );
                    })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TIMETABLE INNER TAB */}"""

NEW = """                      );
                    })}
                  </div>
                </div>
              )}

              {/* TIMETABLE INNER TAB */}"""

def main():
    text = FILE_PATH.read_text()
    if OLD not in text:
        if NEW in text:
            print("Already applied. Nothing to do.")
        else:
            print("ERROR: Could not find the expected block. Nothing was modified.")
        return
    backup = FILE_PATH.with_suffix(".tsx.bak16")
    shutil.copy(FILE_PATH, backup)
    print(f"Backup saved to {backup}")
    text = text.replace(OLD, NEW, 1)
    FILE_PATH.write_text(text)
    print("Patched successfully.")

if __name__ == "__main__":
    main()
