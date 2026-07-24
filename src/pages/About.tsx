import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { 
  Target, 
  Eye, 
  Users, 
  Award,
  CheckCircle,
  ArrowRight,
  Building,
  Globe,
  Lightbulb
} from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: "Innovation",
      description: "We continuously explore cutting-edge technologies to deliver forward-thinking solutions."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: "Reliability",
      description: "Our commitment to quality ensures consistent, dependable results for every project."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Partnership",
      description: "We build lasting relationships with clients, working as trusted technology advisors."
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary/10 to-steel-blue/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">About NeuroTriQ</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Building Tomorrow's Technology
              <span className="gradient-text block">Today</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Since 2020, NeuroTriQ has evolved from a visionary idea to a fully incorporated 
              technology solutions provider, transforming businesses and communities across Kenya.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <Card className="border-0 shadow-tech">
                <CardContent className="p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">50+</div>
                      <div className="text-sm text-muted-foreground">Projects Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">5+</div>
                      <div className="text-sm text-muted-foreground">Years Experience</div>
                    </div>
                    <div className="text-center col-span-2">
                      <div className="text-3xl font-bold text-primary mb-2">98%</div>
                      <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-card">
              <CardHeader className="text-center">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
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
                <Eye className="h-12 w-12 text-primary mx-auto mb-4" />
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
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Our Values</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Drives Us</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our core values guide every decision we make and every solution we deliver.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-card text-center group hover:shadow-tech transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Our Journey</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Company Milestones</h2>
            <p className="text-xl text-muted-foreground">
              Key moments that shaped NeuroTriQ's growth and success.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 h-full w-0.5 bg-primary/20"></div>
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center mb-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                  <Card className="border-0 shadow-card">
                    <CardContent className="p-6">
                      <Badge variant="secondary" className="mb-2">{milestone.year}</Badge>
                      <h3 className="font-bold text-lg mb-2">{milestone.event}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-primary-foreground rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Work with NeuroTriQ?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Join over 50 satisfied clients who trust us with their technology needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent border-white text-white hover:bg-white hover:text-foreground">
              Learn About Our Services
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;