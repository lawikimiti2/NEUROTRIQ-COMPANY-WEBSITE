import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import db from "./database.js";
import nodemailer from "nodemailer";

dotenv.config();

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
    const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(result.lastInsertRowId);

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

// Admin routes - Get all contacts (protected)
app.get("/api/admin/contacts", adminAuth, (req, res) => {
  try {
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY createdAt DESC').all();
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
