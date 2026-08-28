import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, FileSpreadsheet, Loader2, ChevronDown } from "lucide-react";

type Message = {
  id: number;
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
  isRead?: number;
  createdAt?: string;
};

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [exporting, setExporting] = useState<"pdf" | "excel" | null>(null);

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

  const handleRowClick = (m: Message) => {
    setSelected(m);
    if (m.isRead) return;

    const token = localStorage.getItem("admin_token");
    if (!token) return;

    setMessages((prev) => prev.map((msg) => (msg.id === m.id ? { ...msg, isRead: 1 } : msg)));
    setSelected((prev) => (prev && prev.id === m.id ? { ...prev, isRead: 1 } : prev));

    (async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || "";
        await fetch(`${apiBase}/api/admin/messages/${m.id}/read`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error(err);
      }
    })();
  };

  const handleExport = async (format: "pdf" | "excel") => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    setExporting(format);
    try {
      const apiBase = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${apiBase}/api/admin/messages/export/${format}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = format === "pdf" ? "contact-messages.pdf" : "contact-messages.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast({
        title: "Export failed",
        description: "Could not generate the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Contact Messages</h1>
              <p className="text-sm text-muted-foreground">
                {messages.length} {messages.length === 1 ? "message" : "messages"} received
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/admin/documents">
                <Button variant="ghost">Documents</Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" disabled={exporting !== null || messages.length === 0}>
                    {exporting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Extract
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport("pdf")}>
                    <FileText className="mr-2 h-4 w-4" />
                    Extract to PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("excel")}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Extract to Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            </div>
          </div>

          {loading ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="rounded-md border border-dashed p-12 text-center text-muted-foreground">
              No messages yet.
            </div>
          ) : (
            <div className="rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((m) => (
                    <TableRow
                      key={m.id}
                      onClick={() => handleRowClick(m)}
                      className="cursor-pointer"
                    >
                      <TableCell className={m.isRead ? "font-medium" : "font-bold"}>
                        {m.firstName} {m.lastName}
                        {m.newsletter ? (
                          <Badge variant="secondary" className="ml-2 align-middle">
                            newsletter
                          </Badge>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{m.email}</TableCell>
                      <TableCell>{m.serviceType || "—"}</TableCell>
                      <TableCell>{m.projectBudget || "—"}</TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {formatDate(m.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={m.isRead ? "secondary" : "default"}>
                          {m.isRead ? "Read" : "Unread"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
      <Footer />

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.firstName} {selected.lastName}</DialogTitle>
                <DialogDescription>{formatDate(selected.createdAt)}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p>{selected.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p>{selected.phone || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Company</p>
                    <p>{selected.company || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Service</p>
                    <p>{selected.serviceType || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Budget</p>
                    <p>{selected.projectBudget || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Timeline</p>
                    <p>{selected.timeline || "—"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Message</p>
                  <p className="whitespace-pre-wrap rounded-md bg-muted p-3">{selected.message}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">
                    Newsletter: {selected.newsletter ? "Subscribed" : "Not subscribed"}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
