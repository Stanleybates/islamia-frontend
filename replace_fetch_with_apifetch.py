#!/usr/bin/env python3
from pathlib import Path

FILES = [
    Path("src/pages/AdminPanel.tsx"),
    Path("src/pages/StudentPortal.tsx"),
    Path("src/components/PaymentSection.tsx"),
]

for file_path in FILES:
    if not file_path.exists():
        print(f"SKIP: {file_path} not found")
        continue

    text = file_path.read_text()
    original = text

    count = text.count("fetch(apiUrl(")
    text = text.replace("fetch(apiUrl(", "apiFetch(apiUrl(")

    # Ensure apiFetch is imported wherever apiUrl is imported
    if "apiFetch" not in text.split("\n")[0:20].__str__():
        pass  # we'll handle import insertion below regardless

    if "import { apiUrl } from '@/lib/apiClient';" in text and "apiFetch" not in text.split("import")[0]:
        if "import { apiUrl, apiFetch }" not in text:
            text = text.replace(
                "import { apiUrl } from '@/lib/apiClient';",
                "import { apiUrl, apiFetch } from '@/lib/apiClient';",
                1
            )
    elif "from '@/lib/apiClient'" in text and "apiFetch" not in text:
        # apiUrl imported some other way (e.g. combined with apiClient default import) - add a separate import line
        import re
        m = re.search(r"^import .* from '@/lib/apiClient';", text, re.MULTILINE)
        if m and "apiFetch" not in m.group(0):
            text = text[:m.end()] + "\nimport { apiFetch } from '@/lib/apiClient';" + text[m.end():]

    if text != original:
        backup = file_path.with_suffix(file_path.suffix + ".bak_apifetch")
        backup.write_text(original)
        file_path.write_text(text)
        print(f"{file_path}: replaced {count} occurrence(s), backup saved to {backup}")
    else:
        print(f"{file_path}: no changes made")
