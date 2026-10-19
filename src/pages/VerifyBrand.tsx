import { Link } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight } from "lucide-react";

// Landing page for the general-purpose "authentic document" QR code that
// gets printed on letters, certificates and other material outside the
// quotes/invoices/receipts system (those have their own per-document QR
// that resolves via VerifyDocument.tsx at /verify/:number instead).
const VerifyBrand = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-24">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-card">
            <CardContent className="p-10 text-center">
              <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold mb-3">Authentic NeuroTriQ Document</h1>
              <p className="text-muted-foreground leading-relaxed mb-8">
                You've scanned an official NeuroTriQ verification code. This confirms the document
                it's printed on was issued by NeuroTriQ Company Limited — Kenya's trusted technology
                solutions provider for IT infrastructure, security systems, and smart building
                solutions.
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                If anything about this document looks unexpected, or you'd like to confirm it
                directly with us, get in touch and we'll verify it on our end.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/contact#get-in-touch">
                  <Button className="btn-tech rounded-full w-full sm:w-auto">
                    Contact Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" className="rounded-full w-full sm:w-auto">
                    Visit Homepage
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VerifyBrand;
