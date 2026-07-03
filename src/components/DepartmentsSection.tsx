import { BookOpen, Mail, MessageCircle, Users, Phone } from "lucide-react";

const academicStaff = [
  { name: "Mustapha Abbass Bah", role: "Lecturer — Reading 1", phone: "+966 54 776 3984", email: "mabah9as@gmail.com" },
];
const adminStaff = [
  { name: "Ahmed Osama", role: "Admissions & Student Affairs", phone: "+233 55 054 5403", email: "—" },
];

const WHATSAPP_NUMBER = "233550545403";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Assalamu Alaikum, I would like to inquire about admission requirements.")}`;

const DepartmentsSection = () => {
  return (
    <section id="departments" className="section-padding bg-background">
      <div className="container-max">
        <div className="text-center mb-14">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Organizational Structure</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">Our Departments</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Specialized departments ensuring excellence at every step of your academic journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Academic Department */}
          <div className="bg-card rounded-2xl border border-border p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-accent to-secondary rounded-l-2xl" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center">
                <BookOpen size={28} className="text-foreground" />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold text-foreground">Academic Department</h3>
                <p className="text-sm text-muted-foreground">Teaching & Curriculum</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
              Responsible for teaching and curriculum development. Oversees all academic programs,
              course design, and quality of instruction across all four semesters.
            </p>

            <div className="bg-muted/50 rounded-xl p-5 mb-6">
              <h4 className="font-heading font-semibold text-foreground mb-3 text-sm">Academic Programs</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Two-year program (4 semesters) covering Arabic Language, Qur'ānic Studies, Islamic Sciences, and Communication Skills.
                Graduates receive a <span className="font-semibold text-primary">Certificate in Arabic Language & Islamic Studies</span>.
              </p>
            </div>

            <div className="mb-6">
              <h4 className="font-heading font-semibold text-foreground mb-3 text-sm">Faculty / Staff</h4>
              <div className="space-y-3">
                {academicStaff.map((s) => (
                  <div key={s.name} className="bg-background rounded-lg border border-border p-3">
                    <p className="font-semibold text-sm text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground mb-2">{s.role}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Phone size={12} className="text-primary" />{s.phone}</span>
                      <span className="flex items-center gap-1"><Mail size={12} className="text-primary" />{s.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail size={14} className="text-primary" />
                <span>allahulmustaaninstitute@gmail.com</span>
              </div>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle size={14} className="text-green-600" />
                <span>+233 55 054 5403</span>
              </a>
            </div>
          </div>

          {/* Department of Admissions & Students Affairs */}
          <div className="bg-card rounded-2xl border border-border p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-accent rounded-l-2xl" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Users size={28} />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold text-foreground">Admissions & Students Affairs</h3>
                <p className="text-sm text-muted-foreground">Enrollment • Welfare • Records</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-5 leading-relaxed text-sm">
              Manages applications, enrollment, attendance, fees, and student welfare. Detailed admission requirements, policies, grading and fees are presented in the Academic Excellence Framework below.
            </p>

            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Application is FREE.</span> After admission, the semester fee will be notified, and the fee amount will depend on the semester you are in.
              </p>
            </div>

            <div className="mb-5">
              <h4 className="font-heading font-semibold text-foreground mb-3 text-sm">Staff</h4>
              <div className="space-y-3">
                {adminStaff.map((s) => (
                  <div key={s.name} className="bg-background rounded-lg border border-border p-3">
                    <p className="font-semibold text-sm text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground mb-2">{s.role}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Phone size={12} className="text-primary" />{s.phone}</span>
                      <span className="flex items-center gap-1"><Mail size={12} className="text-primary" />{s.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 text-xs mt-5">
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle size={14} className="text-green-600" />
                <span>+233 55 054 5403</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;
