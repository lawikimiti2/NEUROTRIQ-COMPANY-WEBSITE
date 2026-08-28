import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database will be created in the backend folder
const db = new DatabaseSync(join(__dirname, "database.sqlite"));

// Create contacts table for storing contact form submissions
db.prepare(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    serviceType TEXT,
    projectBudget TEXT,
    timeline TEXT,
    message TEXT,
    newsletter BOOLEAN DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Migration: add isRead column for existing databases created before this field existed
const contactColumns = db.prepare("PRAGMA table_info(contacts)").all();
if (!contactColumns.some((c) => c.name === "isRead")) {
  db.prepare("ALTER TABLE contacts ADD COLUMN isRead INTEGER DEFAULT 0").run();
}

// Create admin users table for the admin dashboard
db.prepare(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Quotes, invoices, and receipts share the same shape (client info, line
// items, totals) so they live in one table distinguished by `type`, rather
// than three near-identical tables.
db.prepare(`
  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('quote','invoice','receipt')),
    number TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'open',
    clientName TEXT NOT NULL,
    clientEmail TEXT,
    clientPhone TEXT,
    clientAddress TEXT,
    issueDate TEXT NOT NULL,
    dueDate TEXT,
    validUntil TEXT,
    paymentMethod TEXT,
    relatedInvoiceNumber TEXT,
    lineItems TEXT NOT NULL,
    subtotal REAL NOT NULL,
    taxRate REAL NOT NULL DEFAULT 0,
    taxAmount REAL NOT NULL DEFAULT 0,
    total REAL NOT NULL,
    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Migration: the initial status value was renamed from "draft" to "open"
db.prepare("UPDATE documents SET status = 'open' WHERE status = 'draft'").run();

export default db;