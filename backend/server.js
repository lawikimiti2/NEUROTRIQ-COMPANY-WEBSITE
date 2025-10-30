import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./database.js";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || true }));

// Contact form submission endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const data = req.body;
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

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
      const html = `
        <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
        <p><strong>Company:</strong> ${data.company || 'N/A'}</p>
        <p><strong>Service:</strong> ${data.serviceType || 'N/A'}</p>
        <p><strong>Budget:</strong> ${data.projectBudget || 'N/A'}</p>
        <p><strong>Timeline:</strong> ${data.timeline || 'N/A'}</p>
        <p><strong>Newsletter:</strong> ${data.newsletter ? 'Yes' : 'No'}</p>
        <hr />
        <p>${data.message}</p>
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

// Admin routes - Get all contacts
app.get("/api/admin/contacts", (req, res) => {
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
