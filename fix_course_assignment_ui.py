from pathlib import Path

file = Path("src/pages/AdminPanel.tsx")

text = file.read_text()

start = text.index('{activeTab === "course-assignments" && isSuperAdmin && (')
end = text.index('{activeTab === "assessments" && (')

new_block = r'''{activeTab === "course-assignments" && isSuperAdmin && (
  <div className="space-y-6">
    <div>
      <h2 className="font-heading text-lg font-bold text-foreground">
        Course Assignments
      </h2>
      <p className="text-sm text-muted-foreground">
        Assign courses to sub-admins and lecturers.
      </p>
    </div>

    <div className="flex gap-2">
      {["assigned", "unassigned"].map((tab) => (
        <button
          key={tab}
          onClick={() => setAssignmentFilter(tab as any)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            assignmentFilter === tab
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border text-muted-foreground"
          }`}
        >
          {tab === "assigned" ? "👥 Assigned" : "⚠️ Unassigned"}
        </button>
      ))}
    </div>

    <div className="bg-card border border-border rounded-xl p-5">
      {adminAccounts
        .filter((a) => a.role !== "super")
        .filter((a) =>
          assignmentFilter === "assigned"
            ? normalizeAssignedCourses(a.assignedCourses).length > 0
            : normalizeAssignedCourses(a.assignedCourses).length === 0
        )
        .map((admin) => (
          <div
            key={admin.id}
            className="flex items-center justify-between border-b border-border py-3"
          >
            <div>
              <p className="font-semibold text-foreground">
                {admin.username}
              </p>
              <p className="text-xs text-muted-foreground">
                {normalizeAssignedCourses(admin.assignedCourses).length} courses assigned
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => setAssignmentAdminId(admin.id)}
            >
              Manage
            </Button>
          </div>
        ))}
    </div>

    {assignmentAdminId && (
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">

        <Button
          variant="outline"
          onClick={() => setAssignmentAdminId(null)}
        >
          ← Back
        </Button>

        {(() => {
          const selectedAdmin = adminAccounts.find(
            (a) => a.id === assignmentAdminId
          );

          if (!selectedAdmin) return null;

          const current =
            assignmentDrafts[selectedAdmin.id] ||
            normalizeAssignedCourses(selectedAdmin.assignedCourses);

          return (
            <>
              <div>
                <h3 className="font-heading font-bold text-lg">
                  {selectedAdmin.username}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select courses to assign
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {courses.map((course) => (
                  <label
                    key={course.id}
                    className="flex gap-3 border border-border rounded-lg p-3 cursor-pointer hover:bg-muted/30"
                  >
                    <input
                      type="checkbox"
                      checked={current.includes(course.id)}
                      onChange={() =>
                        setAssignmentDrafts((prev) => {
                          const next = current.includes(course.id)
                            ? current.filter((id) => id !== course.id)
                            : [...current, course.id];

                          return {
                            ...prev,
                            [selectedAdmin.id]: next,
                          };
                        })
                      }
                    />

                    <div>
                      <p className="font-medium">
                        {course.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {course.semester} · {course.status}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <Button
                onClick={() =>
                  saveCourseAssignments(
                    selectedAdmin.id,
                    assignmentDrafts[selectedAdmin.id] || []
                  )
                }
              >
                Save Assignments
              </Button>
            </>
          );
        })()}
      </div>
    )}
  </div>
)}
'''

file.write_text(text[:start] + new_block + text[end:])

print("✅ Course Assignment UI updated successfully")

