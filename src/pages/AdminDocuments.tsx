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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Plus, Download, ChevronDown, Loader2 } from "lucide-react";

type DocumentType = "quote" | "invoice" | "receipt";
type DocumentStatus = "open" | "sent" | "accepted" | "paid" | "void";

type Doc = {
  id: number;
  type: DocumentType;
  number: string;
  status: DocumentStatus;
  clientName: string;
  total: number;
  issueDate: string;
  createdAt: string;
};

const typeLabels: Record<DocumentType, string> = {
  quote: "Quote",
  invoice: "Invoice",
  receipt: "Receipt",
};

const statusVariant: Record<DocumentStatus, "default" | "secondary" | "destructive" | "outline"> = {
  open: "secondary",
  sent: "outline",
  accepted: "default",
  paid: "default",
  void: "destructive",
};

const formatMoney = (value: number) =>
  `KES ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

const AdminDocuments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<"all" | DocumentType>("all");
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const token = () => localStorage.getItem("admin_token");
  const apiBase = () => import.meta.env.VITE_API_URL || "";

  const loadDocuments = async () => {
    const t = token();
    if (!t) {
      navigate("/admin");
      return;
    }
    try {
      const res = await fetch(`${apiBase()}/api/admin/documents`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error(err);
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin");
  };

  const handleDownload = async (doc: Doc) => {
    const t = token();
    if (!t) return;
    setDownloadingId(doc.id);
    try {
      const res = await fetch(`${apiBase()}/api/admin/documents/${doc.id}/pdf`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.number}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast({
        title: "Download failed",
        description: "Could not generate the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleStatusChange = async (doc: Doc, status: DocumentStatus) => {
    const t = token();
    if (!t) return;
    setUpdatingId(doc.id);
    try {
      const res = await fetch(`${apiBase()}/api/admin/documents/${doc.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      setDocuments((prev) => prev.map((d) => (d.id === doc.id ? { ...d, status } : d)));
    } catch (err) {
      console.error(err);
      toast({
        title: "Update failed",
        description: "Could not update the status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = typeFilter === "all" ? documents : documents.filter((d) => d.type === typeFilter);

  const statusOptionsFor = (type: DocumentType): DocumentStatus[] =>
    type === "receipt"
      ? ["open", "sent", "void"]
      : type === "invoice"
      ? ["open", "sent", "paid", "void"]
      : ["open", "sent", "accepted", "void"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold">Quotes, Invoices & Receipts</h1>
              <p className="text-sm text-muted-foreground">
                {documents.length} {documents.length === 1 ? "document" : "documents"} total
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/admin/messages">
                <Button variant="ghost">Messages</Button>
              </Link>
              <Button asChild>
                <Link to="/admin/documents/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Document
                </Link>
              </Button>
              <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            </div>
          </div>

          <div className="mb-6">
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as "all" | DocumentType)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="quote">Quotes</SelectItem>
                <SelectItem value="invoice">Invoices</SelectItem>
                <SelectItem value="receipt">Receipts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="rounded-md border border-dashed p-12 text-center text-muted-foreground">
              No documents yet.
            </div>
          ) : (
            <div className="rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.number}</TableCell>
                      <TableCell>{typeLabels[doc.type]}</TableCell>
                      <TableCell>{doc.clientName}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatMoney(doc.total)}</TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">{doc.issueDate}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" disabled={updatingId === doc.id} className="h-auto p-0">
                              <Badge variant={statusVariant[doc.status]} className="cursor-pointer">
                                {doc.status}
                                <ChevronDown className="ml-1 h-3 w-3" />
                              </Badge>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            {statusOptionsFor(doc.type).map((s) => (
                              <DropdownMenuItem key={s} onClick={() => handleStatusChange(doc, s)}>
                                {s}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={downloadingId === doc.id}
                          onClick={() => handleDownload(doc)}
                        >
                          {downloadingId === doc.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
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
    </div>
  );
};

export default AdminDocuments;
