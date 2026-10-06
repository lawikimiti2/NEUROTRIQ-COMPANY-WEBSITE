import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import {
  Shield,
  Cpu,
  Zap,
  Building,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Trophy,
  FileText,
  Settings,
  Mic,
  Wifi,
  Monitor,
  Video,
  Grid3x3,
  Projector,
  Network,
  Briefcase
} from "lucide-react";
import cameraInstallPhoto from "@/assets/new-photos/our-projects-cctv-camera-1.jpg";
import Reveal from "@/components/ui/reveal";
import PageTransition from "@/components/ui/page-transition";
import HeroSlider from "@/components/ui/hero-slider";

// A curated subset of the Security Systems photo gallery (ServiceDetail.tsx's
// securityImages), cycled through the hero circle. Many of the full gallery's
// shots are flat product boards or have an off-centre subject that crops
// awkwardly into a circle — these are the ones with a clear, centred focal
// point that actually survives the crop.
import secHeroCctv2 from "@/assets/new-photos/our-projects-cctv-camera-2.jpg";
import secHeroDisplayWall from "@/assets/new-photos/our-projects-cctv-camera-display-screen.jpg";
import secHeroCctv5 from "@/assets/new-photos/our-projects-cctv-camera-5.jpg";
import secHeroImg1 from "@/assets/SECURITY SOLUTIONS/IMG-20251028-WA0007.jpg";
import secHeroImg4 from "@/assets/SECURITY SOLUTIONS/IMG-20251028-WA0010.jpg";
import secHeroImg7 from "@/assets/SECURITY SOLUTIONS/IMG-20251028-WA0013.jpg";
import secHeroImg13 from "@/assets/SECURITY SOLUTIONS/IMG-20251028-WA0019.jpg";

const heroSlides = [
  { src: secHeroCctv2, alt: "Hikvision bullet camera mounted on-site" },
  { src: secHeroDisplayWall, alt: "16-camera CCTV monitoring wall at a client site" },
  { src: secHeroCctv5, alt: "NeuroTriQ-installed Hikvision CCTV camera, on-site" },
  { src: secHeroImg1, alt: "Close-up dome camera for Smart Retail security" },
  { src: secHeroImg4, alt: "AI-powered security camera and smart access kiosk" },
  { src: secHeroImg7, alt: "Hikvision Safe City camera solutions on display" },
  { src: secHeroImg13, alt: "Industrial-grade camera lineup for critical infrastructure" },
];

// Small uppercase pill label used above section headings throughout this page.
const EYEBROW =
  "mb-4 rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary";
const EYEBROW_ON_DARK =
  "mb-4 rounded-full border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm";

