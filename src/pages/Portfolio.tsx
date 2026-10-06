import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { useLocation, Link } from "react-router-dom";
import {
  Shield,
  Cpu,
  Zap,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Star,
  MapPin,
  Calendar,
  Building,
  Users,
  Trophy,
  AlertTriangle
} from "lucide-react";
import { projects as realProjects, categories as realCategories, PortfolioCategoryName } from "@/lib/portfolioData";
import { getCategoryImages } from "@/lib/categoryImages";
import Reveal from "@/components/ui/reveal";
import PageTransition from "@/components/ui/page-transition";
import { motion } from "framer-motion";
import "./portfolio-mesh.css";

const EYEBROW =
  "mb-4 rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary";

// Fall back to a representative category photo when a project has no specific image yet.
// Cycles through the category's available photos so consecutive projects in the same
// category don't all show the exact same fallback image.
const categoryFallbackImages: Record<PortfolioCategoryName, string[]> = {
  Consultancy: getCategoryImages("consultancy"),
  IT: getCategoryImages("it"),
  Security: getCategoryImages("security"),
  "Smart Building": getCategoryImages("smart"),
};
const categoryFallbackCursor: Record<PortfolioCategoryName, number> = {
  Consultancy: 0,
  IT: 0,
  Security: 0,
  "Smart Building": 0,
};

const projectImageCache = new Map<number, string>();
const getProjectImage = (project: { id: number; image: string; category: PortfolioCategoryName }) => {
  if (project.image) return project.image;
  const cached = projectImageCache.get(project.id);
  if (cached) return cached;
  const images = categoryFallbackImages[project.category];
  const picked = images[categoryFallbackCursor[project.category] % images.length];
  categoryFallbackCursor[project.category] += 1;
  projectImageCache.set(project.id, picked);
  return picked;
};

