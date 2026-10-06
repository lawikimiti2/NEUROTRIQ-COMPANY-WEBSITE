import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from "lucide-react";
import logo from "@/assets/neurotriq_logo_ui.png";

const FOOTER_HEADING = "text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-5";
const FOOTER_LINK = "text-muted-foreground hover:text-primary transition-colors duration-200";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Partners", path: "/partners" },
  { name: "Contact", path: "/contact#get-in-touch" },
];

const serviceLinks = [
  { name: "IT Solutions", path: "/services/it-solutions" },
  { name: "Security Systems", path: "/services/security-systems" },
  { name: "Electrical Installation", path: "/services/electrical" },
  { name: "Smart Infrastructure", path: "/services/smart-infrastructure" },
  { name: "Consultancy for Companies", path: "/services/consultancy" },
  { name: "Tendering", path: "/services/tendering" },
];

const socials = [
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Twitter, label: "Twitter" },
  { icon: Facebook, label: "Facebook" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-muted/40 border-t border-border">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" aria-hidden="true"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-flex items-center">
              <img src={logo} alt="NeuroTriQ Logo" className="h-24 w-auto" />
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-xs">
              Leading tech solutions provider specializing in IT infrastructure,
              security systems, and smart building technologies.
            </p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className={FOOTER_HEADING}>Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className={FOOTER_LINK}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h3 className={FOOTER_HEADING}>Services</h3>
            <ul className="space-y-3">
              {serviceLinks.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className={FOOTER_LINK}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h3 className={FOOTER_HEADING}>Contact Info</h3>
            <div className="space-y-4">
              <a href="tel:+254795344905" className="group flex items-start gap-3">
                <span className="w-8 h-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Phone className="h-3.5 w-3.5" />
                </span>
                <span className="text-muted-foreground group-hover:text-primary transition-colors duration-200 pt-1.5">
                  0795344905
                </span>
              </a>
              <a href="mailto:info@neurotriq.co.ke" className="group flex items-start gap-3">
                <span className="w-8 h-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Mail className="h-3.5 w-3.5" />
                </span>
                <span className="text-muted-foreground group-hover:text-primary transition-colors duration-200 pt-1.5">
                  info@neurotriq.co.ke
                </span>
              </a>
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="h-3.5 w-3.5" />
                </span>
                <span className="text-muted-foreground pt-1.5">
                  Intrade Africa Place, Lavington
                  <br />
                  P.O. Box 4983-00100 Nairobi, Kenya
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {year} NeuroTriQ Company Limited. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;