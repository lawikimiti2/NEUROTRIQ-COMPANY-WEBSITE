import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { 
  Building, 
  Shield, 
  Cpu, 
  Zap,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Star
} from "lucide-react";
import { projects as realProjects, categories as realCategories } from "@/lib/portfolioData";
import "./portfolio-mesh.css";

const Portfolio = () => {
  const projects = realProjects;
  const categories = ["All", "Consultancy", "IT", "Security", "Smart Building"];

  const testimonials = [
    {
      name: "Operations Lead",
      title: "Kamo Ventures Limited",
      company: "Kamo Ventures",
      quote: "Your team handled the KenGen security deployment professionally — from solar CCTV to video wall integration. Training and support were on point.",
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

  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split("/");
  const activeCat = decodeURIComponent(parts[2] || "All");

  return (
    <div className="relative min-h-screen bg-background portfolio-mesh-page">
      <Navbar />
      {/* Subtle 3D blue mesh wireframe background */}
      <div className="portfolio-mesh-bg" aria-hidden="true">
        <div className="portfolio-mesh-plane" />
      </div>
      
      {/* Hero Section */}
  <section className="pt-24 pb-16 bg-gradient-to-br from-primary/10 to-steel-blue/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">Our Portfolio</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Proven Track Record of
              <span className="gradient-text block">Success</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore our portfolio of successful technology implementations across diverse 
              industries and see how we transform businesses through innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Project Stats */}
  <section className="py-16 bg-primary text-primary-foreground relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {projectStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
  <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Featured Projects</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Latest Work</h2>
            <p className="text-xl text-muted-foreground">
              Showcasing real client projects across Consultancy, IT, Security and Smart Building.
            </p>
          </div>

          <Tabs defaultValue={activeCat} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 mb-8 bg-background/70 backdrop-blur supports-[backdrop-filter]:backdrop-blur rounded-md border">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="text-xs lg:text-sm"
                  onClick={() => navigate(`/portfolio/${encodeURIComponent(category)}`)}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {projects
                    .filter(project => category === "All" || project.category === (category as any))
                    .map((project) => (
                      <Card key={project.id} className="border-0 shadow-card hover:shadow-tech transition-all duration-300">
                        {project.image ? (
                          <div className="relative overflow-hidden rounded-t-lg">
                            <img 
                              src={project.image} 
                              alt={project.title}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-4 left-4">
                              <Badge variant="secondary">{project.category}</Badge>
                            </div>
                          </div>
                        ) : null}
                        <CardHeader>
                          {!project.image && (
                            <div className="mb-2"><Badge variant="secondary">{project.category}</Badge></div>
                          )}
                          <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                          <CardDescription className="text-base leading-relaxed mb-4">
                            {project.description}
                          </CardDescription>
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span>{project.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>{project.duration}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Building className="h-4 w-4" />
                              <span>{project.client}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>{project.teamSize}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Button asChild variant="ghost" className="p-0 h-auto font-medium text-primary hover:text-primary-dark">
                            <Link
                              to={`/contact?project=${encodeURIComponent(project.title)}`}
                              aria-label={`Inquire about ${project.title}`}
                            >
                              Inquire about this project
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Detailed Case Study */}
  <section className="py-20 bg-muted/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Case Study Spotlight</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{projects[0].title}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {projects[0].description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-card">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Project Overview</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {projects[0].description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Challenges</h4>
                      <ul className="space-y-2">
                            {(projects[0].challenges || []).map((challenge, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-1" />
                            <span className="text-sm text-muted-foreground">{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Solutions</h4>
                      <ul className="space-y-2">
                        {(projects[0].solutions || []).map((solution, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                            <span className="text-sm text-muted-foreground">{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="border-0 shadow-card mb-6">
                <CardHeader>
                  <CardTitle>Project Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {(projects[0].results || []).map((result, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                        <span className="text-sm">{result}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Technologies Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(projects[0].technologies || []).map((tech, index) => (
                      <Badge key={index} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
  <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Client Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-muted-foreground">
              Hear from satisfied clients about their experience with NeuroTriQ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-card">
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
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
  <section className="py-20 bg-primary text-primary-foreground relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Join our growing list of satisfied clients and transform your technology infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-4">
              <Link to="/contact">
                Discuss Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent border-white text-white hover:bg-white hover:text-foreground">
              Download Portfolio
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Portfolio;