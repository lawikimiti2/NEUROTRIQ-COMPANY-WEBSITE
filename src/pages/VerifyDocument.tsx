import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

type DocumentType = "quote" | "invoice" | "receipt";

type LineItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

type VerifiedDocument = {
  type: DocumentType;
  number: string;
  status: string;
  clientName: string;
  issueDate: string;
  dueDate?: string;
  validUntil?: string;
  paymentMethod?: string;
  relatedInvoiceNumber?: string;
  lineItems: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
};

const typeLabels: Record<DocumentType, string> = {
  quote: "Quotation",
  invoice: "Invoice",
  receipt: "Receipt",
};

const formatMoney = (value: number) =>
  `KES ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

const VerifyDocument = () => {
  const { number } = useParams();
  const [document, setDocument] = useState<VerifiedDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || "";
        const res = await fetch(`${apiBase}/api/verify/${encodeURIComponent(number || "")}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setDocument(data.document);
      } catch (err) {
        console.error(err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [number]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Verifying...
            </div>
          ) : notFound || !document ? (
            <Card className="border-0 shadow-card">
              <CardContent className="p-10 text-center">
                <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h1 className="text-xl font-bold mb-2">Document Not Found</h1>
                <p className="text-muted-foreground">
                  We couldn't find a document with the number "{number}". It may have been entered
                  incorrectly, or this isn't a genuine NeuroTriQ document.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="text-center mb-8">
                <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Document Verified</h1>
                <p className="text-muted-foreground">
                  This {typeLabels[document.type].toLowerCase()} was genuinely issued by NeuroTriQ Company Limited.
                </p>
              </div>

              <Card className="border-0 shadow-card">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6 flex-wrap gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">{typeLabels[document.type]}</p>
                      <h2 className="text-xl font-bold">{document.number}</h2>
                    </div>
                    <Badge variant="secondary" className="uppercase">{document.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                      <p className="text-muted-foreground">Client</p>
                      <p className="font-medium">{document.clientName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Issue Date</p>
                      <p className="font-medium">{document.issueDate}</p>
                    </div>
                    {document.type === "invoice" && document.dueDate && (
                      <div>
                        <p className="text-muted-foreground">Due Date</p>
                        <p className="font-medium">{document.dueDate}</p>
                      </div>
                    )}
                    {document.type === "quote" && document.validUntil && (
                      <div>
                        <p className="text-muted-foreground">Valid Until</p>
                        <p className="font-medium">{document.validUntil}</p>
                      </div>
                    )}
                    {document.type === "receipt" && document.paymentMethod && (
                      <div>
                        <p className="text-muted-foreground">Payment Method</p>
                        <p className="font-medium">{document.paymentMethod}</p>
                      </div>
                    )}
                    {document.type === "receipt" && document.relatedInvoiceNumber && (
                      <div>
                        <p className="text-muted-foreground">For Invoice</p>
                        <p className="font-medium">{document.relatedInvoiceNumber}</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="space-y-2 mb-4">
                      {document.lineItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.description} × {item.quantity}
                          </span>
                          <span>{formatMoney(item.quantity * item.unitPrice)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3 space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatMoney(document.subtotal)}</span>
                      </div>
                      {document.taxRate > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tax ({document.taxRate}%)</span>
                          <span>{formatMoney(document.taxAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-base pt-1.5 border-t">
                        <span>Total</span>
                        <span>{formatMoney(document.total)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VerifyDocument;
