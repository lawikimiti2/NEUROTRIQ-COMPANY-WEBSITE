import express from "express";
import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";
import mongoose from "mongoose";

const router = express.Router();

// In-memory fallback store when Mongo is not configured/connected
const inMemoryContacts = [];

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    if (!data.firstName || !data.lastName || !data.email || !data.message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let contact = null;

    // If mongoose is connected, save to DB; otherwise push to in-memory store
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      contact = await Contact.create(data);
    } else {
      contact = { ...data, _id: `mem_${Date.now()}`, createdAt: new Date().toISOString() };
      inMemoryContacts.push(contact);
      console.warn("MongoDB not connected — saved contact to in-memory store");
    }

    // Send email notification (if SMTP configured) — mail only, no SMS
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
        // If SMTP not configured, log the email content for dev testing
        console.log("Email not sent — SMTP not configured. Email preview:", { to, subject, html });
      }
    } catch (mailErr) {
      console.error("Email send error:", mailErr);
    }

    return res.status(201).json({ success: true, contact });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Export the in-memory store for admin route to read when DB is unavailable
router.inMemoryContacts = inMemoryContacts;

export default router;
