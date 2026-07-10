path = 'src/pages/AdminPanel.tsx'

with open(path, 'r') as f:
    content = f.read()

old = """            const pendingAdminCount = adminAccounts.filter((a: any) => a.status === "pending").length;
            return ("""

new = """            const pendingAdminCount = adminAccounts.filter((a: any) => a.status === "pending").length;
            const pendingGradesCount = grades.filter((g: any) => currentAssignedCourseIds.includes(g.course) && g.status === "pending").length;
            const pendingAssessmentsCount = assessments.filter((a: any) => currentAssignedCourseIds.includes(a.course) && a.approval_status !== "approved").length;
            const mySemestersSet = new Set(currentAssignedCourses.map((c: any) => c.semester));
            const newAdmissionsCount = applications.filter((a: any) => a.status === "Pending" && mySemestersSet.has(a.semester)).length;
            const notificationCount = pendingGradesCount + pendingAssessmentsCount + newAdmissionsCount;
            return ("""

if new in content:
    print("Already patched, skipping")
elif old in content:
    content = content.replace(old, new, 1)
    with open(path, 'w') as f:
        f.write(content)
    print("Patched: added notification count computation")
else:
    print("Pattern not found — check manually")

old2 = """              {item.key === "admins" && pendingAdminCount > 0 && (
                <span className="bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {pendingAdminCount}
                </span>
              )}
            </button>"""

new2 = """              {item.key === "admins" && pendingAdminCount > 0 && (
                <span className="bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {pendingAdminCount}
                </span>
              )}
              {item.key === "notifications" && notificationCount > 0 && (
                <span className="bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {notificationCount}
                </span>
              )}
            </button>"""

if new2 in content:
    print("Badge already patched, skipping")
elif old2 in content:
    content = content.replace(old2, new2, 1)
    with open(path, 'w') as f:
        f.write(content)
    print("Patched: added notification badge on sidebar")
else:
    print("Badge pattern not found — check manually")
