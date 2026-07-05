import { useState } from "react";
import { Menu, X, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import AdmissionFormDialog from "./AdmissionFormDialog";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Courses", href: "#courses" },
  { label: "Departments", href: "#departments" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdmission, setShowAdmission] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <a href="#home" className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 border border-primary/20 shadow-lg backdrop-blur-md">
                <img src={logo} alt="Allahul Musta'an Institute" className="h-9 sm:h-10 w-auto" />
              </div>
              <div className="hidden sm:block">
                <p className="font-heading text-sm font-bold text-primary leading-tight">Allāhul Musta'ān</p>
                <p className="text-xs text-muted-foreground">Institute for Arabic Language</p>
              </div>
            </a>

            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                  {link.label}
                </a>
              ))}
              <Link to="/student/login" className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                <GraduationCap size={16} />Student Portal
              </Link>
              <ThemeToggle />
              <button
                onClick={() => setShowAdmission(true)}
                className="bg-accent text-accent-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-all shadow-md"
              >
                Apply Now
              </button>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-foreground hover:text-primary transition-colors" aria-label="Toggle menu">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {isOpen && (
            <div className="md:hidden animate-slide-down border-t border-border pb-4">
              <div className="flex flex-col gap-1 pt-2">
                {navLinks.map((link) => (
                  <a key={link.label} href={link.href} onClick={() => setIsOpen(false)} className="px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted rounded-lg transition-colors">
                    {link.label}
                  </a>
                ))}
                <Link to="/student/login" onClick={() => setIsOpen(false)} className="px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted rounded-lg transition-colors flex items-center gap-2">
                  <GraduationCap size={16} />Student Portal
                </Link>
                <button
                  onClick={() => { setIsOpen(false); setShowAdmission(true); }}
                  className="mx-4 mt-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-lg text-sm font-semibold text-center hover:bg-accent/90 transition-all"
                >
                  Apply Now
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <AdmissionFormDialog open={showAdmission} onClose={() => setShowAdmission(false)} />
    </>
  );
};

export default Navbar;
