import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { Building2, Handshake, Award, Globe, CheckCircle, ArrowRight } from "lucide-react";
import { getPartnerLogos } from "@/lib/partnerLogos";
import "./Partners.css";
import { useEffect, useMemo, useRef, useState } from "react";
// Removed carousel arrows in favor of continuous marquee scroll
import { Tabs, TabsContent } from "@/components/ui/tabs";
import "./partners-3d.css";

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
  const paused = useRef(false);
  

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary/10 to-steel-blue/10 relative overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">Our Partners</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted Global
              <span className="gradient-text block">Technology Partners</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We collaborate with world-leading technology brands to deliver cutting-edge solutions 
              and ensure the highest quality standards for our clients.
            </p>
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
              <Card key={index} className="border-0 shadow-card text-center hover:shadow-tech transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 inline-block p-3 bg-primary/10 rounded-full">
                    {benefit.icon}
                  </div>
                  <h3 className="font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Logos (from src/assets/patners) - horizontal auto-scrolling with dots */}
      <section className="py-12 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <Badge variant="outline" className="mb-2">Our Partners</Badge>
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

      {/* Partners Details - Tabs with logos as triggers */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-4">Technology Leaders</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Strategic Partners</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore details for each partner and how we work together.
            </p>
          </div>

          {(() => {
            const items = partners.map((p) => ({ ...p, logo: findLogo(p.name) }));
            const [activeTab, setActiveTab] = useState(0);

            // Auto-advance partner tabs every few seconds, pausing on hover/focus
            useEffect(() => {
              const id = window.setInterval(() => {
                if (!paused.current) {
                  setActiveTab((prev) => (prev + 1) % items.length);
                }
              }, 4000);
              return () => window.clearInterval(id);
            }, [items.length]);

            return (
              <div
                onMouseEnter={() => (paused.current = true)}
                onMouseLeave={() => (paused.current = false)}
                onFocus={() => (paused.current = true)}
                onBlur={() => (paused.current = false)}
              >
                <Tabs value={`p-${activeTab}`} onValueChange={(v) => setActiveTab(Number(v.replace('p-','')))}>
                  {/* Tab triggers removed per request to hide the selector strip; navigation handled by dots below */}
                  {items.map((p, idx) => (
                    <TabsContent key={p.name} value={`p-${idx}`} className="mt-4">
                      <div className="partner-card" role="group" aria-labelledby={`partner-${idx}`}>
                        <div className="partner-card-inner partner-card-content" tabIndex={0}>
                          <Card className="border-0 shadow-none">
                            <CardHeader className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                  {p.logo ? (
                                    <img src={p.logo.src} alt={`${p.name} logo`} className="max-h-12 max-w-[90%] object-contain" />
                                  ) : (
                                    <Building2 className="h-8 w-8 text-primary" />
                                  )}
                                </div>
                                <div>
                                  <CardTitle id={`partner-${idx}`} className="text-lg leading-tight">{p.name}</CardTitle>
                                  <Badge variant="secondary" className="text-[10px] mt-1">{p.category}</Badge>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3 pb-5">
                              <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                              <div className="pt-3 border-t">
                                <p className="text-xs font-medium text-primary">Specialization</p>
                                <p className="text-xs text-muted-foreground mt-1">{p.specialization}</p>
                              </div>
                              <div className="pt-2">
                                <p className="text-xs font-medium text-foreground mb-2">Key Benefits</p>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                  {p.benefits.map((benefit, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <CheckCircle className="h-3.5 w-3.5 text-primary mt-0.5" />
                                      <span className="text-xs text-muted-foreground">{benefit}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>

                <div className="flex items-center justify-center gap-2 mt-4">
                  {partners.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Show ${partners[i].name}`}
                      onClick={() => setActiveTab(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeTab ? 'bg-primary scale-110' : 'bg-muted'}`}
                    />
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
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
              <Card key={index} className="border-0 shadow-card hover:shadow-tech transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-20"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Experience Premium Technology Solutions
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Benefit from our partnerships with world-leading technology brands.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
            Contact Us Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Partners;
