import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Download, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

// Import security solution images
import newCctvCamera2 from "@/assets/new-photos/our-projects-cctv-camera-2.jpg";
import newCctvDisplayWall from "@/assets/new-photos/our-projects-cctv-camera-display-screen.jpg";
import newCctvCamera4 from "@/assets/new-photos/our-projects-cctv-camera-4.jpg";
import newCctvCamera5 from "@/assets/new-photos/our-projects-cctv-camera-5.jpg";
import newCctvDisplayBox from "@/assets/new-photos/our-projects-cctv-display-screen-display-box.jpg";
import newDoorLockButton from "@/assets/new-photos/our-projects-security-door-lock-button.jpg";
import newGroundCableMarking from "@/assets/new-photos/our-projects-ground-cable-marking.jpg";
import secImg1 from "@/assets/SECURITY SOLUTIONS/IMG-20251028-WA0007.jpg";
import secImg2 from "@/assets/SECURITY SOLUTIONS/IMG-20251028-WA0008.jpg";
import secImg3 from "@/assets/SECURITY SOLUTIONS/IMG-20251028-WA0009.jpg";
import secImg4 from "@/assets/SECURITY SOLUTIONS/IMG-20251028-WA0010.jpg";
import secImg5 from "@/assets/SECURITY SOLUTIONS/IMG-20251028-WA0011.jpg";
import secImg6 from "@/assets/SECURITY SOLUTIONS/IMG-20251028-WA0012.jpg";
import secImg7 from "@/assets/SECURITY SOLUTIONS/IMG-20251028-WA0013.jpg";
import secImg8 from "@/assets/SECURITY SOLUTIONS/IMG-20251028-WA0014.jpg";
import secImg9 from "@/assets/SECURITY SOLUTIONS/IMG-20251028-WA0015.jpg";
import secImg10 from "@/assets/SECURITY SOLUTIONS/IMG-20251028-WA0016.jpg";
import secImg11 from "@/assets/SECURITY SOLUTIONS/IMG-20251028-WA0017.jpg";
import secImg12 from "@/assets/SECURITY SOLUTIONS/IMG-20251028-WA0018.jpg";
import secImg13 from "@/assets/SECURITY SOLUTIONS/IMG-20251028-WA0019.jpg";
import secImg14 from "@/assets/SECURITY SOLUTIONS/IMG-20251028-WA0021.jpg";
import secImg15 from "@/assets/SECURITY SOLUTIONS/IMG-20251028-WA0022.jpg";

const securityImages = [
  newCctvCamera2, newCctvDisplayWall, newCctvCamera4, newCctvCamera5,
  newCctvDisplayBox, newDoorLockButton, newGroundCableMarking,
  secImg1, secImg2, secImg3, secImg4, secImg5,
  secImg6, secImg7, secImg8, secImg9, secImg10,
  secImg11, secImg12, secImg13, secImg14, secImg15
];

