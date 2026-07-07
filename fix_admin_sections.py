from pathlib import Path

file = Path("src/pages/AdminPanel.tsx")
text = file.read_text()

for tab in ["admissions", "payments", "staff"]:
    text = text.replace(
        f'{{activeTab === "{tab}" && (',
        f'{{activeTab === "{tab}" && isSuperAdmin && ('
    )

file.write_text(text)

print("✅ Protected admissions, payments, and staff")

