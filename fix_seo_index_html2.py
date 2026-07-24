#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("index.html")
DOMAIN = "https://allahul-mustaan-institute.com"

def patch(text, old, new, label):
    if new in text:
        return text, False
    if text.count(old) != 1:
        print(f"WARNING: '{label}' not found exactly once (found {text.count(old)}), skipping")
        return text, False
    return text.replace(old, new, 1), True

def main():
    text = FILE_PATH.read_text()
    backup = FILE_PATH.with_suffix(".html.bak2")
    shutil.copy(FILE_PATH, backup)
    print(f"Backup saved to {backup}")

    any_change = False

    text, c = patch(
        text,
        '<meta name="author" content="Allahul Musta\'an Institute" />',
        f'<meta name="author" content="Allahul Musta\'an Institute" />\n    <link rel="canonical" href="{DOMAIN}/" />',
        "canonical link"
    )
    any_change = any_change or c

    text, c = patch(
        text,
        '<meta property="og:description" content="Admissions, courses, student portal, and fees." />\n    <!-- Social media preview image -->\n    <meta property="og:image" content="/allahul%20musta\'a.png">',
        f'<meta property="og:description" content="Admissions, courses, student portal, and fees." />\n    <meta property="og:url" content="{DOMAIN}/" />\n    <!-- Social media preview image -->\n    <meta property="og:image" content="{DOMAIN}/allahul%20musta\'a.png">',
        "og:url + absolute og:image"
    )
    any_change = any_change or c

    text, c = patch(
        text,
        '<meta name="twitter:image" content="/allahul%20musta\'a.png">',
        f'<meta name="twitter:image" content="{DOMAIN}/allahul%20musta\'a.png">',
        "absolute twitter:image"
    )
    any_change = any_change or c

    text, c = patch(
        text,
        '"url": "/",\n        "logo": "/allahul%20musta\'a.png"',
        f'"url": "{DOMAIN}/",\n        "logo": "{DOMAIN}/allahul%20musta\'a.png"',
        "absolute schema.org urls"
    )
    any_change = any_change or c

    if any_change:
        FILE_PATH.write_text(text)
        print("File saved.")
    else:
        print("No changes made.")

if __name__ == "__main__":
    main()
