path = 'src/pages/StudentPortal.tsx'

with open(path, 'r') as f:
    content = f.read()

patches = []

patches.append((
    """      const res = await apiClient.studentLogin(authForm.indexNumber, authForm.password);
      localStorage.setItem('ami_student_session', JSON.stringify({ ...res.user, token: res.token }));
      sessionStorage.setItem('ami_student_active', '1');
      setIsLoggedIn(true);
      loadStudentData();
      toast.success('Login successful! Welcome back.');""",
    """      const res = await apiClient.studentLogin(authForm.indexNumber, authForm.password);
      localStorage.setItem('ami_student_session', JSON.stringify({ ...res.user, token: res.token }));
      localStorage.setItem('ami_last_activity_ts', String(Date.now()));
      sessionStorage.setItem('ami_student_active', '1');
      setIsLoggedIn(true);
      loadStudentData();
      toast.success('Login successful! Welcome back.');"""
))

patches.append((
    """      const res = await apiClient.studentSignup({ indexNumber: authForm.indexNumber, phone: authForm.phone, password: authForm.password });
      localStorage.setItem('ami_student_session', JSON.stringify({ ...res.user, token: res.token }));
      sessionStorage.setItem('ami_student_active', '1');
      setIsLoggedIn(true);
      loadStudentData();""",
    """      const res = await apiClient.studentSignup({ indexNumber: authForm.indexNumber, phone: authForm.phone, password: authForm.password });
      localStorage.setItem('ami_student_session', JSON.stringify({ ...res.user, token: res.token }));
      localStorage.setItem('ami_last_activity_ts', String(Date.now()));
      sessionStorage.setItem('ami_student_active', '1');
      setIsLoggedIn(true);
      loadStudentData();"""
))

applied = 0
skipped = 0
missing = 0
for old, new in patches:
    if new in content:
        skipped += 1
        continue
    if old in content:
        content = content.replace(old, new, 1)
        applied += 1
    else:
        missing += 1
        print("NOT FOUND:", old[:70])

with open(path, 'w') as f:
    f.write(content)

print(f"Applied: {applied}, Already patched: {skipped}, Not found: {missing}")
