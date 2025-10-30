import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { 
  Cpu, 
  Shield, 
  Zap, 
  Building, 
  Wrench,
  CheckCircle,
  ArrowRight,
  Monitor,
  Cloud,
  Camera,
  Lock,
  Wifi,
  Settings,
  Phone,
  Mail,
  FileText
} from "lucide-react";
import { categoryImages } from "@/lib/categoryImages";

// Images now load per category folder dynamically on each card using import.meta.glob

const Services = () => {
  // Eagerly load images from each service folder; we'll filter them per service id
  const allImages = useMemo(() => ((import.meta as any).glob(
    "/src/assets/{SECURITY SOLUTIONS,I T AND NETWORKING,SMART INFRASTRUCTURE,CONSULTANCY WORKS,TENDERS,electrical}/*.{jpg,jpeg,png,webp}",
    { eager: true, import: "default" }
  )) as Record<string, string>, []);

  const getImagesForService = (serviceId: string): string[] => {
    const entries = Object.entries(allImages);
    const pick = (pred: (p: string) => boolean) => entries.filter(([p]) => pred(p.toLowerCase())).map(([, url]) => url as string);
    switch (serviceId) {
      case "it-solutions":
        return pick((p) => p.includes("i t and networking"));
      case "security-systems":
        return pick((p) => p.includes("security solutions"));
      case "smart-infrastructure":
        return pick((p) => p.includes("smart infrastructure"));
      case "electrical":
        return pick((p) => p.includes("/electrical/") || p.includes("\\electrical\\"));
      case "consultancy":
        return pick((p) => p.includes("consultancy works"));
      case "tendering":
        return pick((p) => p.includes("tenders"));
      default:
        return [];
    }
  };
  const mainServices = [
    {
      id: "it-solutions",
      icon: <Cpu className="h-8 w-8 text-primary" />,
      title: "IT Solutions",
      description: "Comprehensive IT infrastructure and digital transformation services",
  image: categoryImages.it,
      features: [
        "Network Design & Implementation",
        "Cloud Migration & Management",
        "Cybersecurity Solutions",
        "Data Backup & Recovery",
        "IT Support & Maintenance",
        "Server & Storage Solutions"
      ],
      benefits: [
        "Improved operational efficiency",
        "Enhanced data security",
        "Reduced IT costs",
        "24/7 system monitoring",
        "Scalable infrastructure",
        "Expert technical support"
      ]
    },
    {
      id: "security-systems",
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Security Systems",
      description: "Advanced integrated security solutions for complete protection",
  image: categoryImages.security,
      features: [
        "CCTV Surveillance Systems",
        "Access Control Systems",
        "Alarm & Intrusion Detection",
        "Video Analytics",
        "Mobile Monitoring Apps",
        "Integration Platforms"
      ],
      benefits: [
        "Enhanced property security",
        "Real-time monitoring",
        "Theft prevention",
        "Remote access control",
        "Incident documentation",
        "Insurance premium reductions"
      ]
    },
    {
      id: "electrical",
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Electrical Installation",
      description: "Professional electrical design and installation services",
  image: categoryImages.electrical,
      features: [
        "Electrical Design & Planning",
        "Power Distribution Systems",
        "Lighting Solutions",
        "Emergency Power Systems",
        "Electrical Maintenance",
        "Code Compliance"
      ],
      benefits: [
        "Safe electrical systems",
        "Energy efficiency",
        "Code compliance",
        "Reduced downtime",
        "Professional installation",
        "Long-term reliability"
      ]
    },
    {
      id: "smart-infrastructure",
      icon: <Building className="h-8 w-8 text-primary" />,
      title: "Smart Infrastructure",
      description: "Intelligent building automation and IoT integration, including general construction support for technology build-outs",
  image: categoryImages.smart,
      features: [
        "Building Automation Systems",
        "IoT Device Integration",
        "Smart Lighting Control",
        "HVAC Automation",
        "Energy Management",
        "Environmental Monitoring",
        "Technology Infrastructure Build-outs",
        "Server Room Construction",
        "Cable Management Systems",
        "Equipment Installation"
      ],
      benefits: [
        "Energy cost savings",
        "Improved comfort",
        "Automated operations",
        "Real-time monitoring",
        "Predictive maintenance",
        "Environmental efficiency",
        "Integrated civil works for tech systems"
      ]
    },
    {
      id: "consultancy",
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Consultancy for Companies",
      description: "End-to-end business support from registration to compliance administration",
  image: categoryImages.consultancy,
      features: [
        "Business Name Registration",
        "Company Incorporation",
        "NCA & AGPO Certification",
        "KRA PIN & Tax Compliance",
        "Tender Application Support",
        "E-GP Registration & Management"
      ],
      benefits: [
        "Streamlined registration process",
        "Government compliance assured",
        "Tender success support",
        "License renewal management",
        "Reduced administrative burden",
        "Expert consultancy services"
      ]
    },
    {
      id: "tendering",
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Tendering",
      description: "Bid preparation, documentation, e-GP management, and procurement support",
  image: categoryImages.tender,
      features: [
        "Bid & Proposal Preparation",
        "Tender Documentation",
        "E-GP Registration & Management",
        "Compliance & Certifications",
        "Vendor & Sourcing Support",
        "Submission Tracking"
      ],
      benefits: [
        "Higher tender win readiness",
        "Accurate, compliant submissions",
        "Streamlined e-GP workflows",
        "Reduced administrative overhead",
        "Transparent process tracking",
        "Expert guidance end-to-end"
      ]
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Consultation",
      description: "We assess your needs and develop a customized solution plan."
    },
    {
      step: "2",
      title: "Design",
      description: "Our experts create detailed designs and specifications."
    },
    {
      step: "3",
      title: "Implementation",
      description: "Professional installation with minimal business disruption."
    },
    {
      step: "4",
      title: "Support",
      description: "Ongoing maintenance and 24/7 support services."
    }
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split("/");
  const activeTab = parts[2] || "it-solutions";

  // Small rotating preview component used by all services
  const CardPreview = ({ images, badge }: { images: string[]; badge?: string }) => {
    const [current, setCurrent] = useState(0);
    useEffect(() => {
      if (!images?.length) return;
      const iv = setInterval(() => setCurrent((p) => (p + 1) % images.length), 3000);
      return () => clearInterval(iv);
    }, [images?.length]);
    if (!images?.length) return null;
    return (
      <div className="relative overflow-hidden rounded-t-lg h-48">
        {images.map((img, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === current ? 'opacity-100' : 'opacity-0'}`}>
            <img src={img} alt="service preview" className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`} />
          ))}
        </div>
        {badge && (
          <Badge className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm">{badge}</Badge>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary/10 to-steel-blue/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">Our Services</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Comprehensive Technology
              <span className="gradient-text block">Solutions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From IT infrastructure to smart building technologies, we provide end-to-end 
              solutions that transform your business operations and enhance security.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {mainServices.map((service, index) => (
              <Card key={index} className="group hover:shadow-tech transition-all duration-300 border-0 shadow-card">
                <div className="relative overflow-hidden rounded-t-lg h-48">
                  {(() => {
                    const images = getImagesForService(service.id);
                    if (images.length) {
                      const badge = service.id === 'security-systems' ? 'Live Projects' : service.id === 'consultancy' ? 'Consultancy Works' : service.id === 'tendering' ? 'Tenders' : undefined;
                      return <CardPreview images={images} badge={badge} />;
                    }
                    return (
                      <>
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300"></div>
                      </>
                    );
                  })()}
                </div>
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    {service.icon}
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={`/services/${service.id}`}>
                    <Button variant="ghost" className="p-0 h-auto font-medium text-primary hover:text-primary-dark">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Service Details</h2>
            <p className="text-xl text-muted-foreground">
              Explore our comprehensive range of technology solutions and their benefits.
            </p>
          </div>

          <Tabs defaultValue={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-8">
              {mainServices.map((service) => (
                <TabsTrigger
                  key={service.id}
                  value={service.id}
                  className="text-xs lg:text-sm"
                  onClick={() => navigate(`/services/${service.id}`)}
                >
                  {service.title}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {mainServices.map((service) => (
              <TabsContent key={service.id} value={service.id}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      {service.icon}
                      <h3 className="text-2xl font-bold">{service.title}</h3>
                    </div>
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold mb-4">What We Offer:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {service.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link to={`/services/${service.id}`}>
                      <Button size="lg" className="btn-tech">
                        Get Quote for {service.title}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                  
                  <div>
                    <Card className="border-0 shadow-tech">
                      <CardHeader>
                        <CardTitle className="text-xl">Key Benefits</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {service.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="h-4 w-4 text-primary" />
                              </div>
                              <span className="text-muted-foreground">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Our Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Work</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our proven methodology ensures successful project delivery from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <Card key={index} className="border-0 shadow-card text-center relative">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-foreground font-bold text-lg">{step.step}</span>
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Technologies</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cutting-Edge Solutions</h2>
            <p className="text-xl text-muted-foreground">
              We work with the latest technologies and industry-leading brands.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              { icon: <Monitor className="h-8 w-8" />, name: "Network Infrastructure" },
              { icon: <Cloud className="h-8 w-8" />, name: "Cloud Solutions" },
              { icon: <Camera className="h-8 w-8" />, name: "Surveillance" },
              { icon: <Lock className="h-8 w-8" />, name: "Access Control" },
              { icon: <Wifi className="h-8 w-8" />, name: "IoT Integration" },
              { icon: <Settings className="h-8 w-8" />, name: "Automation" }
            ].map((tech, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors duration-300">
                  <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                    {tech.icon}
                  </div>
                </div>
                <p className="text-sm font-medium text-muted-foreground">{tech.name}</p>
              </div>
            ))}
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
            Contact our experts today for a free consultation and custom quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+254795344905">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                <Phone className="mr-2 h-5 w-5" />
                Call for Quote
              </Button>
            </a>
            <a href="mailto:info@neurotriq.co.ke">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-foreground">
                <Mail className="mr-2 h-5 w-5" />
                Email Consultation
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;