const Portfolio = () => {
  const projects = realProjects;
  const categories = ["All", "Consultancy", "IT", "Security", "Smart Building"];

  const testimonials = [
    {
      name: "Operations Lead",
      title: "Consolata International University",
      company: "Consolata International University",
      quote: "Your team handled the security deployment professionally — from solar CCTV to video wall integration. Training and support were on point.",
      rating: 5,
    },
    {
      name: "Director",
      title: "Universal Systems Engineering Limited",
      company: "USEL",
      quote: "EGP registration process was smooth and fast. Clear guidance and documentation saved us time and effort.",
      rating: 5,
    },
    {
      name: "Private Client",
      title: "Purity Ng’ang’a",
      company: "Residential Smart Home (Nakuru)",
      quote: "The smart home setup has been reliable and easy to use. Great attention to detail during construction and commissioning.",
      rating: 5,
    },
  ];

  // Match About page statistics
  const projectStats = [
    { label: "Projects Completed", value: "50+" },
    { label: "Years Experience", value: "5+" },
    { label: "Client Satisfaction", value: "98%" },
  ];

  const location = useLocation();
  const parts = location.pathname.split("/");
  const activeCat = decodeURIComponent(parts[2] || "All");

  return (
    <PageTransition>
    <div className="relative min-h-screen bg-background portfolio-mesh-page">
      <Navbar />
      {/* Subtle 3D blue mesh wireframe background */}
      <div className="portfolio-mesh-bg" aria-hidden="true">
        <div className="portfolio-mesh-plane" />
      </div>
      
      {/* Hero Section — centered text above a scattered real-photo collage,
          a fourth distinct composition fitting a portfolio/gallery page. */}
  <section className="pt-28 pb-10 md:pt-32 md:pb-12 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className={EYEBROW}>Our Portfolio</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Proven Track Record of
            <span className="gradient-text block mt-2">Success</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore our portfolio of successful technology implementations across diverse
            industries and see how we transform businesses through innovation.
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 hidden sm:flex items-end justify-center gap-4">
          {projects.filter((project) => project.image).slice(0, 5).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30, rotate: index % 2 === 0 ? -4 : 4 }}
              animate={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -3 : 3 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, rotate: 0, zIndex: 10 }}
              className={`relative rounded-2xl overflow-hidden shadow-tech border-4 border-background ${
                index === 2 ? "w-40 h-52 sm:w-48 sm:h-64 z-10" : index % 2 === 0 ? "w-28 h-40 sm:w-36 sm:h-48" : "w-32 h-44 sm:w-40 sm:h-52"
              }`}
            >
              <img
                src={getProjectImage(project)}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Project Stats — sits right under the hero, so it should already be
          visible on arrival instead of waiting for a scroll-triggered
          reveal (no Reveal wrapper here, unlike sections further down). */}
  <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-4">
        <div className="max-w-5xl mx-auto bg-card rounded-2xl shadow-hero grid grid-cols-2 md:grid-cols-3 divide-x divide-y md:divide-y-0 divide-border/60">
          {projectStats.map((stat, index) => (
            <div key={index} className="text-center py-8 px-4">
              <div className="text-3xl md:text-4xl font-semibold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
  <section className="py-20 relative z-10">
        <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className={EYEBROW}>Featured Projects</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Latest Work</h2>
            <p className="text-xl text-muted-foreground">
              Showcasing real client projects across Consultancy, IT, Security and Smart Building.
            </p>
          </div>

          <Tabs defaultValue={activeCat} className="w-full">
            <TabsList className="flex flex-wrap items-center justify-center gap-2 mb-12 h-auto bg-transparent p-0">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="rounded-full border border-border px-5 py-2 text-sm font-medium text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-none hover:border-primary/40 transition-colors duration-300"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
                  {projects
                    .filter(project => category === "All" || project.category === (category as any))
                    .map((project) => (
                      <Link
                        key={project.id}
                        to={`/contact?project=${encodeURIComponent(project.title)}#get-in-touch`}
                        aria-label={`Inquire about ${project.title}`}
                        className="group relative block aspect-square rounded-2xl overflow-hidden shadow-card hover:shadow-tech transition-shadow duration-300"
                      >
                        <img
                          src={getProjectImage(project)}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-background/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-primary shadow-sm">
                          {project.category}
                        </span>

                        {/* Base state: title over a bottom gradient — what's visible at rest and on touch devices */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-300 sm:group-hover:opacity-0" />
                        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 transition-opacity duration-300 sm:group-hover:opacity-0">
                          <h3 className="text-white text-sm sm:text-base font-semibold leading-snug line-clamp-2">{project.title}</h3>
                        </div>

                        {/* Hover state (desktop only): full info reveal, Tangaza-style */}
                        <div className="hidden sm:flex absolute inset-0 flex-col justify-end bg-navy/95 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <h3 className="text-white text-base font-semibold leading-snug mb-2">{project.title}</h3>
                          <p className="text-white/70 text-xs leading-relaxed line-clamp-3 mb-3">
                            {project.description}
                          </p>
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-mint">
                            Inquire about this project
                            <ExternalLink className="h-3 w-3" />
                          </span>
                        </div>
                      </Link>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Reveal>
      </section>

      {/* Detailed Case Study */}
  <section className="py-20 bg-muted/50 relative z-10">
        <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge variant="outline" className={EYEBROW}>Case Study Spotlight</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{projects[0].title}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {projects[0].description}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-10 text-sm text-muted-foreground">
            {[
              { icon: <MapPin className="h-4 w-4" />, value: projects[0].location },
              { icon: <Calendar className="h-4 w-4" />, value: projects[0].duration },
              { icon: <Building className="h-4 w-4" />, value: projects[0].client },
              { icon: <Users className="h-4 w-4" />, value: projects[0].teamSize },
            ].map((meta, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-primary">{meta.icon}</span>
                <span>{meta.value}</span>
              </div>
            ))}
          </div>

          <div className="rounded-3xl overflow-hidden shadow-hero mb-12 max-w-5xl mx-auto aspect-[21/9]">
            <img
              src={getProjectImage(projects[0])}
              alt={projects[0].title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Challenges vs. Solutions — contrasting panels instead of a
              single nested card, so the problem/solution story reads at a glance. */}
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-6">
            <div className="rounded-2xl bg-destructive/5 p-8">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive mb-5">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-4">Challenges</h3>
              <ul className="space-y-3">
                {(projects[0].challenges || []).map((challenge, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-primary/5 p-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-4">Solutions</h3>
              <ul className="space-y-3">
                {(projects[0].solutions || []).map((solution, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {solution}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="rounded-2xl bg-card shadow-card p-8">
              <div className="w-12 h-12 rounded-xl bg-mint/15 flex items-center justify-center text-mint mb-5">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-4">Results</h3>
              <ul className="space-y-3">
                {(projects[0].results || []).map((result, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                    <CheckCircle className="h-4 w-4 text-mint shrink-0 mt-0.5" />
                    {result}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-card shadow-card p-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-4">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {(projects[0].technologies || []).map((tech, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-primary/5 border border-primary/10 px-3 py-1.5 text-xs font-medium text-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Testimonials */}
  <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className={EYEBROW}>Client Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-muted-foreground">
              Hear from satisfied clients about their experience with NeuroTriQ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Reveal key={index} delay={index * 0.1}>
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="border-t pt-4">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                    <div className="text-sm text-primary">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
  <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-primary to-primary-dark text-primary-foreground px-8 py-16 sm:px-16 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Join our growing list of satisfied clients and transform your technology infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-4">
              <Link to="/contact#get-in-touch">
                Discuss Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent border-white text-white hover:bg-white hover:text-foreground">
              Download Portfolio
            </Button>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
    </PageTransition>
  );
};

export default Portfolio;