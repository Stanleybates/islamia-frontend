path = 'src/pages/AdminPanel.tsx'

with open(path, 'r') as f:
    content = f.read()

old = '          {activeTab === "settings" && isSuperAdmin && ('

new = '''          {activeTab === "notifications" && !isSuperAdmin && (
            <div className="space-y-6">
              <h2 className="font-heading text-lg font-bold text-foreground">Notifications</h2>

              <div className="bg-card rounded-xl border border-border p-5 space-y-3">
                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                  <Award size={16} /> Grades Needing Review
                </h3>
                {(() => {
                  const pendingGrades = grades.filter((g: any) => currentAssignedCourseIds.includes(g.course) && g.status === "pending");
                  if (pendingGrades.length === 0) return <p className="text-sm text-muted-foreground">No pending grades right now.</p>;
                  return (
                    <ul className="space-y-2">
                      {pendingGrades.map((g: any) => (
                        <li key={g.id} className="text-sm border border-border rounded-lg p-3">
                          <span className="font-medium">{g.student}</span> — {g.course} · awaiting approval
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </div>

              <div className="bg-card rounded-xl border border-border p-5 space-y-3">
                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                  <ClipboardList size={16} /> Assessments Needing Review
                </h3>
                {(() => {
                  const pendingAssessments = assessments.filter((a: any) => currentAssignedCourseIds.includes(a.course) && a.approval_status !== "approved");
                  if (pendingAssessments.length === 0) return <p className="text-sm text-muted-foreground">No pending assessments right now.</p>;
                  return (
                    <ul className="space-y-2">
                      {pendingAssessments.map((a: any) => (
                        <li key={a.id} className="text-sm border border-border rounded-lg p-3">
                          <span className="font-medium">{a.title || a.type}</span> — {a.course} · awaiting approval
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </div>

              <div className="bg-card rounded-xl border border-border p-5 space-y-3">
                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                  <FileText size={16} /> New Admissions
                </h3>
                {(() => {
                  const mySemesters = new Set(currentAssignedCourses.map((c: any) => c.semester));
                  const newAdmissions = applications.filter((a: any) => a.status === "Pending" && mySemesters.has(a.semester));
                  if (newAdmissions.length === 0) return <p className="text-sm text-muted-foreground">No new admissions right now.</p>;
                  return (
                    <ul className="space-y-2">
                      {newAdmissions.map((a: any) => (
                        <li key={a.id} className="text-sm border border-border rounded-lg p-3">
                          <span className="font-medium">{a.fullName}</span> — {a.semester} · pending review
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </div>
            </div>
          )}
          {activeTab === "settings" && isSuperAdmin && ('''

if new in content:
    print("Already patched, skipping")
elif old in content:
    content = content.replace(old, new, 1)
    with open(path, 'w') as f:
        f.write(content)
    print("Patched: added Notifications tab content")
else:
    print("Pattern not found — check manually")
