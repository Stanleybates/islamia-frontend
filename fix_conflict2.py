from pathlib import Path

path = Path("src/pages/AdminPanel.tsx")
text = path.read_text()

start = text.find("<<<<<<< HEAD")
if start == -1:
    raise SystemExit("No conflict marker found.")

end = text.find(">>>>>>> teammate/main", start)
if end == -1:
    raise SystemExit("End conflict marker not found.")

end += len(">>>>>>> teammate/main")

replacement = r'''const session = localStorage.getItem("ami_admin_session");

    if (!session) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const s = JSON.parse(session);

      if (!s?.token) {
        localStorage.removeItem("ami_admin_session");
        setIsLoggedIn(false);
        return;
      }

      setCurrentAdmin(s);

      if (!useBackend) {
        localStorage.removeItem("ami_admin_session");
        setIsLoggedIn(false);
        toast.error("Admin access requires backend authentication.");
        return;
      }

      fetch(apiUrl('/api/admin/verify'), {
        headers: { Authorization: 'Bearer ' + s.token }
      }).then(res => {
        if (!res.ok) {
          localStorage.removeItem("ami_admin_session");
          setIsLoggedIn(false);
        } else {
          res.json().then(verified => {
            const merged = { ...s, ...verified };
            localStorage.setItem("ami_admin_session", JSON.stringify(merged));
            setCurrentAdmin(merged);
            setIsLoggedIn(true);
          });
        }
      }).catch(() => {
        localStorage.removeItem("ami_admin_session");
        setIsLoggedIn(false);
      });

    } catch {
      localStorage.removeItem("ami_admin_session");
      setIsLoggedIn(false);
    }'''

text = text[:start] + replacement + text[end:]

path.write_text(text)

print("Second conflict replaced.")
