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
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, ".env") });

const LOGO_PATH = join(__dirname, "assets", "neurotriq_logo.png");
const COMPANY = {
  name: "NeuroTriQ Company Limited",
  address: "Kins Arcade, Ground Floor, Ongata Rongai | P.O. Box 4983-00100 Nairobi, Kenya",
  contact: "Phone: 0795344905 | Email: info@neurotriq.co.ke",
};

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

// Helmet adds common security headers
app.use(helmet());

// CORS: restrict to configured client URL if available
const allowedOrigin = process.env.CLIENT_URL || true;
app.use(cors({ origin: allowedOrigin, credentials: true }));

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
    doc.image(LOGO_PATH, 40, 25, { width: 45 });
    doc.font("Helvetica-Bold").fontSize(15).text(COMPANY.name, 95, 28);
    doc.font("Helvetica").fontSize(8).text(COMPANY.address, 95, 46);
    doc.text(COMPANY.contact, 95, 57);
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

// Health check endpoint
app.get("/api/health", (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
