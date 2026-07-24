import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Send,
  Loader2,
  CheckCircle,
  MessageSquare,
  Calendar,
  Users,
  Building,
  Shield,
  Cpu,
  Zap
} from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    serviceType: "",
    projectBudget: "",
    timeline: "",
    message: "",
    newsletter: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Prefill message when arriving with ?project=... in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const project = params.get("project");
    if (project) {
      setFormData(prev => ({
        ...prev,
        message: prev.message && prev.message.trim().length > 0
          ? prev.message
          : `I'm interested in this project: ${project}. Please contact me with more details.`
      }));
    }
  // run on first mount only for prefill
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // POST to backend API
    (async () => {
      setIsSubmitting(true);
      try {
        let apiBase: string = import.meta.env.VITE_API_URL || "";
        // If site is on HTTPS but API base is HTTP, upgrade to HTTPS to avoid mixed content
        if (typeof window !== 'undefined' && window.location.protocol === 'https:' && apiBase.startsWith('http://')) {
          apiBase = apiBase.replace('http://', 'https://');
        }
        const res = await fetch(`${apiBase}/api/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        if (!res.ok) throw new Error("Failed to send message");

        toast({
          title: "Message Sent Successfully!",
          description: "Thank you for contacting NeuroTriQ. We'll respond within 24 hours.",
        });

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          serviceType: "",
          projectBudget: "",
          timeline: "",
          message: "",
          newsletter: false
        });
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "There was an error sending your message. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "Phone",
      details: ["0795344905"],
      description: "Available 24/7 for emergency support"
    },
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Email",
      details: ["info@neurotriq.co.ke"],
      description: ""
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Address",
      details: [
        "Kins Arcade, Ground Floor, ongata rongai",
        "Intrade Africa Place, Lavington",
        "P.O. Box 4983-00100 Nairobi, Kenya"
      ],
      description: ""
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Business Hours",
      details: ["Monday - Friday: 8:00 AM - 6:00 PM"],
      description: "Emergency services available 24/7"
    }
  ];

  const serviceOptions = [
    { value: "it-solutions", label: "IT Solutions & Infrastructure", icon: <Cpu className="h-4 w-4" /> },
    { value: "security-systems", label: "Security Systems", icon: <Shield className="h-4 w-4" /> },
    { value: "electrical", label: "Electrical Installation", icon: <Zap className="h-4 w-4" /> },
    { value: "smart-infrastructure", label: "Smart Infrastructure", icon: <Building className="h-4 w-4" /> },
    { value: "consultancy", label: "Consultancy for Companies", icon: <MessageSquare className="h-4 w-4" /> },
    { value: "consultation", label: "General Consultation", icon: <MessageSquare className="h-4 w-4" /> }
  ];

  const officeLocations = [
    {
      name: "Kins Arcade Office",
      address: "Kins Arcade, Ground Floor, ongata rongai",
      postal: "P.O. Box 4983-00100 Nairobi, Kenya",
      phone: "0795344905",
      email: "info@neurotriq.co.ke",
      hours: "Mon-Fri: 8AM-6PM"
    },
    {
      name: "Intrade Africa Place Office",
      address: "Intrade Africa Place, Lavington",
      postal: "P.O. Box 4983-00100 Nairobi, Kenya",
      phone: "0795344905",
      email: "info@neurotriq.co.ke",
      hours: "Mon-Fri: 8AM-6PM"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary/10 to-steel-blue/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">Contact Us</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Let's Build Something
              <span className="gradient-text block">Amazing Together</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Ready to transform your technology infrastructure? Get in touch with our experts 
              for a free consultation and custom solution proposal.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-tech">
                <CardHeader>
                  <CardTitle className="text-2xl">Get in Touch</CardTitle>
                  <CardDescription className="text-base">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serviceType">Service Type *</Label>
                      <Select onValueChange={(value) => handleInputChange("serviceType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center space-x-2">
                                {option.icon}
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="projectBudget">Project Budget</Label>
                        <Select onValueChange={(value) => handleInputChange("projectBudget", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-10k">Under KES 10,000</SelectItem>
                            <SelectItem value="10k-50k">KES 10,000 - KES 50,000</SelectItem>
                            <SelectItem value="50k-100k">KES 50,000 - KES 100,000</SelectItem>
                            <SelectItem value="100k-500k">KES 100,000 - KES 500,000</SelectItem>
                            <SelectItem value="over-500k">Over KES 500,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timeline">Project Timeline</Label>
                        <Select onValueChange={(value) => handleInputChange("timeline", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asap">ASAP</SelectItem>
                            <SelectItem value="1-3-months">1-3 months</SelectItem>
                            <SelectItem value="3-6-months">3-6 months</SelectItem>
                            <SelectItem value="6-12-months">6-12 months</SelectItem>
                            <SelectItem value="planning">Planning phase</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Project Details *</Label>
                      <Textarea
                        id="message"
                        rows={5}
                        placeholder="Please describe your project requirements, current challenges, and any specific needs..."
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="newsletter"
                        checked={formData.newsletter}
                        onCheckedChange={(checked) => handleInputChange("newsletter", checked as boolean)}
                      />
                      <Label htmlFor="newsletter" className="text-sm">
                        Subscribe to our newsletter for technology insights and updates
                      </Label>
                    </div>

                    <Button type="submit" size="lg" className="btn-tech w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-5 w-5" />
                      )}
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl">Contact Information</CardTitle>
                  <CardDescription>
                    Multiple ways to reach our team for immediate assistance.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{info.title}</h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-sm text-foreground">{detail}</p>
                        ))}
                        <p className="text-xs text-muted-foreground mt-1">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl">Why Choose NeuroTriQ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "24/7 Emergency Support",
                      "Free Initial Consultation", 
                      "Certified Expert Team",
                      "Competitive Pricing",
                      "Warranty & Maintenance",
                      "Local & Regional Coverage"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Schedule a Consultation</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Book a free 30-minute consultation with our experts.
                  </p>
                  <a href="tel:+254795344905">
                    <Button variant="outline" size="sm" className="w-full">
                      Book Appointment
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Our Locations</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Visit Our Offices</h2>
            <p className="text-xl text-muted-foreground">
              Conveniently located to serve your technology needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {officeLocations.map((location, index) => (
              <Card key={index} className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{location.name}</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{location.address}</span>
                        </div>
                        { (location as any).postal && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{(location as any).postal}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{location.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{location.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{location.hours}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need Emergency Support?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Our emergency response team is available 24/7 for critical technology issues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+254795344905">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                <Phone className="mr-2 h-5 w-5" />
                Call Emergency Line
              </Button>
            </a>
            <a href="mailto:info@neurotriq.co.ke">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent border-white text-white hover:bg-white hover:text-foreground">
                <MessageSquare className="mr-2 h-5 w-5" />
                Email Support
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;