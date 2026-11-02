import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, Star, Globe, Award } from "lucide-react";
import islamic1 from "@/assets/islamic-1.jpg";
import islamic2 from "@/assets/islamic-2.jpg";
import islamic3 from "@/assets/islamic-3.jpg";
import islamic4 from "@/assets/islamic-4.jpg";
import AdmissionFormDialog from "./AdmissionFormDialog";

const images = [islamic1, islamic2, islamic3, islamic4];

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentImage((current) => (current + 1) % images.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {images.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: currentImage === i ? 1 : 0,
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(170_35%_12%/0.7)] via-[hsl(170_35%_12%/0.6)] to-[hsl(170_35%_12%/0.8)]" />

        <div className="container-max relative z-10 text-center max-w-4xl mx-auto px-4 pt-32 pb-16">
          <div className="animate-fade-in">
            <div className="animate-blink inline-flex items-center gap-2 bg-accent/90 text-accent-foreground px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg">
              <BookOpen size={16} />
              <span>🔥 Enrollment Now Open — Limited Slots!</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Master the{" "}
              <span className="text-gradient-gold">Arabic Language</span>
              <br />
              with Expert Guidance
            </h1>

            <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join Allāhul Musta'ān Institute and embark on a transformative journey
              to learn Arabic from qualified scholars. Start your path to understanding
              the Qur'ān and classical Islamic texts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="gold"
                size="lg"
                className="text-base px-8 py-6"
                onClick={() => setShowAdmissionForm(true)}
              >
                <GraduationCap size={20} />
                Apply Now
              </Button>
              <Button variant="hero-outline" size="lg" className="text-base px-8 py-6 border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <a href="#courses">
                  <BookOpen size={20} />
                  View Courses
                </a>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
              {[
                { icon: Star, label: "Expert Scholars" },
                { icon: Globe, label: "Learn Online Anywhere" },
                { icon: Award, label: "Certified Programs" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 mb-2">
                    <item.icon size={22} className="text-accent" />
                  </div>
                  <p className="text-sm text-primary-foreground/80 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentImage === i ? "bg-accent w-8" : "bg-primary-foreground/40"
              }`}
            />
          ))}
        </div>
      </section>

      <AdmissionFormDialog open={showAdmissionForm} onClose={() => setShowAdmissionForm(false)} />
    </>
  );
};

export default HeroSection;
