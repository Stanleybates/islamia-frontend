#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("index.html")
DOMAIN = "https://allahul-mustaan-institute.com"

OLD = """    <meta name="author" content="Allahul Musta'an Institute" />


    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Allahul Musta'an Institute" />
    <meta property="og:title" content="Allahul Musta'an Institute" />
    <meta property="og:description" content="Admissions, courses, student portal, and fees." />
    <!-- Social media preview image -->
    <meta property="og:image" content="/allahul%20musta'a.png">
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Allahul Musta'an Institute" />
    <meta name="twitter:description" content="Admissions, courses, student portal, and fees." />
    <meta name="twitter:image" content="/allahul%20musta'a.png">

    <!-- Browser tab icon -->
    <link rel="icon" type="image/png" href="/allahul%20musta'a.png">
    <link rel="apple-touch-icon" href="/allahul%20musta'a.png">
    <link rel="shortcut icon" href="/allahul%20musta'a.png">
    <meta name="twitter:site" content="@AllahulMustaAn" />
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "Allahul Musta'an Institute",
        "url": "/",
        "logo": "/allahul%20musta'a.png"
      }
    </script>"""

NEW = f"""    <meta name="author" content="Allahul Musta'an Institute" />

    <link rel="canonical" href="{DOMAIN}/" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Allahul Musta'an Institute" />
    <meta property="og:title" content="Allahul Musta'an Institute" />
    <meta property="og:description" content="Admissions, courses, student portal, and fees." />
    <meta property="og:url" content="{DOMAIN}/" />
    <!-- Social media preview image -->
    <meta property="og:image" content="{DOMAIN}/allahul%20musta'a.png">
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Allahul Musta'an Institute" />
    <meta name="twitter:description" content="Admissions, courses, student portal, and fees." />
    <meta name="twitter:image" content="{DOMAIN}/allahul%20musta'a.png">

    <!-- Browser tab icon -->
    <link rel="icon" type="image/png" href="/allahul%20musta'a.png">
    <link rel="apple-touch-icon" href="/allahul%20musta'a.png">
    <link rel="shortcut icon" href="/allahul%20musta'a.png">
    <meta name="twitter:site" content="@AllahulMustaAn" />
    <script type="application/ld+json">
      {{
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "Allahul Musta'an Institute",
        "url": "{DOMAIN}/",
        "logo": "{DOMAIN}/allahul%20musta'a.png"
      }}
    </script>"""

def main():
    text = FILE_PATH.read_text()
    if 'rel="canonical"' in text:
        print("Already applied. Nothing to do.")
        return
    if OLD not in text:
        print("ERROR: Could not find the expected block. Nothing was modified.")
        return
    backup = FILE_PATH.with_suffix(".html.bak")
    shutil.copy(FILE_PATH, backup)
    print(f"Backup saved to {backup}")
    text = text.replace(OLD, NEW, 1)
    FILE_PATH.write_text(text)
    print("Patched successfully.")

if __name__ == "__main__":
    main()
