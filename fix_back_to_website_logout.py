path = 'src/pages/AdminPanel.tsx'

with open(path, 'r') as f:
    content = f.read()

old = """          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors">
            <Home size={16} />Back to Website
          </Link>"""

new = """          <Link to="/" onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors">
            <Home size={16} />Back to Website
          </Link>"""

if new in content:
    print("Already patched, skipping")
elif old in content:
    content = content.replace(old, new, 1)
    with open(path, 'w') as f:
        f.write(content)
    print("Patched: Back to Website link now logs the admin out")
else:
    print("Pattern not found — check manually")
