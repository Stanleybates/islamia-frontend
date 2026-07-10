path = 'src/pages/AdminPanel.tsx'

with open(path, 'r') as f:
    content = f.read()

patches = []

patches.append((
    '''                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                  <Award size={16} /> Grades Needing Review
                </h3>
                {(() => {
                  const pendingGrades = grades.filter((g: any) => currentAssignedCourseIds.includes(g.course) && g.status === "pending");''',
    '''                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                  <Award size={16} /> Grades Needing Review
                  {grades.filter((g: any) => currentAssignedCourseIds.includes(g.course) && g.status === "pending").length > 0 && (
                    <span className="bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {grades.filter((g: any) => currentAssignedCourseIds.includes(g.course) && g.status === "pending").length}
                    </span>
                  )}
                </h3>
                {(() => {
                  const pendingGrades = grades.filter((g: any) => currentAssignedCourseIds.includes(g.course) && g.status === "pending");'''
))

patches.append((
    '''                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                  <ClipboardList size={16} /> Assessments Needing Review
                </h3>
                {(() => {
                  const pendingAssessments = assessments.filter((a: any) => currentAssignedCourseIds.includes(a.course) && a.approval_status !== "approved");''',
    '''                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                  <ClipboardList size={16} /> Assessments Needing Review
                  {assessments.filter((a: any) => currentAssignedCourseIds.includes(a.course) && a.approval_status !== "approved").length > 0 && (
                    <span className="bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {assessments.filter((a: any) => currentAssignedCourseIds.includes(a.course) && a.approval_status !== "approved").length}
                    </span>
                  )}
                </h3>
                {(() => {
                  const pendingAssessments = assessments.filter((a: any) => currentAssignedCourseIds.includes(a.course) && a.approval_status !== "approved");'''
))

patches.append((
    '''                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                  <FileText size={16} /> New Admissions
                </h3>
                {(() => {
                  const mySemesters = new Set(currentAssignedCourses.map((c: any) => c.semester));
                  const newAdmissions = applications.filter((a: any) => a.status === "Pending" && mySemesters.has(a.semester));''',
    '''                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                  <FileText size={16} /> New Admissions
                  {(() => {
                    const mySemestersBadge = new Set(currentAssignedCourses.map((c: any) => c.semester));
                    const count = applications.filter((a: any) => a.status === "Pending" && mySemestersBadge.has(a.semester)).length;
                    return count > 0 ? (
                      <span className="bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {count}
                      </span>
                    ) : null;
                  })()}
                </h3>
                {(() => {
                  const mySemesters = new Set(currentAssignedCourses.map((c: any) => c.semester));
                  const newAdmissions = applications.filter((a: any) => a.status === "Pending" && mySemesters.has(a.semester));'''
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