const serviceDetails = {
  "it-solutions": {
    title: "IT Solutions & Infrastructure",
    description: "Enterprise-grade IT solutions tailored for modern businesses",
    sections: [
      {
        heading: "Network Architecture & Implementation",
        items: [
          "Enterprise-grade network design and deployment",
          "Wireless infrastructure optimization and security",
          "Network security monitoring and threat detection",
          "VPN and secure remote access solutions",
          "Load balancing and redundancy systems"
        ]
      },
      {
        heading: "Cloud Infrastructure",
        items: [
          "Cloud migration strategies and implementation",
          "Hybrid cloud architecture design",
          "Cloud security and compliance management",
          "Performance optimization and cost reduction",
          "Multi-cloud management solutions"
        ]
      },
      {
        heading: "System Integration",
        items: [
          "Legacy system modernization and integration",
          "API development and third-party integration",
          "Database management and optimization",
          "Custom software solutions development",
          "Enterprise application integration"
        ]
      }
    ],
    features: [
      "24/7 Technical Support & Monitoring",
      "Proactive System Health Checks",
      "Regular Security Updates & Patches",
      "Performance Optimization Services",
      "Disaster Recovery Planning",
      "Scalable Infrastructure Design"
    ]
  },
  "security-systems": {
    title: "Security Systems",
    description: "Advanced security solutions for complete peace of mind",
    sections: [
      {
        heading: "Access Control Systems",
        items: [
          "Biometric authentication (fingerprint, facial recognition)",
          "Smart card and RFID access systems",
          "Mobile-based access control solutions",
          "Visitor management and tracking systems",
          "Multi-level security clearance management"
        ]
      },
      {
        heading: "Video Surveillance",
        items: [
          "HD/4K IP camera systems installation",
          "AI-powered monitoring and analytics",
          "Remote viewing via mobile and web",
          "Video analytics and behavior detection",
          "Cloud-based video storage solutions"
        ]
      },
      {
        heading: "Intrusion Detection",
        items: [
          "Motion sensors and perimeter protection",
          "Glass break and vibration detection",
          "24/7 monitoring and alarm systems",
          "Mobile alert notifications",
          "Integration with emergency services"
        ]
      }
    ],
    features: [
      "Real-time Monitoring Dashboard",
      "Instant Alert System (SMS/Email)",
      "Mobile App Integration",
      "Regular Maintenance & Testing",
      "Security Audit Reports",
      "Emergency Response Planning"
    ]
  },
  "electrical": {
    title: "Electrical Installation & Services",
    description: "Professional electrical services for commercial and industrial needs",
    sections: [
      {
        heading: "Commercial Installations",
        items: [
          "Power distribution system design and installation",
          "LED lighting design and energy-efficient solutions",
          "Emergency power systems and backup generators",
          "Energy management and monitoring systems",
          "Electric vehicle charging station installation"
        ]
      },
      {
        heading: "Industrial Systems",
        items: [
          "Motor control centers and VFD installation",
          "PLC programming and automation systems",
          "Power factor correction solutions",
          "Industrial automation and control systems",
          "High-voltage electrical installations"
        ]
      },
      {
        heading: "Maintenance & Upgrades",
        items: [
          "Preventive maintenance programs",
          "Electrical system upgrades and retrofits",
          "Energy audits and efficiency improvements",
          "Compliance inspections and certifications",
          "Emergency repair services 24/7"
        ]
      }
    ],
    features: [
      "Licensed & Certified Electricians",
      "24/7 Emergency Services",
      "Safety Compliance & Inspections",
      "Energy Efficiency Solutions",
      "5-Year Warranty Coverage",
      "Free Initial Consultation"
    ]
  },
  "smart-infrastructure": {
    title: "Smart Infrastructure Solutions",
    description: "Intelligent building solutions for the modern age",
    sections: [
      {
        heading: "Building Automation",
        items: [
          "HVAC control and optimization systems",
          "Intelligent lighting automation and scheduling",
          "Energy management and consumption tracking",
          "Remote monitoring and control capabilities",
          "Predictive maintenance systems"
        ]
      },
      {
        heading: "IoT Integration",
        items: [
          "Sensor network deployment and management",
          "Real-time data analytics and reporting",
          "Predictive maintenance algorithms",
          "Custom mobile and web applications",
          "Cloud-based IoT platform integration"
        ]
      },
      {
        heading: "Smart Security Integration",
        items: [
          "Integrated access control with building systems",
          "Smart surveillance with AI analytics",
          "Automated alert and notification systems",
          "Remote facility management",
          "Occupancy monitoring and space optimization"
        ]
      }
    ],
    features: [
      "30-50% Energy Cost Reduction",
      "Remote Management Capabilities",
      "Predictive Maintenance Alerts",
      "Real-time Analytics Dashboard",
      "Mobile & Web Control Apps",
      "ROI Tracking & Reporting"
    ]
  },
  "consultancy": {
    title: "Consultancy for Companies",
    description: "Complete business support from registration to compliance and growth",
    sections: [
      {
        heading: "Company Registration",
        items: [
          "Business name search and registration",
          "Company incorporation services (Private, Public, LTD)",
          "Partnership and sole proprietorship registration",
          "Compliance setup and documentation",
          "Certificate of incorporation processing",
          "Memorandum and Articles of Association drafting"
        ]
      },
      {
        heading: "Government Accreditation & Certification",
        items: [
          "NCA (National Construction Authority) registration and renewal",
          "AGPO (Access to Government Procurement Opportunities) certification",
          "KRA PIN registration and tax compliance certificates",
          "E-Citizen business services registration",
          "County business permits and licenses",
          "Sector-specific regulatory approvals"
        ]
      },
      {
        heading: "Tender Management & Procurement",
        items: [
          "Tender identification and opportunity alerts",
          "Tender document preparation and application",
          "Prequalification documentation support",
          "E-GP (Electronic Government Procurement) registration",
          "Bid document compilation and submission",
          "Post-tender negotiation support"
        ]
      },
      {
        heading: "Administrative Support & Compliance",
        items: [
          "Annual returns filing and compliance",
          "Business license and permit renewals",
          "Statutory filings and regulatory submissions",
          "Tax compliance and advisory services",
          "Corporate governance consultancy",
          "Ongoing administrative support and management"
        ]
      }
    ],
    features: [
      "Fast-Track Registration Services",
      "Government Compliance Expertise",
      "Tender Success Track Record",
      "License & Permit Management",
      "Dedicated Account Manager",
      "Affordable Package Pricing"
    ]
  },
  "construction": {
    title: "General Construction & Infrastructure",
    description: "Professional construction services for commercial, industrial, and technology facilities",
    sections: [
      {
        heading: "Commercial Construction",
        items: [
          "Office building construction and renovations",
          "Retail space build-outs and fit-outs",
          "Warehouse and storage facility construction",
          "Commercial kitchen and restaurant construction",
          "Medical and healthcare facility construction",
          "Educational institution buildings and classrooms"
        ]
      },
      {
        heading: "Technology Infrastructure Construction",
        items: [
          "Data center construction and setup",
          "Server room design and construction",
          "Network operations center (NOC) facilities",
          "IT equipment rooms and communications centers",
          "Raised floor systems installation",
          "Climate control and precision cooling systems"
        ]
      },
      {
        heading: "Electrical & Cabling Infrastructure",
        items: [
          "Structured cabling systems (Cat6, Cat6a, Cat7, Fiber optic)",
          "Cable tray, ladder rack, and conduit installations",
          "Power distribution panels and backup systems",
          "UPS and generator room construction",
          "Grounding and lightning protection systems",
          "Patch panel, rack, and cabinet installations"
        ]
      },
      {
        heading: "Building Systems & Services",
        items: [
          "HVAC system installation and ductwork",
          "Plumbing and drainage systems",
          "Fire detection and suppression systems",
          "Access control and security infrastructure",
          "Building automation system integration",
          "Emergency lighting and exit systems"
        ]
      },
      {
        heading: "Specialized Construction Services",
        items: [
          "Clean room and controlled environment construction",
          "Security perimeter walls and fencing",
          "Camera and surveillance pole installations",
          "Solar panel mounting structures",
          "Generator shed and equipment housing",
          "Telecommunications tower foundations"
        ]
      },
      {
        heading: "Renovation & Remodeling",
        items: [
          "Office space renovations and upgrades",
          "Building facade improvements",
          "Interior partitioning and space division",
          "Ceiling and flooring installations",
          "Painting and finishing works",
          "Fixture and equipment installations"
        ]
      },
      {
        heading: "Project Management & Quality Assurance",
        items: [
          "End-to-end project planning and coordination",
          "Building code compliance and permits",
          "Quality control and safety inspections",
          "Material procurement and logistics",
          "Progress reporting and documentation",
          "As-built drawings and handover documentation"
        ]
      }
    ],
    features: [
      "Licensed General Contractors",
      "Experienced Project Managers",
      "Quality Workmanship Guaranteed",
      "On-Time Project Completion",
      "Building Code Compliance",
      "Comprehensive Warranty Coverage"
    ]
  }
};

