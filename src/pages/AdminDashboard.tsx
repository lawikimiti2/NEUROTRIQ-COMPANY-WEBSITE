import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";

type Message = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  serviceType?: string;
  projectBudget?: string;
  timeline?: string;
  message: string;
  newsletter?: boolean;
  createdAt?: string;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin");
      return;
    }

    (async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || "";
        const res = await fetch(`${apiBase}/api/admin/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error(err);
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Contact Messages</h1>
            <div className="space-x-2">
              <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            </div>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-4">
              {messages.length === 0 && <div>No messages yet.</div>}
              {messages.map((m) => (
                <div key={m._id} className="p-4 border rounded-md bg-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{m.firstName} {m.lastName}</h3>
                      <p className="text-sm text-muted-foreground">{m.email} • {m.phone}</p>
                      <p className="text-xs text-muted-foreground">{new Date(m.createdAt || '').toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-3 text-sm">
                    <p className="mb-2"><strong>Service:</strong> {m.serviceType}</p>
                    <p className="mb-2"><strong>Budget:</strong> {m.projectBudget}</p>
                    <p className="mb-2"><strong>Timeline:</strong> {m.timeline}</p>
                    <p className="mb-2"><strong>Company:</strong> {m.company}</p>
                    <p className="whitespace-pre-wrap">{m.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
