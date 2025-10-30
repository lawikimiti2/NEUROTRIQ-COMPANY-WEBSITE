import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { projects as realProjects } from "@/lib/portfolioData";

const projects = realProjects;

const PortfolioCategory = () => {
  const { category } = useParams();
  const label = category ? decodeURIComponent(category) : "All";
  const filtered = label === "All" ? projects : projects.filter(p => p.category === label);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link to="/portfolio" className="text-sm text-primary">← Back to Portfolio</Link>
          </div>

          <h1 className="text-2xl font-bold mb-6">{label} Projects</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map(p => (
              <Card key={p.id} className="border-0 shadow-card">
                {p.image ? (
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img src={p.image} alt={p.title} className="w-full h-48 object-cover" />
                  </div>
                ) : null}
                <CardHeader>
                  {!p.image && (
                    <div className="mb-1"><span className="inline-block text-[11px] px-2 py-1 rounded bg-secondary text-foreground/90">{p.category}</span></div>
                  )}
                  <CardTitle className="text-xl">{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{p.description}</p>
                  <Button asChild>
                    <a href="/contact">Contact about this project</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PortfolioCategory;
