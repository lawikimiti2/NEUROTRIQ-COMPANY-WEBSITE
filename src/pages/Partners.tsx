import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { Building2, Handshake, Award, Globe, ArrowRight } from "lucide-react";
import { getPartnerLogos } from "@/lib/partnerLogos";
import hikvisionVisitPhoto from "@/assets/new-photos/photo-at-HKVision-headquarters.jpg";
import "./Partners.css";
import Reveal from "@/components/ui/reveal";
import PageTransition from "@/components/ui/page-transition";
import { motion } from "framer-motion";
import "./partners-3d.css";

const EYEBROW =
  "mb-4 rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary";
const EYEBROW_ON_DARK =
  "mb-4 rounded-full border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm";

const Partners = () => {
  const partners = [
    {
      name: "Huawei",
      category: "Technology Partner",
      description: "Leading global provider of ICT infrastructure and smart devices",
      specialization: "Networking, Cloud Computing, AI Solutions",
      benefits: [
        "Advanced network infrastructure",
        "Enterprise-grade ICT solutions",
        "5G technology expertise",
        "Global technical support",
        "Cloud and data center solutions",
        "Robust security and compliance"
      ]
    },
    {
      name: "Hikvision",
      category: "Security Partner",
      description: "World's leading provider of innovative video surveillance products",
      specialization: "Video Surveillance, Access Control, Smart IoT",
      benefits: [
        "AI-powered security systems",
        "Professional video management",
        "Integrated access control",
        "Smart IoT solutions",
        "Analytics and face recognition",
        "Scalable storage and NVR/DVR"
      ]
    },
    {
      name: "ITC",
      category: "Audio & Conference Partner",
      description: "Manufacturer of professional public address and conference audio systems for commercial and institutional deployments.",
      specialization: "PA Systems, Conference Systems, Amplifiers, Speakers",
      benefits: [
        "Scalable PA and paging solutions",
        "Conference microphones and control systems",
        "Reliable commercial-grade amplifiers",
        "Wide range of indoor/outdoor speakers",
        "Zone control and multi-room audio",
        "Emergency evacuation/voice alarm options"
      ]
    },
    {
      name: "Schneider Electric",
      category: "Power & Infrastructure Partner",
      description: "Global specialist in energy management and industrial automation, powering reliable, efficient infrastructure.",
      specialization: "UPS and Power Backup, Data Center Power, Electrical Distribution, Industrial Automation",
      benefits: [
        "Reliable power continuity (UPS & switching)",
        "Scalable data center power solutions",
        "High-efficiency electrical distribution",
        "Industrial-grade automation and control",
        "Energy monitoring and optimization",
        "Modular, serviceable architectures"
      ]
    },
    {
      name: "Dell",
      category: "Compute & Storage Partner",
      description: "Leading provider of enterprise servers, storage, and client solutions for modern workloads.",
      specialization: "Servers, Storage, Workstations, Client Devices",
      benefits: [
        "Enterprise-class servers and storage",
        "Reliable support and lifecycle services",
        "Performance-optimized workstations",
        "Proven compatibility across ecosystems",
        "Hyperconverged and virtualization ready",
        "Secure manageability and automation"
      ]
    }
  ];

  // Load logos from src/assets/patners and map them by name for easy lookup
  const logos = getPartnerLogos();
  const findLogo = (name: string) => {
    const norm = name.toLowerCase();
    return (
      logos.find(l => l.name.toLowerCase() === norm) ||
      logos.find(l => l.name.toLowerCase().includes(norm)) ||
      null
    );
  };


  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section — a radial cluster of real partner-logo badges
          floating around a handshake icon, a fifth distinct composition
          tying directly into what this page is about. */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20 bg-background">
        <div className="pointer-events-none absolute -right-24 top-24 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl" aria-hidden="true"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up text-center lg:text-left">
              <Badge variant="outline" className={EYEBROW}>Our Partners</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
                Trusted Global
                <span className="gradient-text block mt-2">Technology Partners</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                We collaborate with world-leading technology brands to deliver cutting-edge solutions
                and ensure the highest quality standards for our clients.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-sm aspect-square hidden sm:block">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/25"></div>
              <div className="absolute inset-10 rounded-full bg-primary/5 blur-2xl" aria-hidden="true"></div>

              <div className="absolute inset-[22%] rounded-full bg-card shadow-hero flex items-center justify-center">
                <Handshake className="h-14 w-14 text-primary" />
              </div>

              {partners.slice(0, 5).map((partner, index) => {
                const logo = findLogo(partner.name);
                const positions = [
                  "top-0 left-1/2 -translate-x-1/2",
                  "top-[18%] -right-2",
                  "bottom-[10%] -right-4",
                  "bottom-0 left-1/4",
                  "top-[20%] -left-4",
                ];
                return (
                  <motion.div
                    key={partner.name}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3 + index * 0.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
                    className={`absolute ${positions[index]} w-16 h-16 rounded-2xl bg-card shadow-tech flex items-center justify-center p-2.5`}
                  >
                    {logo ? (
                      <img src={logo.src} alt={partner.name} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <Building2 className="h-6 w-6 text-primary" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { icon: <Award className="h-8 w-8 text-primary" />, title: "Certified Excellence", desc: "Official certifications and training" },
              { icon: <Handshake className="h-8 w-8 text-primary" />, title: "Strategic Alliance", desc: "Long-term partnerships" },
              { icon: <Globe className="h-8 w-8 text-primary" />, title: "Global Support", desc: "Worldwide backed services" },
              { icon: <Building2 className="h-8 w-8 text-primary" />, title: "Enterprise Grade", desc: "Professional solutions" }
            ].map((benefit, index) => (
              <Reveal key={index} delay={index * 0.1}>
              <Card className="border-0 shadow-card text-center hover:shadow-tech transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 inline-block p-3 bg-primary/10 rounded-full">
                    {benefit.icon}
                  </div>
                  <h3 className="font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                </CardContent>
              </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Logos (from src/assets/patners) - horizontal auto-scrolling with dots */}
      <section className="py-12 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <Badge variant="outline" className={EYEBROW}>Our Partners</Badge>
            <h3 className="text-xl md:text-2xl font-semibold">Brands We Work With</h3>
          </div>

          <div>
            {/* Continuous circular marquee for partner logos; pauses on hover/focus via CSS */}
            <div className="marquee" tabIndex={0} aria-label="Partner logos auto-scrolling">
              <div className="marquee__track">
                {[...logos, ...logos].map((logo, idx) => (
                  <div key={idx} className="marquee__item">
                    <div className="flex items-center justify-center p-4 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-20">
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        title={logo.name}
                        className="max-h-12 object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Partnership - Site Visit */}
      <section className="py-20">
        <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Badge variant="outline" className={EYEBROW}>Beyond the Logo</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Real Relationships, Not Just Badges
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Our partnerships go beyond certifications on paper. Our team regularly visits
                partner offices and facilities — like Hikvision's Nairobi office — to stay current
                on the latest technology, strengthen technical relationships, and ensure our
                clients get first-hand expertise on the products we deploy.
              </p>
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <Handshake className="h-5 w-5" />
                <span>NeuroTriQ team at Hikvision's Nairobi office</span>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <img
                src={hikvisionVisitPhoto}
                alt="NeuroTriQ team visiting Hikvision's Nairobi office"
                className="rounded-2xl shadow-tech w-full aspect-[4/3] object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Partners Details — a continuous horizontal marquee of partner
          cards, replacing the old one-at-a-time auto-advancing tab. */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-10">
            <Badge variant="outline" className={EYEBROW}>Technology Leaders</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Strategic Partners</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore details for each partner and how we work together.
            </p>
          </Reveal>
        </div>

        <div className="marquee marquee--cards" tabIndex={0} aria-label="Partner details, auto-scrolling">
          <div className="marquee__track marquee__track--cards">
            {[...partners, ...partners].map((p, idx) => {
              const logo = findLogo(p.name);
              return (
                <div key={idx} className="marquee__item marquee__item--card">
                  <div className="h-full rounded-2xl bg-card shadow-card p-6 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center shrink-0">
                        {logo ? (
                          <img src={logo.src} alt={`${p.name} logo`} className="max-h-10 max-w-[85%] object-contain" />
                        ) : (
                          <Building2 className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold leading-tight">{p.name}</h3>
                        <Badge variant="secondary" className="text-[10px] mt-1">{p.category}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                      {p.description}
                    </p>
                    <div className="mt-auto pt-4 border-t border-border">
                      <p className="text-xs font-medium text-primary mb-1">Specialization</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{p.specialization}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className={EYEBROW}>Value</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Our Partnerships Matter</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our strategic partnerships ensure you receive the best technology solutions with comprehensive support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Genuine Products",
                description: "100% authentic products directly from manufacturers with full warranty coverage"
              },
              {
                title: "Technical Expertise",
                description: "Access to manufacturer training, certifications, and technical support resources"
              },
              {
                title: "Latest Innovation",
                description: "Early access to new technologies and product releases for competitive advantage"
              }
            ].map((item, index) => (
              <Reveal key={index} delay={index * 0.1}>
              <Card className="border-0 shadow-card hover:shadow-tech transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white relative overflow-hidden">
        <Reveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Badge variant="outline" className={EYEBROW_ON_DARK}>Work With Us</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Experience Premium Technology Solutions
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Benefit from our partnerships with world-leading technology brands.
          </p>
          <Link to="/contact#get-in-touch">
            <Button size="lg" className="rounded-full text-lg px-8 py-4 bg-mint text-mint-foreground hover:bg-mint/90">
              Contact Us Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </Reveal>
      </section>

      <Footer />
    </div>
    </PageTransition>
  );
};

export default Partners;
