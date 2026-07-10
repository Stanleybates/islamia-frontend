path = 'src/pages/AdminPanel.tsx'

with open(path, 'r') as f:
    content = f.read()

patches = []

patches.append((
    """import {
  Home, Users, BookOpen, CreditCard, Award, Settings,
  Plus, Search, Edit, Trash2, Eye, Download, X,
  GraduationCap, BarChart3, CheckCircle, XCircle, FileText,
  LogOut, EyeOff, Mail, Shield, Clock, Lock, Phone,
  ClipboardList
} from "lucide-react";""",
    """import {
  Home, Users, BookOpen, CreditCard, Award, Settings,
  Plus, Search, Edit, Trash2, Eye, Download, X,
  GraduationCap, BarChart3, CheckCircle, XCircle, FileText,
  LogOut, EyeOff, Mail, Shield, Clock, Lock, Phone,
  ClipboardList, Bell
} from "lucide-react";"""
))

patches.append((
    'type Tab = "overview" | "students" | "courses" | "assigned-courses" | "grades" | "payments" | "admissions" | "staff" | "admins" | "course-assignments" | "settings" | "fee" | "assessments" | "exam-results" | "schedule";',
    'type Tab = "overview" | "students" | "courses" | "assigned-courses" | "grades" | "payments" | "admissions" | "staff" | "admins" | "course-assignments" | "settings" | "fee" | "assessments" | "exam-results" | "schedule" | "notifications";'
))

patches.append((
    '  { key: "assessments", label: "Assessments", icon: ClipboardList, requiresCourse: true },\n  { key: "settings", label: "Settings", icon: Settings, superOnly: true },',
    '  { key: "assessments", label: "Assessments", icon: ClipboardList, requiresCourse: true },\n  { key: "notifications", label: "Notifications", icon: Bell, subOnly: true, requiresCourse: true },\n  { key: "settings", label: "Settings", icon: Settings, superOnly: true },'
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
