from pathlib import Path

file = Path("src/pages/AdminPanel.tsx")

text = file.read_text()

# Remove old standalone FeeSettingsTab render
old = "{activeTab === 'fee' && isSuperAdmin && <FeeSettingsTab />}"

if old in text:
    text = text.replace(old, "")

# Insert FeeSettingsTab inside Settings before Data Management
target = """
              <div className=\"bg-card rounded-xl border border-border p-6\">
                <h3 className=\"font-heading font-semibold text-foreground mb-3\">Data Management</h3>
"""

insert = """
              {isSuperAdmin && (
                <FeeSettingsTab />
              )}

              <div className=\"bg-card rounded-xl border border-border p-6\">
                <h3 className=\"font-heading font-semibold text-foreground mb-3\">Data Management</h3>
"""

if target in text:
    text = text.replace(target, insert, 1)
else:
    print("Could not find Settings insertion point")
    exit(1)

file.write_text(text)

print("✅ FeeSettingsTab moved into Settings successfully")