const Home = () => {
  const services = [
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Consultancy for Companies",
      description: "End-to-end business support from registration, compliance, to tender management.",
      slug: "consultancy"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Tendering & Procurement",
      description: "Bid preparation, documentation, and full procurement lifecycle support.",
      slug: "tendering"
    },
    {
      icon: <Cpu className="h-6 w-6" />,
      title: "IT Solutions",
      description: "Comprehensive IT infrastructure, cloud services, and digital transformation solutions.",
      slug: "it-solutions"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Electrical Installation",
      description: "Professional electrical design, installation, and maintenance services.",
      slug: "electrical"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Security Systems",
      description: "Advanced CCTV, access control, alarm systems, and integrated security solutions.",
      slug: "security-systems"
    },
    {
      icon: <Building className="h-6 w-6" />,
      title: "Smart Infrastructure",
      description: "Intelligent building automation, IoT integration, and smart city solutions.",
      slug: "smart-infrastructure"
    }
  ];

  const stats = [
    { icon: <Users className="h-6 w-6" />, value: "50+", label: "Projects Completed" },
    { icon: <Trophy className="h-6 w-6" />, value: "5+", label: "Years Experience" },
    { icon: <Star className="h-6 w-6" />, value: "98%", label: "Client Satisfaction" },
    { icon: <CheckCircle className="h-6 w-6" />, value: "24/7", label: "Support Available" }
  ];

  const features = [
    "Licensed & Insured",
    "24/7 Emergency Support",
    "Industry Leading Warranty",
    "Expert Technical Team",
    "Competitive Pricing"
  ];

  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      <Navbar />
      
  {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-14 md:pt-32 md:pb-16 bg-background">
        {/* Soft colour glow behind the photo card, echoing Berxley's blob-behind-illustration motif */}
        <div className="pointer-events-none absolute -right-24 top-24 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl" aria-hidden="true"></div>
        <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" aria-hidden="true"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up text-center lg:text-left">
              <Badge variant="outline" className={EYEBROW}>
                Trusted Technology Partner Since 2020
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
                Innovating the Future of
                <span className="gradient-text block mt-2">Technology Solutions</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                NeuroTriQ delivers cutting-edge IT solutions, security systems, and smart infrastructure
                that empower businesses to thrive in the digital age.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start items-center">
                <Link to="/services">
                  <Button size="lg" className="btn-tech rounded-full text-lg px-8 py-4">
                    Explore Our Services
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="#services-section">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="rounded-full text-lg px-8 py-4 bg-primary/10 text-primary hover:bg-primary/15"
                  >
                    See Homepage Services
                  </Button>
                </a>
              </div>
              <div className="mt-5 text-center lg:text-left">
                <Link
                  to="/contact#get-in-touch"
                  className="inline-flex items-center gap-1.5 text-base font-semibold text-foreground hover:text-primary transition-colors"
                >
                  Get Free Consultation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto w-full max-w-md lg:max-w-none aspect-square"
            >
              {/* Dashed orbit ring, a Tangaza-style motif around the hero photo */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/25"></div>
              <div className="absolute inset-6 rounded-full bg-primary/5 blur-2xl" aria-hidden="true"></div>

              <div className="absolute inset-[12%] rounded-full overflow-hidden shadow-hero border-4 border-background">
                <HeroSlider slides={heroSlides} />
              </div>

              {/* Orbiting service-icon chips, gently floating */}
              {[
                { icon: <Shield className="h-5 w-5" />, style: "top-[4%] left-[10%]", bg: "bg-primary text-primary-foreground" },
                { icon: <Cpu className="h-5 w-5" />, style: "top-[36%] -left-2", bg: "bg-mint text-mint-foreground" },
                { icon: <Zap className="h-5 w-5" />, style: "bottom-[6%] left-[14%]", bg: "bg-navy text-white" },
                { icon: <Wifi className="h-5 w-5" />, style: "top-[2%] right-[12%]", bg: "bg-navy text-white" },
                { icon: <Building className="h-5 w-5" />, style: "top-[38%] -right-2", bg: "bg-primary text-primary-foreground" },
              ].map((orbit, i) => (
                <motion.div
                  key={i}
                  className={`absolute ${orbit.style} w-11 h-11 rounded-full ${orbit.bg} shadow-tech flex items-center justify-center`}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                >
                  {orbit.icon}
                </motion.div>
              ))}

              {/* Floating stat chips */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="hidden sm:flex absolute top-[8%] -left-4 items-center gap-3 rounded-2xl bg-card border border-border shadow-tech px-4 py-3"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-base font-bold leading-none">50+</div>
                  <div className="text-[11px] text-muted-foreground mt-1">Projects delivered</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="hidden sm:flex absolute bottom-[10%] -right-4 items-center gap-3 rounded-2xl bg-card border border-border shadow-tech px-4 py-3"
              >
                <div className="w-9 h-9 rounded-full bg-mint/15 flex items-center justify-center shrink-0">
                  <Star className="h-4 w-4 text-mint" />
                </div>
                <div>
                  <div className="text-base font-bold leading-none">98%</div>
                  <div className="text-[11px] text-muted-foreground mt-1">Client satisfaction</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section — no section-level background at all; the individual
          stat cards carry their own definition instead of a band. */}
      <section className="pt-16 pb-8 md:pt-20 md:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="flex items-center gap-4 rounded-2xl bg-card shadow-card hover:shadow-tech hover:-translate-y-1 transition-all duration-300 px-5 py-5">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold leading-none tracking-tight text-foreground">{stat.value}</div>
                    <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

  {/* Services Section */}
  <section id="services-section" className="pt-10 pb-10 md:pt-12 md:pb-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className={EYEBROW}>Our Services</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Technology Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From IT infrastructure to smart building technologies, we provide end-to-end solutions
              that drive innovation and efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Reveal key={index} delay={(index % 3) * 0.1}>
                <Link
                  to={`/services/${service.slug}`}
                  className="group relative block rounded-2xl bg-card p-7 shadow-card hover:shadow-tech transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="absolute top-6 right-7 text-sm font-bold text-muted-foreground/30 group-hover:text-primary/30 transition-colors duration-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Learn More
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="text-center mt-8">
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:border-primary/40 hover:text-primary transition-colors duration-300"
            >
              View All Services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

      </section>

      {/* Professional Support Services Section — an inset floating navy
          card (Tangaza Digital's "Why Choose Us" pattern), kept as its own
          distinct, elevated module — only the Stats section's colour was
          meant to go, not this one. */}
      <section className="pt-10 pb-20 md:pt-12 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-navy text-white px-6 py-14 sm:px-12 sm:py-16">
              <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" aria-hidden="true"></div>
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-mint/10 blur-3xl" aria-hidden="true"></div>

              <div className="relative text-center mb-16">
                <Badge variant="outline" className={EYEBROW_ON_DARK}>Professional Support</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Comprehensive Support Services
                </h2>
                <p className="text-xl text-white/70 max-w-3xl mx-auto">
                  From concept to completion and beyond, we provide end-to-end support for all your technology projects
                </p>
              </div>

              <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                      title: "OEM/ODM Services",
                      description: "Custom design and manufacturing solutions tailored to your specifications"
                    },
                    {
                      title: "Project Design",
                      description: "Comprehensive project planning, design documentation, and technical specifications"
                    },
                    {
                      title: "Technical Support",
                      description: "24/7 expert technical assistance and troubleshooting services"
                    },
                    {
                      title: "Bidding Documentation",
                      description: "Professional bidding document drafting and project submission support"
                    },
                    {
                      title: "After-Sales Support",
                      description: "Ongoing maintenance and support to ensure optimal system performance"
                    },
                    {
                      title: "Technical Training",
                      description: "Comprehensive training programs for your team on system operation and maintenance"
                    },
                    {
                      title: "System Debugging",
                      description: "Expert system diagnostics, optimization, and performance tuning"
                    },
                    {
                      title: "Project Submission",
                      description: "Complete project documentation and submission assistance for approvals"
                    }
                ].map((service, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-2xl p-4 hover:bg-white/5 transition-colors duration-300"
                  >
                    <div className="w-6 h-6 rounded-full bg-mint/15 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="h-3.5 w-3.5 text-mint" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{service.title}</h3>
                      <p className="text-sm text-white/60 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Product Line Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className={EYEBROW}>Product Portfolio</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Wide Range of Technology Products
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We supply and integrate cutting-edge technology solutions across multiple domains including audio-visual, networking, and intelligent systems
            </p>
          </div>

          <Reveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: <Mic className="h-5 w-5" />,
                title: "PA Systems",
                description: "Public address and sound reinforcement for any venue size"
              },
              {
                icon: <Network className="h-5 w-5" />,
                title: "IP Systems",
                description: "IP-based communication and control for modern infrastructure"
              },
              {
                icon: <Shield className="h-5 w-5" />,
                title: "EVAC Systems",
                description: "Emergency voice alarm and communication for safety-critical sites"
              },
              {
                icon: <Wifi className="h-5 w-5" />,
                title: "5G WiFi Conference",
                description: "High-speed wireless conferencing with 5G connectivity"
              },
              {
                icon: <FileText className="h-5 w-5" />,
                title: "Paperless Conference",
                description: "Digital meeting solutions with interactive displays"
              },
              {
                icon: <Monitor className="h-5 w-5" />,
                title: "LED Displays",
                description: "High-resolution LED video walls and digital signage"
              },
              {
                icon: <Settings className="h-5 w-5" />,
                title: "Central Control",
                description: "Unified control for managing all your technology"
              },
              {
                icon: <Grid3x3 className="h-5 w-5" />,
                title: "Matrix Systems",
                description: "Video and audio matrix switching for complex AV routing"
              },
              {
                icon: <Video className="h-5 w-5" />,
                title: "VMS Systems",
                description: "Video management for comprehensive surveillance monitoring"
              },
              {
                icon: <Projector className="h-5 w-5" />,
                title: "Stage Lighting",
                description: "Professional stage lighting for performances and events"
              },
              {
                icon: <Building className="h-5 w-5" />,
                title: "Facade Lighting",
                description: "Architectural lighting for building exteriors and landmarks"
              },
              {
                icon: <Cpu className="h-5 w-5" />,
                title: "Electronics & Networking",
                description: "Electronic components and networking infrastructure"
              }
            ].map((product, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-5 rounded-2xl hover:bg-accent/50 transition-colors duration-300"
              >
                <div className="w-9 h-9 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {product.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{product.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Why Choose Us Section — alternating photo + checklist panel */}
      <section className="py-20 md:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal className="relative order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden shadow-hero aspect-[4/3]">
                <img
                  src={cameraInstallPhoto}
                  alt="NeuroTriQ technician installing a CCTV camera on-site"
                  className="w-full h-full object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={0.15} className="order-1 lg:order-2">
              <Badge variant="outline" className={EYEBROW}>Why Choose NeuroTriQ</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Your Trusted Technology Partner
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                With over 15 years of experience and a proven track record of success,
                NeuroTriQ stands as your reliable partner for all technology needs.
                We combine innovation with reliability to deliver solutions that exceed expectations.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-10">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" className="btn-tech rounded-full">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Reveal>
          </div>
        </div>

      </section>

      {/* CTA Section — full-bleed navy, as it was before the Stats-only
          colour removal was mistakenly extended to this section too. */}
      <section className="relative overflow-hidden py-14 md:py-16 bg-navy text-white">
        <Reveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Badge variant="outline" className={EYEBROW_ON_DARK}>Ready When You Are</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Technology Infrastructure?
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Contact our experts today for a free consultation and discover how
            NeuroTriQ can elevate your business with cutting-edge solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact#get-in-touch">
              <Button size="lg" className="rounded-full text-lg px-8 py-4 bg-mint text-mint-foreground hover:bg-mint/90">
                Get Free Quote
              </Button>
            </Link>
            <a href="tel:+254795344905">
              <Button size="lg" variant="outline" className="rounded-full text-lg px-8 py-4 bg-transparent border-white/60 text-white hover:bg-white hover:text-foreground">
                Schedule Consultation
              </Button>
            </a>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
    </PageTransition>
  );
};

export default Home;