// Security Solutions Carousel Component
const SecurityCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % securityImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + securityImages.length) % securityImages.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % securityImages.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-tech group">
      {/* Main Image Display */}
      <div className="relative w-full h-full">
        {securityImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentIndex
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={image}
              alt={`Security Solution ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {securityImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-8 h-2 bg-white'
                : 'w-2 h-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
        {currentIndex + 1} / {securityImages.length}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black/75 transition-colors"
        >
          {isAutoPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>
    </div>
  );
};

const ServiceDetail = () => {
  const { id } = useParams();
  const service = serviceDetails[id as keyof typeof serviceDetails];
  const isSecurityService = id === "security-systems";

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
          <Link to="/services">
            <Button>Back to Services</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-primary/10 to-steel-blue/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/services" className="inline-flex items-center text-primary hover:underline mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Link>
          <div className="text-center">
            <Badge variant="outline" className="mb-4">{service.title}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {service.description}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Security Solutions Carousel - Full Width */}
          {isSecurityService && (
            <div className="mb-16">
              <div className="text-center mb-8">
                <Badge variant="outline" className="mb-4">Our Work Showcase</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Security Solutions in Action
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Explore our portfolio of successful security installations and see the quality 
                  of our work across various projects.
                </p>
              </div>
              <SecurityCarousel />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Content Column */}
            <div className="lg:col-span-2 space-y-12">
              {service.sections.map((section, idx) => (
                <Card key={idx} className="border-0 shadow-card">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6 gradient-text">
                      {section.heading}
                    </h2>
                    <ul className="space-y-4">
                      {section.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Link to="/contact" className="flex-1">
                  <Button size="lg" className="w-full btn-tech">
                    <Calendar className="mr-2 h-5 w-5" />
                    Schedule Consultation
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="flex-1">
                  <Download className="mr-2 h-5 w-5" />
                  Download Brochure
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Key Features Card */}
              <Card className="border-0 shadow-card sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6">Key Features</h3>
                  <ul className="space-y-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card className="border-0 shadow-card bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Need Expert Advice?</h3>
                  <p className="mb-6 opacity-90">
                    Get a free consultation with our technical experts to discuss your specific requirements.
                  </p>
                  <Link to="/contact">
                    <Button variant="secondary" className="w-full">
                      Contact Us Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
