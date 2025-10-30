import express from "express";
import jwt from "jsonwebtoken";
import Contact from "../models/Contact.js";
import contactRoutes from "./contact.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing credentials" });

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASS) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET || "secret", { expiresIn: '8h' });
  return res.json({ token });
});

const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Unauthorized" });
  const parts = auth.split(" ");
  if (parts.length !== 2) return res.status(401).json({ error: "Unauthorized" });

  const token = parts[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET || "secret");
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

router.get("/messages", authMiddleware, async (req, res) => {
  try {
    // If MongoDB is connected, return DB messages. Otherwise return in-memory messages
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const msgs = await Contact.find().sort({ createdAt: -1 }).lean();
      return res.json({ messages: msgs });
    }

    const mem = contactRoutes && contactRoutes.inMemoryContacts ? contactRoutes.inMemoryContacts.slice().reverse() : [];
    return res.json({ messages: mem });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
