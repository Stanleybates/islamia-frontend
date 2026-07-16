#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/pages/AdminPanel.tsx")

# 1. Remove superOnly restriction from sidebar item
OLD_SIDEBAR = '  { key: "settings", label: "Settings", icon: Settings, superOnly: true },'
NEW_SIDEBAR = '  { key: "settings", label: "Settings", icon: Settings },'

# 2. Restructure the settings content block
OLD_CONTENT = '''          {activeTab === "settings" && isSuperAdmin && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="font-heading text-lg font-bold text-foreground">Settings</h2>
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h3 className="font-heading font-semibold text-foreground">Institute Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Institute Name</label>
                    <input className={inputClass} defaultValue="Allāhul Musta'ān Institute for Teaching Arabic Language" readOnly />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Contact Number</label>
                    <input
                      className={inputClass}
                      value={settings.contactNumber}
                      onChange={(e) => setSettings({ ...settings, contactNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
                    <input
                      className={inputClass}
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <Button onClick={saveSettings} disabled={settingsSaving}>
                    {settingsSaving ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </div>
              {isSuperAdmin && (
                <FeeSettingsTab />
              )}

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-heading font-semibold text-foreground mb-3">Data Management</h3>
                <p className="text-sm text-muted-foreground mb-4">Export or manage stored data.</p>
                <Button variant="outline" className="gap-2"><Download size={16} /> Export Data</Button>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h3 className="font-heading font-semibold text-foreground">Change Password</h3>
                <p className="text-sm text-muted-foreground">Update your account password.</p>
                <ChangePasswordForm />
              </div>
            </div>
          )}'''

NEW_CONTENT = '''          {activeTab === "settings" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="font-heading text-lg font-bold text-foreground">Settings</h2>
              {isSuperAdmin && (
                <>
                  <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                    <h3 className="font-heading font-semibold text-foreground">Institute Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-1.5">Institute Name</label>
                        <input className={inputClass} defaultValue="Allāhul Musta'ān Institute for Teaching Arabic Language" readOnly />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-1.5">Contact Number</label>
                        <input
                          className={inputClass}
                          value={settings.contactNumber}
                          onChange={(e) => setSettings({ ...settings, contactNumber: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
                        <input
                          className={inputClass}
                          value={settings.email}
                          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button onClick={saveSettings} disabled={settingsSaving}>
                        {settingsSaving ? 'Saving...' : 'Save Settings'}
                      </Button>
                    </div>
                  </div>
                  <FeeSettingsTab />
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="font-heading font-semibold text-foreground mb-3">Data Management</h3>
                    <p className="text-sm text-muted-foreground mb-4">Export or manage stored data.</p>
                    <Button variant="outline" className="gap-2"><Download size={16} /> Export Data</Button>
                  </div>
                </>
              )}
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h3 className="font-heading font-semibold text-foreground">Change Password</h3>
                <p className="text-sm text-muted-foreground">Update your account password.</p>
                <ChangePasswordForm />
              </div>
            </div>
          )}'''

def main():
    text = FILE_PATH.read_text()
    if NEW_SIDEBAR in text and OLD_SIDEBAR not in text:
        print("Already applied. Nothing to do.")
        return

    backup = FILE_PATH.with_suffix(".tsx.bak13")
    shutil.copy(FILE_PATH, backup)
    print(f"Backup saved to {backup}")

    changed = False
    for old, new, label in [(OLD_SIDEBAR, NEW_SIDEBAR, "sidebar item"), (OLD_CONTENT, NEW_CONTENT, "settings content")]:
        if old in text:
            text = text.replace(old, new, 1)
            changed = True
            print(f"Patched: {label}")
        else:
            print(f"WARNING: could not find block for {label}")

    if changed:
        FILE_PATH.write_text(text)
        print("File saved.")

if __name__ == "__main__":
    main()
