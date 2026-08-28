import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Loader2, ArrowLeft } from "lucide-react";

type DocumentType = "quote" | "invoice" | "receipt";

type LineItem = {
  description: string;
  quantity: string;
  unitPrice: string;
};

const emptyLineItem = (): LineItem => ({ description: "", quantity: "1", unitPrice: "" });

const AdminDocumentForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [type, setType] = useState<DocumentType>("quote");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [relatedInvoiceNumber, setRelatedInvoiceNumber] = useState("");
  const [taxRate, setTaxRate] = useState("16");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([emptyLineItem()]);

  const updateLineItem = (index: number, field: keyof LineItem, value: string) => {
    setLineItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const addLineItem = () => setLineItems((prev) => [...prev, emptyLineItem()]);
  const removeLineItem = (index: number) =>
    setLineItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));

  const subtotal = lineItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );
  const rate = Number(taxRate) || 0;
  const taxAmount = subtotal * (rate / 100);
  const total = subtotal + taxAmount;

  const formatMoney = (value: number) =>
    `KES ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin");
      return;
    }

    if (!clientName.trim()) {
      toast({ title: "Client name is required", variant: "destructive" });
      return;
    }
    const validItems = lineItems.filter((item) => item.description.trim());
    if (validItems.length === 0) {
      toast({ title: "Add at least one line item", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${apiBase}/api/admin/documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          clientName,
          clientEmail: clientEmail || undefined,
          clientPhone: clientPhone || undefined,
          clientAddress: clientAddress || undefined,
          issueDate,
          dueDate: type === "invoice" ? dueDate || undefined : undefined,
          validUntil: type === "quote" ? validUntil || undefined : undefined,
          paymentMethod: type === "receipt" ? paymentMethod || undefined : undefined,
          relatedInvoiceNumber: type === "receipt" ? relatedInvoiceNumber || undefined : undefined,
          taxRate: rate,
          notes: notes || undefined,
          lineItems: validItems.map((item) => ({
            description: item.description,
            quantity: Number(item.quantity) || 0,
            unitPrice: Number(item.unitPrice) || 0,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create document");
      }

      const data = await res.json();
      toast({
        title: `${type[0].toUpperCase()}${type.slice(1)} created`,
        description: `${data.document.number} was created successfully.`,
      });
      navigate("/admin/documents");
    } catch (err) {
      console.error(err);
      toast({
        title: "Could not create document",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/admin/documents" className="inline-flex items-center text-sm text-primary hover:underline mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Documents
          </Link>
          <h1 className="text-2xl font-bold mb-8">New Document</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="type">Document Type</Label>
                  <Select value={type} onValueChange={(v) => setType(v as DocumentType)}>
                    <SelectTrigger id="type" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quote">Quote</SelectItem>
                      <SelectItem value="invoice">Invoice</SelectItem>
                      <SelectItem value="receipt">Receipt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientName">Client Name *</Label>
                    <Input id="clientName" className="mt-1.5" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="clientEmail">Client Email</Label>
                    <Input id="clientEmail" type="email" className="mt-1.5" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="clientPhone">Client Phone</Label>
                    <Input id="clientPhone" className="mt-1.5" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="clientAddress">Client Address</Label>
                    <Input id="clientAddress" className="mt-1.5" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="issueDate">Issue Date</Label>
                    <Input id="issueDate" type="date" className="mt-1.5" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
                  </div>
                  {type === "invoice" && (
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input id="dueDate" type="date" className="mt-1.5" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>
                  )}
                  {type === "quote" && (
                    <div>
                      <Label htmlFor="validUntil">Valid Until</Label>
                      <Input id="validUntil" type="date" className="mt-1.5" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
                    </div>
                  )}
                  {type === "receipt" && (
                    <>
                      <div>
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Input id="paymentMethod" className="mt-1.5" placeholder="e.g. M-Pesa, Bank Transfer" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="relatedInvoiceNumber">For Invoice #</Label>
                        <Input id="relatedInvoiceNumber" className="mt-1.5" placeholder="e.g. INV-2026-0001" value={relatedInvoiceNumber} onChange={(e) => setRelatedInvoiceNumber(e.target.value)} />
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Line Items</h2>
                  <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>
                <div className="space-y-3">
                  {lineItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-start">
                      <div className="col-span-12 sm:col-span-6">
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateLineItem(index, "description", e.target.value)}
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(index, "quantity", e.target.value)}
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Unit Price"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(index, "unitPrice", e.target.value)}
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={lineItems.length === 1}
                          onClick={() => removeLineItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <Label htmlFor="taxRate" className="whitespace-nowrap">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-28"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                  />
                </div>

                <div className="mt-6 border-t pt-4 space-y-1.5 text-sm max-w-xs ml-auto">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatMoney(subtotal)}</span>
                  </div>
                  {rate > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax ({rate}%)</span>
                      <span>{formatMoney(taxAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-base pt-1.5 border-t">
                    <span>Total</span>
                    <span>{formatMoney(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" className="mt-1.5" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate("/admin/documents")}>
                Cancel
              </Button>
              <Button type="submit" className="btn-tech" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create {type[0].toUpperCase()}{type.slice(1)}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDocumentForm;
