import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import Reveal from "@/components/ui/reveal";
import PageTransition from "@/components/ui/page-transition";
import {
  Target,
  Eye,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Building,
  Globe,
  Lightbulb,
  Trophy
} from "lucide-react";
import installPhoto from "@/assets/new-photos/our-projects-cctv-camera-3.jpg";

const EYEBROW =
  "mb-4 rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary";
const EYEBROW_ON_DARK =
  "mb-4 rounded-full border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm";

const About = () => {
  const values = [
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Innovation",
      description: "We continuously explore cutting-edge technologies to deliver forward-thinking solutions."
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Reliability",
      description: "Our commitment to quality ensures consistent, dependable results for every project."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Partnership",
      description: "We build lasting relationships with clients, working as trusted technology advisors."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Excellence",
      description: "We maintain the highest standards in everything we do, from design to implementation."
    }
  ];

  const milestones = [
    { 
      year: "2020", 
      event: "The Vision Begins", 
      description: "NeuroTriQ was conceptualized by a group of technology enthusiasts who identified a gap in comprehensive tech solutions for businesses in Kenya." 
    },
    { 
      year: "2021", 
      event: "Planning & Development", 
      description: "Intensive market research, team building, and partnership formation. Developed service frameworks and established relationships with technology vendors." 
    },
    { 
      year: "2022", 
      event: "Operational Launch", 
      description: "Officially began operations, delivering IT solutions and security systems. Completed our first 10 projects, establishing a foundation of satisfied clients." 
    },
    { 
      year: "2023", 
      event: "Expansion & Growth", 
      description: "Expanded service offerings to include electrical installation and smart infrastructure. Team grew to 15+ professionals. Successfully completed 25+ projects." 
    },
    { 
      year: "2024", 
      event: "Service Diversification", 
      description: "Launched Consultancy for Companies division. Established partnerships with major technology brands. Portfolio expanded to 40+ successful projects." 
    },
    { 
      year: "2025", 
      event: "Official Incorporation", 
      description: "Registered as a full-fledged company. Achieved 50+ projects milestone. Now positioned as a trusted technology partner with comprehensive service offerings." 
    }
  ];

  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section — centered, with an inline stat strip instead of a
          side photo, so it reads differently from Home's two-column hero. */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20 bg-background">
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-24 h-[32rem] w-[32rem] rounded-full bg-primary/10 blur-3xl" aria-hidden="true"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <Badge variant="outline" className={EYEBROW}>About NeuroTriQ</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Building Tomorrow's
              <span className="gradient-text block mt-2">Technology Today</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12">
              Since 2020, NeuroTriQ has evolved from a visionary idea to a fully incorporated
              technology solutions provider, transforming businesses and communities across Kenya.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-3 divide-x divide-border rounded-2xl bg-card shadow-card mx-auto max-w-2xl"
          >
            {[
              { value: "50+", label: "Projects Completed" },
              { value: "5+", label: "Years Experience" },
              { value: "98%", label: "Client Satisfaction" },
            ].map((stat, index) => (
              <div key={index} className="px-4 py-6 sm:px-8">
                <div className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="py-20">
        <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  NeuroTriQ began as an idea in 2020, born from a vision to bridge the technology 
                  gap in Kenya's business landscape. What started as a concept among passionate 
                  technology enthusiasts has evolved into a comprehensive solutions provider.
                </p>
                <p>
                  After two years of careful planning and development, we launched operations in 
                  2022, immediately making an impact with our integrated approach to IT solutions, 
                  security systems, and electrical services. Our commitment to excellence and 
                  customer satisfaction drove rapid growth.
                </p>
                <p>
                  In 2025, we achieved a major milestone by officially incorporating as a company. 
                  With over 50 successful projects and a team of dedicated professionals, NeuroTriQ 
                  continues to innovate, now offering everything from smart infrastructure to 
                  comprehensive business consultancy services.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-primary/10 blur-xl" aria-hidden="true"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-hero aspect-[4/3]">
                <img
                  src={installPhoto}
                  alt="NeuroTriQ technicians installing CCTV cameras on-site"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:flex absolute -bottom-6 -right-6 items-center gap-3 rounded-2xl bg-card shadow-tech px-5 py-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-lg font-bold leading-none">5+</div>
                  <div className="text-xs text-muted-foreground mt-1">Years experience</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-muted/50">
        <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className={EYEBROW}>What We Stand For</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Mission &amp; Vision</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-card">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Target className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-center">
                  To empower businesses and communities with innovative technology solutions
                  that enhance security, efficiency, and connectivity while building lasting
                  partnerships based on trust and excellence.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Eye className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-center">
                  To be the leading technology solutions provider, recognized for transforming
                  how people interact with technology through innovative, reliable, and
                  sustainable solutions that shape the future.
                </p>
              </CardContent>
            </Card>
          </div>
        </Reveal>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className={EYEBROW}>Our Values</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Drives Us</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our core values guide every decision we make and every solution we deliver.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <Card className="border-0 shadow-card text-center group hover:shadow-tech transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="mx-auto mb-4 w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      {value.icon}
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className={EYEBROW}>Our Journey</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Company Milestones</h2>
            <p className="text-xl text-muted-foreground">
              Key moments that shaped NeuroTriQ's growth and success.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 h-full w-0.5 bg-primary/20"></div>
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center mb-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <Reveal className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                  <Card className="border-0 shadow-card">
                    <CardContent className="p-6">
                      <Badge variant="secondary" className="mb-2">{milestone.year}</Badge>
                      <h3 className="font-bold text-lg mb-2">{milestone.event}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </Reveal>
                <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-primary-foreground rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <Reveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className={EYEBROW_ON_DARK}>Let's Talk</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Work with NeuroTriQ?
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Join over 50 satisfied clients who trust us with their technology needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full text-lg px-8 py-4 bg-mint text-mint-foreground hover:bg-mint/90">
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full text-lg px-8 py-4 bg-transparent border-white/60 text-white hover:bg-white hover:text-foreground">
              Learn About Our Services
            </Button>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
    </PageTransition>
  );
};

export default About;