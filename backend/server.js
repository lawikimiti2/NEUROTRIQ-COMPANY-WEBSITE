import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import db from "./database.js";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import QRCode from "qrcode";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, ".env") });

const LOGO_PATH = join(__dirname, "assets", "neurotriq_logo.png");
// Tightly-trimmed version (source PNG has ~17% dead transparent padding
// baked in, which made the logo look small/blurry at a given width) —
// used for PDF letterheads. Excel export keeps the original, since its
// image dimensions are calibrated to that file's exact aspect ratio.
const LOGO_PATH_UI = join(__dirname, "assets", "neurotriq_logo_ui.png");
const COMPANY = {
  name: "NeuroTriQ Company Limited",
  address: "Intrade Africa Place, Lavington | P.O. Box 4983-00100 Nairobi, Kenya",
  contact: "Phone: 0795344905 | Email: info@neurotriq.co.ke",
  kraPin: "P052459770V",
};

const DOCUMENT_TYPES = ["quote", "invoice", "receipt"];
const DOCUMENT_LABELS = { quote: "QUOTATION", invoice: "INVOICE", receipt: "RECEIPT" };
const DOCUMENT_PREFIXES = { quote: "QUO", invoice: "INV", receipt: "RCT" };

function generateDocumentNumber(type) {
  const year = new Date().getFullYear();
  const prefix = `${DOCUMENT_PREFIXES[type]}-${year}-`;
  const row = db
    .prepare("SELECT COUNT(*) as count FROM documents WHERE number LIKE ?")
    .get(`${prefix}%`);
  const seq = (row?.count || 0) + 1;
  return `${prefix}${String(seq).padStart(4, "0")}`;
}

function computeTotals(lineItems, taxRate) {
  const subtotal = lineItems.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
    0
  );
  const taxAmount = subtotal * (Number(taxRate) / 100);
  const total = subtotal + taxAmount;
  return { subtotal, taxAmount, total };
}

function serializeDocument(row) {
  return { ...row, lineItems: JSON.parse(row.lineItems) };
}

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;
const DEFAULT_DOCUMENT_COLOR = "#3182ed";
const DEFAULT_BACKGROUND_COLOR = "#ffffff";

// Validates + normalizes a create/edit request body. For edits, `existing`
// (the current DB row, already serialized) supplies defaults for anything
// not present in `body`, so a partial PATCH doesn't wipe unrelated fields.
function buildDocumentFields(body, existing = null) {
  const merged = existing ? { ...existing, ...body } : body;
  const { type, clientName, clientEmail, clientPhone, clientAddress,
    issueDate, dueDate, validUntil, paymentMethod, relatedInvoiceNumber,
    lineItems, taxRate, notes, color, backgroundColor } = merged;

  if (!DOCUMENT_TYPES.includes(type)) {
    return { error: "Invalid document type" };
  }
  if (!clientName || typeof clientName !== "string") {
    return { error: "Client name is required" };
  }
  if (!Array.isArray(lineItems) || lineItems.length === 0) {
    return { error: "At least one line item is required" };
  }
  for (const item of lineItems) {
    if (!item.description || !(Number(item.quantity) > 0) || !(Number(item.unitPrice) >= 0)) {
      return { error: "Each line item needs a description, a positive quantity, and a unit price" };
    }
  }
  const resolvedColor = color && HEX_COLOR_RE.test(color) ? color : DEFAULT_DOCUMENT_COLOR;
  const resolvedBackgroundColor = backgroundColor && HEX_COLOR_RE.test(backgroundColor) ? backgroundColor : DEFAULT_BACKGROUND_COLOR;

  const cleanLineItems = lineItems.map((item) => ({
    description: clean(String(item.description)),
    quantity: Number(item.quantity),
    unitPrice: Number(item.unitPrice),
  }));
  const rate = Number(taxRate) || 0;
  const { subtotal, taxAmount, total } = computeTotals(cleanLineItems, rate);

  return {
    fields: {
      type,
      clientName: clean(clientName),
      clientEmail: clean(clientEmail) || null,
      clientPhone: clean(clientPhone) || null,
      clientAddress: clean(clientAddress) || null,
      issueDate: issueDate || new Date().toISOString().slice(0, 10),
      dueDate: dueDate || null,
      validUntil: validUntil || null,
      paymentMethod: paymentMethod || null,
      relatedInvoiceNumber: relatedInvoiceNumber || null,
      lineItems: cleanLineItems,
      subtotal,
      taxRate: rate,
      taxAmount,
      total,
      notes: clean(notes) || null,
      color: resolvedColor,
      backgroundColor: resolvedBackgroundColor,
    },
  };
}

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

