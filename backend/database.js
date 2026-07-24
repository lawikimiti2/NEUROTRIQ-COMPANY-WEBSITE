import Database from "better-sqlite3";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database will be created in the backend folder
const db = new Database(join(__dirname, "database.sqlite"));

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

export default db;