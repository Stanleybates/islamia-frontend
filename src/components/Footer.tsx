import { MapPin, Phone, Mail, MessageCircle, Facebook, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const WHATSAPP_NUMBER = "233550545403";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Assalamu Alaikum, I would like to inquire about Allāhul Musta'ān Institute.")}`;
const SOCIAL_LINKS = {
  facebook: "https://facebook.com/AllahumustanInstitute",
  instagram: "https://instagram.com/AllahumustanInstitute",
  twitter: "https://twitter.com/AllahumustanInstitute",
  youtube: "https://youtube.com/@AllahumustanInstitute",
  tiktok: "https://tiktok.com/@AllahumustanInstitute",
};

const TikTokIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.21 8.21 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.14z"/>
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const Footer = () => {
  return (
    <footer id="contact" className="gradient-green text-primary-foreground">
      <div className="container-max section-padding pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Institute Logo" className="h-12 w-auto bg-primary-foreground/10 rounded-lg p-1" />
              <div>
                <p className="font-heading text-sm font-bold leading-tight">Allāhul Musta'ān</p>
                <p className="text-xs text-primary-foreground/70">Institute</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed mb-4">
              Dedicated to teaching the Arabic language with excellence and Islamic academic tradition.
            </p>
            {/* Social Media */}
            <div className="flex gap-3">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors" title="Facebook">
                <Facebook size={16} />
              </a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors" title="Instagram">
                <Instagram size={16} />
              </a>
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors" title="X (Twitter)">
                <XIcon />
              </a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors" title="YouTube">
                <Youtube size={16} />
              </a>
              <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors" title="TikTok">
                <TikTokIcon />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              {["Home", "Courses", "About", "Apply Now"].map((link) => (
                <a key={link} href={`#${link.toLowerCase().replace(" ", "-")}`} className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {link}
                </a>
              ))}
              <Link to="/student" className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Student Portal
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Programs</h4>
            <div className="space-y-2">
              {["Arabic Language", "Qur'ānic Studies", "Islamic Jurisprudence", "Hadeeth Studies", "Certificate Program (2 Years)"].map((p) => (
                <p key={p} className="text-sm text-primary-foreground/70">{p}</p>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-primary-foreground/70" />
                <p className="text-sm text-primary-foreground/70">Allāhul Musta'ān Institute, Ghana</p>
              </div>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary-foreground transition-colors group">
                <Phone size={16} className="flex-shrink-0 text-primary-foreground/70 group-hover:text-primary-foreground" />
                <p className="text-sm text-primary-foreground/70 group-hover:text-primary-foreground">+233 55 054 5403</p>
              </a>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary-foreground transition-colors group">
                <MessageCircle size={16} className="flex-shrink-0 text-green-400" />
                <p className="text-sm text-primary-foreground/70 group-hover:text-primary-foreground">Message on WhatsApp</p>
              </a>
              <div className="flex items-center gap-3">
                <Mail size={16} className="flex-shrink-0 text-primary-foreground/70" />
                <p className="text-sm text-primary-foreground/70">allahulmustaaninstitute@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 text-center">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} Allāhul Musta'ān Institute for Teaching Arabic Language. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;