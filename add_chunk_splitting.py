#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("vite.config.ts")

OLD = """  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));"""

NEW = """  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "pdf-vendor": ["jspdf", "html2canvas"],
          "charts-vendor": ["recharts"],
          "icons-vendor": ["lucide-react"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
}));"""

def main():
    text = FILE_PATH.read_text()
    if "manualChunks" in text:
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
