path = 'src/pages/AdminPanel.tsx'

with open(path, 'r') as f:
    content = f.read()

old = """              <div>
                <h3 className="font-heading font-bold text-lg">
                  {selectedAdmin.username}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select courses to assign
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {courses.filter((course) => {
                  const takenByAnyone = adminAccounts.some(
                    (a) => normalizeAssignedCourses(a.assignedCourses).includes(course.id)
                  );
                  return !takenByAnyone;
                }).map((course) => ("""

new = """              <div>
                <h3 className="font-heading font-bold text-lg">
                  {selectedAdmin.username}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select courses to assign
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Assigned Courses</p>
                {current.length === 0 ? (
                  <p className="text-xs text-muted-foreground mb-3">No courses assigned yet.</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 mb-4">
                    {courses.filter((course) => current.includes(course.id)).map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between gap-3 border border-border rounded-lg p-3 bg-muted/20"
                      >
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {course.semester} · {course.status}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive border-destructive/30"
                          onClick={() =>
                            saveCourseAssignments(
                              selectedAdmin.id,
                              current.filter((id) => id !== course.id)
                            )
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-sm font-semibold text-foreground mb-1">Available Courses</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {courses.filter((course) => {
                  const takenByAnyone = adminAccounts.some(
                    (a) => normalizeAssignedCourses(a.assignedCourses).includes(course.id)
                  );
                  return !takenByAnyone;
                }).map((course) => ("""

if new in content:
    print("Already patched, skipping")
elif old in content:
    content = content.replace(old, new, 1)
    with open(path, 'w') as f:
        f.write(content)
    print("Patched: added Assigned Courses section with remove buttons")
else:
    print("Pattern not found — check manually")
