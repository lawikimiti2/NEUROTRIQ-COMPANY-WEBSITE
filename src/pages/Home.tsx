import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Headphones,
  Lightbulb,
  FileText,
  GraduationCap,
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
import heroImage from "@/assets/hero-tech.jpg";
import { categoryImages } from "@/lib/categoryImages";
// Rotating tabs carousel
import RotatingTabs from "@/components/RotatingTabs";
// 3D cube with 6 faces
import TechCube from "@/components/TechCube";

const Home = () => {
  const services = [
    {
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      title: "Consultancy for Companies",
      description: "End-to-end business support from registration, compliance, to tender management.",
      image: categoryImages.consultancy
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Tendering & Procurement",
      description: "Bid preparation, documentation, and full procurement lifecycle support.",
      image: categoryImages.tender
    },
    {
      icon: <Cpu className="h-8 w-8 text-primary" />,
      title: "IT Solutions",
      description: "Comprehensive IT infrastructure, cloud services, and digital transformation solutions.",
      image: categoryImages.it
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Electrical Installation",
      description: "Professional electrical design, installation, and maintenance services.",
      image: categoryImages.electrical
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Security Systems",
      description: "Advanced CCTV, access control, alarm systems, and integrated security solutions.",
      image: categoryImages.security
    },
    {
      icon: <Building className="h-8 w-8 text-primary" />,
      title: "Smart Infrastructure",
      description: "Intelligent building automation, IoT integration, and smart city solutions.",
      image: categoryImages.smart
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
  {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="NeuroTriQ Technology Solutions" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-tech-grey-dark/80"></div>
        </div>
        
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <Badge variant="secondary" className="mb-6 text-sm font-medium">
              Trusted Technology Partner Since 2020
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Innovating the Future of
              <span className="gradient-text block mt-2">Technology Solutions</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              NeuroTriQ delivers cutting-edge IT solutions, security systems, and smart infrastructure 
              that empower businesses to thrive in the digital age.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/services">
                <Button size="lg" className="btn-tech text-lg px-8 py-4">
                  Explore Our Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#techcube-section">
                <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                  See Homepage Services
                </Button>
              </a>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-transparent border-white text-white hover:bg-white hover:text-foreground">
                  Get Free Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating animation element */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-float">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slide-in-right" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="flex justify-center mb-2">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

  {/* Services Section */}
  <section id="techcube-section" className="py-20 mesh-3d relative overflow-hidden" data-component="TechCube">
        {/* background image (subtle, blends with palette) */}
        <img
          src={heroImage}
          alt="technology background"
          aria-hidden={true}
          className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-10 sm:opacity-20 filter blur-sm"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-steel-blue/5 mix-blend-multiply pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Our Services</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Technology Solutions — Innovating Your Business Landscape
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From IT infrastructure to smart building technologies, we provide end-to-end solutions 
              that drive innovation and efficiency.
            </p>
          </div>

          {/* Render the interactive 3D cube with 6 faces. If you prefer the tabbed carousel instead,
              swap <TechCube /> with <RotatingTabs items={services} interval={5000} /> */}
          <div>
            <TechCube />
          </div>
        </div>
      </section>

      {/* Professional Support Services Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-steel-blue/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Professional Support</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Support Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From concept to completion and beyond, we provide end-to-end support for all your technology projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Lightbulb className="h-6 w-6" />,
                title: "OEM/ODM Services",
                description: "Custom design and manufacturing solutions tailored to your specifications"
              },
              {
                icon: <FileText className="h-6 w-6" />,
                title: "Project Design",
                description: "Comprehensive project planning, design documentation, and technical specifications"
              },
              {
                icon: <Headphones className="h-6 w-6" />,
                title: "Technical Support",
                description: "24/7 expert technical assistance and troubleshooting services"
              },
              {
                icon: <FileText className="h-6 w-6" />,
                title: "Bidding Documentation",
                description: "Professional bidding document drafting and project submission support"
              },
              {
                icon: <CheckCircle className="h-6 w-6" />,
                title: "After-Sales Support",
                description: "Ongoing maintenance and support to ensure optimal system performance"
              },
              {
                icon: <GraduationCap className="h-6 w-6" />,
                title: "Technical Training",
                description: "Comprehensive training programs for your team on system operation and maintenance"
              },
              {
                icon: <Settings className="h-6 w-6" />,
                title: "System Debugging",
                description: "Expert system diagnostics, optimization, and performance tuning"
              },
              {
                icon: <Trophy className="h-6 w-6" />,
                title: "Project Submission",
                description: "Complete project documentation and submission assistance for approvals"
              }
            ].map((service, index) => (
              <Card key={index} className="border-0 shadow-card hover:shadow-tech transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <div className="text-primary">
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Line Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Product Portfolio</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Wide Range of Technology Products
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We supply and integrate cutting-edge technology solutions across multiple domains including audio-visual, networking, and intelligent systems
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                className="flex items-start gap-3 p-5 rounded-xl border border-border hover:border-primary/40 hover:bg-accent/40 transition-colors duration-300"
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
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 mesh-3d">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Why Choose NeuroTriQ</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Your Trusted Technology Partner
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                With over 15 years of experience and a proven track record of success, 
                NeuroTriQ stands as your reliable partner for all technology needs. 
                We combine innovation with reliability to deliver solutions that exceed expectations.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" className="btn-tech">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Right-side decorative card removed per request (Award Winning and ISO mention removed) */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Technology Infrastructure?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Contact our experts today for a free consultation and discover how 
            NeuroTriQ can elevate your business with cutting-edge solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Get Free Quote
              </Button>
            </Link>
            <a href="tel:+254795344905">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent border-white text-white hover:bg-white hover:text-foreground">
                Schedule Consultation
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;