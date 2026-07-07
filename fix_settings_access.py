from pathlib import Path

file = Path("src/pages/AdminPanel.tsx")
text = file.read_text()

text = text.replace(
    '{ key: "settings", label: "Settings", icon: Settings },',
    '{ key: "settings", label: "Settings", icon: Settings, superOnly: true },'
)

text = text.replace(
    '{activeTab === "settings" && (',
    '{activeTab === "settings" && isSuperAdmin && ('
)

file.write_text(text)

print("✅ Settings restricted to Super Admin")
