import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CoursesSection from "@/components/CoursesSection";
import DepartmentsSection from "@/components/DepartmentsSection";
import MissionVisionSection from "@/components/MissionVisionSection";
import PaymentSection from "@/components/PaymentSection";
import AcademicPoliciesSection from "@/components/AcademicPoliciesSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { GraduationCap, MessageCircle, X, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import AdmissionFormDialog from "@/components/AdmissionFormDialog";
import { apiUrl } from "@/lib/apiClient";

const WHATSAPP_NUMBER = "233550545403";

const Index = () => {
  const [showAdmission, setShowAdmission] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [admissionStart, setAdmissionStart] = useState('');
  const [admissionEnd, setAdmissionEnd] = useState('');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isOpen, setIsOpen] = useState(false); // admission is currently open
  const [isClosed, setIsClosed] = useState(false); // admission has ended

  useEffect(() => {
    // Fetch admission dates from backend
    fetch(apiUrl('/api/admin/settings'))
      .then(r => r.ok ? r.json() : {})
      .then(d => {
        const start = d.admissionStart || d.admission_start || '';
        const end = d.admissionEnd || d.admission_end || '';
        if (start) setAdmissionStart(start);
        if (end) setAdmissionEnd(end);
        // Show popup only once per session
        const popupKey = 'ami_admission_popup_' + (start || 'none') + '_' + (end || 'none');
        if (!sessionStorage.getItem(popupKey)) {
          setShowPopup(true);
          sessionStorage.setItem(popupKey, '1');
        } else {
          setShowBanner(true);
        }
      })
      .catch(() => {
        if (!sessionStorage.getItem('ami_admission_popup_none_none')) {
          setShowPopup(true);
          sessionStorage.setItem('ami_admission_popup_none_none', '1');
        } else {
          setShowBanner(true);
        }
      });
  }, []);

  // Countdown logic
  useEffect(() => {
    if (!admissionStart && !admissionEnd) return;
    const now = new Date();
    const start = admissionStart ? new Date(admissionStart) : null;
    const end = admissionEnd ? new Date(admissionEnd) : null;

    // Determine if admission is open or closed
    const open = start && end ? now >= start && now <= end : false;
    const closed = end ? now > end : false;
    setIsOpen(open);
    setIsClosed(closed);

    // Count down to start if not open yet, or to end if open
    const target = open ? end : start;
    if (!target) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        clearInterval(interval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [admissionStart, admissionEnd]);

  const handleClosePopup = () => {
    setShowPopup(false);
    setShowBanner(true);
  };

  return (
    <div className="min-h-screen">
      {/* Admission Countdown Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl p-8 max-w-md w-full relative">
            <button onClick={handleClosePopup} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Clock size={28} className="text-primary" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-1">
                {isClosed ? "Admission Closed" : isOpen ? "Admission is Open!" : "Admission Will Open Soon"}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {isClosed
                  ? "Admission has closed. Stay tuned for the next cycle. Barakallahu feekum!"
                  : isOpen && admissionEnd
                  ? `Closes on ${new Date(admissionEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
                  : admissionStart && !isOpen
                  ? `Opens on ${new Date(admissionStart).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
                  : "Stay tuned for the next admission cycle. Barakallahu feekum!"}
              </p>
              {(admissionStart || admissionEnd) && (
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {[
                    { label: 'Days', value: countdown.days },
                    { label: 'Hours', value: countdown.hours },
                    { label: 'Mins', value: countdown.minutes },
                    { label: 'Secs', value: countdown.seconds },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-primary/10 rounded-xl p-3">
                      <p className="text-2xl font-bold text-primary">{String(value).padStart(2, '0')}</p>
                      <p className="text-xs text-muted-foreground mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              )}
              {isClosed ? (
                <div className="w-full text-center py-3 bg-destructive/10 text-destructive rounded-lg text-sm font-semibold">
                  Admission is Closed
                </div>
              ) : isOpen ? (
                <Button variant="gold" className="w-full" onClick={() => { handleClosePopup(); setShowAdmission(true); }}>
                  Apply Now
                </Button>
              ) : (
                <div className="w-full text-center py-3 bg-muted text-muted-foreground rounded-lg text-sm">
                  Admission dates will be announced soon
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Navbar />
      <HeroSection />
      <CoursesSection />

      {/* Apply Now Section */}
      <section id="apply-now-section" className="section-padding bg-primary/5">
        <div className="container-max text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Apply now to join Allāhul Musta'ān Institute and start your path to mastering the Arabic language. Upon completing the 2-year program, you will receive a Certificate in Arabic Language & Islamic Studies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gold" size="lg" className="text-base px-8 py-6" onClick={() => setShowAdmission(true)}>
              <GraduationCap size={20} />
              Apply Now
            </Button>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Assalamu Alaikum, I would like to inquire about admission to Allāhul Musta'ān Institute.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-green-700 transition-colors shadow-md"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <DepartmentsSection />
      <AcademicPoliciesSection />
      <MissionVisionSection />
      <PaymentSection />
      <Footer />

      <AdmissionFormDialog open={showAdmission} onClose={() => setShowAdmission(false)} />
    </div>
  );
};

export default Index;