// Helmet adds common security headers
app.use(helmet());

// CORS: restrict to the configured client URL, plus its www/non-www
// counterpart — the site is reachable at both (e.g. www.neurotriq.co.ke
// serves directly rather than redirecting to the bare domain), and a
// mismatch here doesn't show up as a CORS error: the browser silently
// discards the response, which looks exactly like a rejected login.
const configuredOrigin = process.env.CLIENT_URL;
const allowedOrigins = configuredOrigin
  ? [
      configuredOrigin,
      configuredOrigin.startsWith("https://www.")
        ? configuredOrigin.replace("https://www.", "https://")
        : configuredOrigin.replace("https://", "https://www."),
    ]
  : null;

app.use(cors({
  origin: allowedOrigins
    ? (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
      }
    : true,
  credentials: true,
}));

// Global rate limiter (burst control)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Stricter limiter for contact form
const contactLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max 10 submissions per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
});

// Contact form submission endpoint
// Simple input sanitization
const clean = (v) =>
  typeof v === 'string'
    ? v.replace(/[\u0000-\u001F\u007F<>]/g, '').trim().slice(0, 2000)
    : v;

// Contact form submission endpoint
app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const data = {
      firstName: clean(req.body.firstName),
      lastName: clean(req.body.lastName),
      email: clean(req.body.email),
      phone: clean(req.body.phone),
      company: clean(req.body.company),
      serviceType: clean(req.body.serviceType),
      projectBudget: clean(req.body.projectBudget),
      timeline: clean(req.body.timeline),
      message: clean(req.body.message),
      newsletter: Boolean(req.body.newsletter)
    };
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.message) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // Basic email format check
    const emailOk = /.+@.+\..+/.test(data.email);
    if (!emailOk) return res.status(400).json({ error: "Invalid email" });

    // Insert contact into SQLite database
    const stmt = db.prepare(`
      INSERT INTO contacts (
        firstName, lastName, email, phone, company, 
        serviceType, projectBudget, timeline, message, newsletter
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.firstName,
      data.lastName,
      data.email,
      data.phone || null,
      data.company || null,
      data.serviceType || null,
      data.projectBudget || null,
      data.timeline || null,
      data.message,
      data.newsletter ? 1 : 0
    );

    // Send email notification
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587,
        secure: process.env.EMAIL_SECURE === "true",
        auth: process.env.EMAIL_USER && process.env.EMAIL_PASS ? {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        } : undefined
      });

      const to = process.env.CONTACT_EMAIL || process.env.ADMIN_EMAIL;
      const subject = `New contact from ${data.firstName} ${data.lastName}`;
      const escape = (s='') => String(s).replace(/[&<>"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
      const html = `
        <p><strong>Name:</strong> ${escape(data.firstName)} ${escape(data.lastName)}</p>
        <p><strong>Email:</strong> ${escape(data.email)}</p>
        <p><strong>Phone:</strong> ${escape(data.phone || 'N/A')}</p>
        <p><strong>Company:</strong> ${escape(data.company || 'N/A')}</p>
        <p><strong>Service:</strong> ${escape(data.serviceType || 'N/A')}</p>
        <p><strong>Budget:</strong> ${escape(data.projectBudget || 'N/A')}</p>
        <p><strong>Timeline:</strong> ${escape(data.timeline || 'N/A')}</p>
        <p><strong>Newsletter:</strong> ${data.newsletter ? 'Yes' : 'No'}</p>
        <hr />
        <p>${escape(data.message)}</p>
      `;

      if (to && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to,
          subject,
          html
        });
      } else {
        console.log("Email not sent — SMTP not configured. Email preview:", { to, subject, html });
      }
    } catch (mailErr) {
      console.error("Email send error:", mailErr);
    }

    // Get the inserted contact data
    const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(result.lastInsertRowid);

    return res.status(201).json({ success: true, contact });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Simple admin auth middleware: Bearer token must match ADMIN_TOKEN
const adminAuth = (req, res, next) => {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (token && process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN) return next();
  return res.status(401).json({ error: 'Unauthorized' });
};

// Admin routes - Get all contacts (protected via static ADMIN_TOKEN, for scripts/integrations)
app.get("/api/admin/contacts", adminAuth, (req, res) => {
  try {
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY createdAt DESC').all();
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin login for the dashboard UI: checks against ADMIN_EMAIL/ADMIN_PASS env vars, issues a JWT
app.post("/api/admin/login", (req, res) => {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured");
    return res.status(500).json({ error: "Server misconfigured" });
  }

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing credentials" });

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASS) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '8h' });
  return res.json({ token });
});

// JWT auth middleware for the dashboard UI (distinct from the static-token adminAuth above)
const jwtAuth = (req, res, next) => {
  if (!process.env.JWT_SECRET) return res.status(500).json({ error: 'Server misconfigured' });
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin dashboard - list contact messages (protected via JWT from /api/admin/login)
app.get("/api/admin/messages", jwtAuth, (req, res) => {
  try {
    const messages = db.prepare('SELECT * FROM contacts ORDER BY createdAt DESC').all();
    res.json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Mark a message as read/opened
app.patch("/api/admin/messages/:id/read", jwtAuth, (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

    db.prepare('UPDATE contacts SET isRead = 1 WHERE id = ?').run(id);
    const message = db.prepare('SELECT * FROM contacts WHERE id = ?').get(id);
    if (!message) return res.status(404).json({ error: "Not found" });

    res.json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Export all messages as a PDF report with a company letterhead
app.get("/api/admin/messages/export/pdf", jwtAuth, (req, res) => {
  try {
    const messages = db.prepare('SELECT * FROM contacts ORDER BY createdAt DESC').all();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="contact-messages.pdf"');

    const doc = new PDFDocument({ margin: 40, size: "A4", layout: "landscape" });
    doc.pipe(res);

    // Letterhead
    doc.image(LOGO_PATH_UI, 40, 20, { width: 62 });
    doc.font("Helvetica-Bold").fontSize(15).text(COMPANY.name, 112, 28);
    doc.font("Helvetica").fontSize(8).text(COMPANY.address, 112, 46);
    doc.text(COMPANY.contact, 112, 57);
    doc.moveTo(40, 80).lineTo(doc.page.width - 40, 80).stroke();

    doc.font("Helvetica-Bold").fontSize(13).text("Contact Messages Report", 40, 90);
    doc.font("Helvetica").fontSize(8).text(`Generated: ${new Date().toLocaleString()}  |  Total messages: ${messages.length}`, 40, 107);

    const cols = [
      { label: "Name", x: 40, width: 100 },
      { label: "Email", x: 140, width: 130 },
      { label: "Phone", x: 270, width: 75 },
      { label: "Service", x: 345, width: 110 },
      { label: "Budget", x: 455, width: 90 },
      { label: "Received", x: 545, width: 90 },
      { label: "Status", x: 635, width: 70 },
    ];

    const drawHeader = (y) => {
      doc.font("Helvetica-Bold").fontSize(8);
      cols.forEach((c) => doc.text(c.label, c.x, y, { width: c.width }));
      doc.moveTo(40, y + 14).lineTo(doc.page.width - 40, y + 14).stroke();
    };

    let y = 128;
    drawHeader(y);
    y += 20;

    doc.font("Helvetica").fontSize(8);
    messages.forEach((m) => {
      if (y > doc.page.height - 50) {
        doc.addPage();
        y = 40;
        drawHeader(y);
        y += 20;
        doc.font("Helvetica").fontSize(8);
      }
      doc.text(`${m.firstName} ${m.lastName}`, cols[0].x, y, { width: cols[0].width });
      doc.text(m.email, cols[1].x, y, { width: cols[1].width });
      doc.text(m.phone || "-", cols[2].x, y, { width: cols[2].width });
      doc.text(m.serviceType || "-", cols[3].x, y, { width: cols[3].width });
      doc.text(m.projectBudget || "-", cols[4].x, y, { width: cols[4].width });
      doc.text(new Date(m.createdAt).toLocaleDateString(), cols[5].x, y, { width: cols[5].width });
      doc.text(m.isRead ? "Read" : "Unread", cols[6].x, y, { width: cols[6].width });
      y += 16;
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Export all messages as an Excel workbook with a company letterhead
app.get("/api/admin/messages/export/excel", jwtAuth, async (req, res) => {
  try {
    const messages = db.prepare('SELECT * FROM contacts ORDER BY createdAt DESC').all();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Contact Messages", {
      views: [{ showGridLines: false, showRowColHeaders: false }],
    });

    // Fixed size (matching the logo's real aspect ratio, 340x262) anchored to
    // the top-left cell, so it doesn't stretch to fill a merged cell range.
    // Sized to fit within the letterhead's first 5 rows without overlapping
    // the "Contact Messages Report" title below it.
    const logoId = workbook.addImage({ filename: LOGO_PATH, extension: "png" });
    sheet.addImage(logoId, {
      tl: { col: 0.1, row: 0.1 },
      ext: { width: 117, height: 90 },
    });

    sheet.mergeCells("C1:K1");
    sheet.getCell("C1").value = COMPANY.name;
    sheet.getCell("C1").font = { bold: true, size: 14 };
    sheet.mergeCells("C2:K2");
    sheet.getCell("C2").value = COMPANY.address;
    sheet.getCell("C2").font = { size: 9 };
    sheet.mergeCells("C3:K3");
    sheet.getCell("C3").value = COMPANY.contact;
    sheet.getCell("C3").font = { size: 9 };

    sheet.mergeCells("A6:K6");
    sheet.getCell("A6").value = "Contact Messages Report";
    sheet.getCell("A6").font = { bold: true, size: 13 };
    sheet.mergeCells("A7:K7");
    sheet.getCell("A7").value = `Generated: ${new Date().toLocaleString()}  |  Total messages: ${messages.length}`;
    sheet.getCell("A7").font = { italic: true, size: 9 };

    sheet.addRow([]);
    const headerRow = sheet.addRow([
      "Name", "Email", "Phone", "Company", "Service", "Budget",
      "Timeline", "Message", "Newsletter", "Status", "Received",
    ]);
    const thinBorder = {
      top: { style: "thin", color: { argb: "FFD1D5DB" } },
      bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
      left: { style: "thin", color: { argb: "FFD1D5DB" } },
      right: { style: "thin", color: { argb: "FFD1D5DB" } },
    };

    headerRow.font = { bold: true };
    headerRow.eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE5E7EB" } };
      cell.border = thinBorder;
    });

    messages.forEach((m) => {
      const row = sheet.addRow([
        `${m.firstName} ${m.lastName}`,
        m.email,
        m.phone || "",
        m.company || "",
        m.serviceType || "",
        m.projectBudget || "",
        m.timeline || "",
        m.message,
        m.newsletter ? "Yes" : "No",
        m.isRead ? "Read" : "Unread",
        new Date(m.createdAt).toLocaleString(),
      ]);
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = thinBorder;
      });
    });

    sheet.columns.forEach((col) => { col.width = 20; });
    sheet.getColumn(8).width = 50;

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", 'attachment; filename="contact-messages.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create a quote, invoice, or receipt
app.post("/api/admin/documents", jwtAuth, (req, res) => {
  try {
    const { error, fields } = buildDocumentFields(req.body);
    if (error) return res.status(400).json({ error });

    const number = generateDocumentNumber(fields.type);
    const stmt = db.prepare(`
      INSERT INTO documents (
        type, number, status, clientName, clientEmail, clientPhone, clientAddress,
        issueDate, dueDate, validUntil, paymentMethod, relatedInvoiceNumber,
        lineItems, subtotal, taxRate, taxAmount, total, notes, color, backgroundColor
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      fields.type,
      number,
      "open",
      fields.clientName,
      fields.clientEmail,
      fields.clientPhone,
      fields.clientAddress,
      fields.issueDate,
      fields.dueDate,
      fields.validUntil,
      fields.paymentMethod,
      fields.relatedInvoiceNumber,
      JSON.stringify(fields.lineItems),
      fields.subtotal,
      fields.taxRate,
      fields.taxAmount,
      fields.total,
      fields.notes,
      fields.color,
      fields.backgroundColor
    );

    const record = db.prepare("SELECT * FROM documents WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json({ document: serializeDocument(record) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// List quotes/invoices/receipts, optionally filtered by ?type=
app.get("/api/admin/documents", jwtAuth, (req, res) => {
  try {
    const { type } = req.query;
    const rows = type && DOCUMENT_TYPES.includes(type)
      ? db.prepare("SELECT * FROM documents WHERE type = ? ORDER BY createdAt DESC").all(type)
      : db.prepare("SELECT * FROM documents ORDER BY createdAt DESC").all();
    res.json({ documents: rows.map(serializeDocument) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get one document (admin, full detail)
app.get("/api/admin/documents/:id", jwtAuth, (req, res) => {
  try {
    const row = db.prepare("SELECT * FROM documents WHERE id = ?").get(Number(req.params.id));
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json({ document: serializeDocument(row) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update a document — either just its status (open -> sent -> paid/accepted,
// or void), or a full edit of its content (client info, line items, color,
// etc). A request may include `status`, edit fields, or both.
app.patch("/api/admin/documents/:id", jwtAuth, (req, res) => {
  try {
    const id = Number(req.params.id);
    const existingRow = db.prepare("SELECT * FROM documents WHERE id = ?").get(id);
    if (!existingRow) return res.status(404).json({ error: "Not found" });
    const existing = serializeDocument(existingRow);

    const { status, ...editBody } = req.body;
    let nextStatus = existing.status;
    if (status !== undefined) {
      const allowedStatuses = ["open", "sent", "accepted", "paid", "void"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      nextStatus = status;
    }

    const isContentEdit = Object.keys(editBody).length > 0;
    let fields = existing;
    if (isContentEdit) {
      const result = buildDocumentFields(editBody, existing);
      if (result.error) return res.status(400).json({ error: result.error });
      fields = result.fields;
    }

    db.prepare(`
      UPDATE documents SET
        type = ?, status = ?, clientName = ?, clientEmail = ?, clientPhone = ?,
        clientAddress = ?, issueDate = ?, dueDate = ?, validUntil = ?,
        paymentMethod = ?, relatedInvoiceNumber = ?, lineItems = ?, subtotal = ?,
        taxRate = ?, taxAmount = ?, total = ?, notes = ?, color = ?, backgroundColor = ?
      WHERE id = ?
    `).run(
      fields.type,
      nextStatus,
      fields.clientName,
      fields.clientEmail,
      fields.clientPhone,
      fields.clientAddress,
      fields.issueDate,
      fields.dueDate,
      fields.validUntil,
      fields.paymentMethod,
      fields.relatedInvoiceNumber,
      isContentEdit ? JSON.stringify(fields.lineItems) : JSON.stringify(existing.lineItems),
      fields.subtotal,
      fields.taxRate,
      fields.taxAmount,
      fields.total,
      fields.notes,
      fields.color,
      fields.backgroundColor,
      id
    );

    const row = db.prepare("SELECT * FROM documents WHERE id = ?").get(id);
    res.json({ document: serializeDocument(row) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Generate the branded PDF for a quote/invoice/receipt, with a QR code
// linking to its public verification page. Receipts render on A5 (they're
// short, single-payment documents); quotes/invoices use A4. All positions
// are computed from the page's actual width/margin rather than fixed A4
// pixel values, since A5 is considerably narrower.
app.get("/api/admin/documents/:id/pdf", jwtAuth, async (req, res) => {
  try {
    const row = db.prepare("SELECT * FROM documents WHERE id = ?").get(Number(req.params.id));
    if (!row) return res.status(404).json({ error: "Not found" });
    const record = serializeDocument(row);
    const themeColor = HEX_COLOR_RE.test(record.color) ? record.color : DEFAULT_DOCUMENT_COLOR;
    const pageBackgroundColor = HEX_COLOR_RE.test(record.backgroundColor) ? record.backgroundColor : DEFAULT_BACKGROUND_COLOR;
    const isReceipt = record.type === "receipt";

    // QR stays plain black/white regardless of theme — colour tinting a QR
    // code risks contrast/scan-reliability issues, and the theme colour is
    // meant to show up as background fills, not on the code or on text.
    const verifyUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/verify/${record.number}`;
    const qrBuffer = await QRCode.toBuffer(verifyUrl, { width: 200, margin: 1 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${record.number}.pdf"`);

    const margin = isReceipt ? 30 : 50;
    const doc = new PDFDocument({ margin, size: isReceipt ? "A5" : "A4" });
    doc.pipe(res);

    // Page background fill (defaults to white). .fill() also sets the
    // current fillColor as a side effect, so it must be reset to black
    // afterward or all subsequent text would render invisibly. Registered
    // on 'pageAdded' too, so an overflow page (long line-item lists) gets
    // the same background instead of falling back to white.
    const paintPageBackground = () => {
      doc.rect(0, 0, doc.page.width, doc.page.height).fill(pageBackgroundColor);
      doc.fillColor("black");
    };
    paintPageBackground();
    doc.on("pageAdded", paintPageBackground);

    const pageWidth = doc.page.width;
    const contentWidth = pageWidth - margin * 2;
    const rightEdge = pageWidth - margin;
    const logoWidth = isReceipt ? 50 : 80;
    const qrWidth = isReceipt ? 55 : 80;
    const gap = isReceipt ? 8 : 10;
    const letterheadX = margin + logoWidth + gap;
    const qrX = rightEdge - qrWidth;
    const letterheadWidth = qrX - gap - letterheadX;

    // Letterhead — text width is capped so a long line wraps instead of
    // running into the QR code's space (drawn afterward, so it would
    // otherwise paint over the tail end rather than actually overlapping).
    // Each line's y is computed from the actual (possibly wrapped) height
    // of the one before it, rather than guessed fixed offsets.
    doc.image(LOGO_PATH_UI, margin, margin - 5, { width: logoWidth });
    let letterheadY = margin + 2;
    doc.fillColor("black").font("Helvetica-Bold").fontSize(isReceipt ? 12 : 16);
    doc.text(COMPANY.name, letterheadX, letterheadY, { width: letterheadWidth });
    letterheadY += doc.heightOfString(COMPANY.name, { width: letterheadWidth }) + 4;

    doc.font("Helvetica").fontSize(isReceipt ? 7 : 9);
    doc.text(COMPANY.address, letterheadX, letterheadY, { width: letterheadWidth });
    letterheadY += doc.heightOfString(COMPANY.address, { width: letterheadWidth }) + 2;

    doc.text(COMPANY.contact, letterheadX, letterheadY, { width: letterheadWidth });
    letterheadY += doc.heightOfString(COMPANY.contact, { width: letterheadWidth }) + 2;

    doc.text(`KRA PIN: ${COMPANY.kraPin}`, letterheadX, letterheadY, { width: letterheadWidth });
    letterheadY += doc.heightOfString(`KRA PIN: ${COMPANY.kraPin}`, { width: letterheadWidth });

    doc.image(qrBuffer, qrX, margin - 5, { width: qrWidth });
    doc.font("Helvetica").fontSize(6).text("Scan to verify", qrX, margin - 5 + qrWidth + 2, { width: qrWidth, align: "center" });

    const headerBottom = Math.max(letterheadY, margin - 5 + qrWidth + 12) + 8;
    doc.strokeColor("#d1d5db").lineWidth(1).moveTo(margin, headerBottom).lineTo(rightEdge, headerBottom).stroke();
    doc.strokeColor("black");

    // Title — a coloured banner with white text, rather than coloured text
    // on the plain page background.
    let y = headerBottom + (isReceipt ? 12 : 15);
    const titleBandHeight = isReceipt ? 22 : 28;
    doc.rect(margin, y - 5, contentWidth, titleBandHeight).fill(themeColor);
    doc.fillColor("white").font("Helvetica-Bold").fontSize(isReceipt ? 15 : 18)
      .text(DOCUMENT_LABELS[record.type], margin + 10, y, { width: contentWidth - 20 });
    doc.fillColor("black");
    y += titleBandHeight + (isReceipt ? 8 : 10);
    doc.font("Helvetica").fontSize(isReceipt ? 8 : 10).text(`#${record.number}`, margin, y);
    doc.text(`Status: ${record.status.toUpperCase()}`, margin, y, { width: contentWidth, align: "right" });

    y += isReceipt ? 16 : 20;
    doc.text(`Issue Date: ${record.issueDate}`, margin, y);
    const metaSecondColX = margin + contentWidth * 0.45;
    if (record.type === "invoice" && record.dueDate) {
      doc.text(`Due Date: ${record.dueDate}`, metaSecondColX, y);
    }
    if (record.type === "quote" && record.validUntil) {
      doc.text(`Valid Until: ${record.validUntil}`, metaSecondColX, y);
    }
    if (record.type === "receipt") {
      if (record.paymentMethod) doc.text(`Paid via: ${record.paymentMethod}`, metaSecondColX, y);
      if (record.relatedInvoiceNumber) {
        y += isReceipt ? 13 : 15;
        doc.text(`For Invoice: ${record.relatedInvoiceNumber}`, margin, y);
      }
    }

    // Bill To
    y += isReceipt ? 20 : 30;
    doc.font("Helvetica-Bold").fontSize(isReceipt ? 9 : 11).text(isReceipt ? "Received From" : "Bill To", margin, y);
    doc.font("Helvetica").fontSize(isReceipt ? 8 : 10);
    y += isReceipt ? 13 : 16;
    doc.text(record.clientName, margin, y);
    const lineGap = isReceipt ? 11 : 14;
    if (record.clientEmail) { y += lineGap; doc.text(record.clientEmail, margin, y); }
    if (record.clientPhone) { y += lineGap; doc.text(record.clientPhone, margin, y); }
    if (record.clientAddress) { y += lineGap; doc.text(record.clientAddress, margin, y, { width: contentWidth * 0.7 }); }

    // Line items table — column widths are proportions of content width so
    // they scale correctly between A4 and A5.
    y += isReceipt ? 18 : 28;
    const fontSize = isReceipt ? 8 : 9;
    const descW = contentWidth * 0.42;
    const qtyW = contentWidth * 0.13;
    const priceW = contentWidth * 0.2;
    const amountW = contentWidth - descW - qtyW - priceW;
    const cols = [
      { label: "Description", x: margin, width: descW },
      { label: "Qty", x: margin + descW, width: qtyW, align: "right" },
      { label: "Unit Price", x: margin + descW + qtyW, width: priceW, align: "right" },
      { label: "Amount", x: margin + descW + qtyW + priceW, width: amountW, align: "right" },
    ];
    const headerRowHeight = isReceipt ? 16 : 20;
    doc.rect(margin, y - 4, contentWidth, headerRowHeight).fill(themeColor);
    doc.font("Helvetica-Bold").fontSize(fontSize).fillColor("white");
    cols.forEach((c) => doc.text(c.label, c.x, y, { width: c.width, align: c.align }));
    doc.fillColor("black");
    y += headerRowHeight + (isReceipt ? 6 : 8);

    doc.font("Helvetica").fontSize(fontSize);
    const rowHeight = isReceipt ? 15 : 18;
    record.lineItems.forEach((item) => {
      if (y > doc.page.height - (isReceipt ? 90 : 150)) {
        doc.addPage();
        y = margin;
      }
      const amount = item.quantity * item.unitPrice;
      doc.text(item.description, cols[0].x, y, { width: cols[0].width });
      doc.text(String(item.quantity), cols[1].x, y, { width: cols[1].width, align: "right" });
      doc.text(item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }), cols[2].x, y, { width: cols[2].width, align: "right" });
      doc.text(amount.toLocaleString(undefined, { minimumFractionDigits: 2 }), cols[3].x, y, { width: cols[3].width, align: "right" });
      y += rowHeight;
    });

    y += isReceipt ? 6 : 10;
    const totalsLabelX = margin + contentWidth * 0.55;
    doc.moveTo(totalsLabelX, y).lineTo(rightEdge, y).stroke();
    y += isReceipt ? 6 : 10;

    const totalsRow = (label, value, bold = false) => {
      const size = bold ? fontSize + 2 : fontSize + 1;
      const rowH = bold ? (isReceipt ? 18 : 22) : (isReceipt ? 13 : 16);
      if (bold) {
        doc.rect(totalsLabelX - 8, y - 4, rightEdge - totalsLabelX + 8, rowH).fill(themeColor);
        doc.fillColor("white");
      }
      doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(size);
      doc.text(label, totalsLabelX, y, { width: (rightEdge - totalsLabelX) * 0.55, align: "right" });
      doc.text(`KES ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, totalsLabelX + (rightEdge - totalsLabelX) * 0.55, y, { width: (rightEdge - totalsLabelX) * 0.45, align: "right" });
      if (bold) doc.fillColor("black");
      y += rowH;
    };
    totalsRow("Subtotal", record.subtotal);
    if (record.taxRate > 0) totalsRow(`Tax (${record.taxRate}%)`, record.taxAmount);
    totalsRow("TOTAL", record.total, true);

    if (record.notes) {
      y += isReceipt ? 12 : 20;
      doc.font("Helvetica-Bold").fontSize(fontSize + 1).text("Notes", margin, y);
      y += isReceipt ? 11 : 15;
      doc.font("Helvetica").fontSize(fontSize).text(record.notes, margin, y, { width: contentWidth });
    }

    // Positioned relative to where the content actually ended, rather than
    // pinned to the page bottom — anchoring near the bottom margin on the
    // shorter A5 page was enough to trip pdfkit's own auto-pagination and
    // silently produce a blank trailing page.
    y += isReceipt ? 20 : 30;
    doc.font("Helvetica").fontSize(isReceipt ? 7 : 8).text(
      "Thank you for your business.",
      margin,
      y,
      { width: contentWidth, align: "center" }
    );

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Public verification lookup — no auth, intentionally: this is what the QR
// code on a printed/emailed document resolves to, so anyone holding a
// document can confirm it's genuine.
app.get("/api/verify/:number", (req, res) => {
  try {
    const row = db.prepare("SELECT * FROM documents WHERE number = ?").get(req.params.number);
    if (!row) return res.status(404).json({ error: "No document found with that number" });
    res.json({ document: serializeDocument(row) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
