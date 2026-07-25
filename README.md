# NeuroTriQ Company Website

Modern company website for NeuroTriQ with a React + Vite + TypeScript frontend and a lightweight Node.js + Express backend powered by SQLite. The backend stores contact form submissions and can notify via email (SMTP).

## Tech stack

- Frontend: Vite, React 18, TypeScript, Tailwind CSS, shadcn/ui, Radix UI
- Backend: Node.js, Express, node:sqlite (built-in, Node 22.5+), Nodemailer, CORS, dotenv

## Repository layout

```
neurotriq-innovate-build-main/
├─ src/                 # React app source
├─ public/              # Static assets
├─ backend/             # Express + SQLite API for contact form
├─ scripts/             # Utility scripts for serving dist
├─ package.json         # Frontend scripts and deps
└─ backend/package.json # Backend scripts and deps
```

## Prerequisites

- Node.js 18+ and npm

## Setup (Windows PowerShell)

1) Install frontend dependencies

```powershell
cd neurotriq-innovate-build-main
npm install
```

2) Install backend dependencies

```powershell
cd backend
npm install
```

3) Environment configuration

- Frontend (root): create `.env`

```env
VITE_API_URL=http://localhost:5000
```

- Backend (`backend/.env`):

```env
PORT=5000
CLIENT_URL=http://localhost:5173

# SMTP (optional, for email notifications)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_user
EMAIL_PASS=your_password
EMAIL_FROM="NeuroTriQ <no-reply@neurotriq.co.ke>"
CONTACT_EMAIL=info@neurotriq.co.ke
```

Note: `.env` files and the local SQLite DB are git-ignored.

4) Run the backend API

```powershell
cd backend
npm run dev
```

5) Run the frontend

```powershell
# from the project root
npm run dev
```

The app will open on http://localhost:5173 (Vite). The API listens on http://localhost:5000 by default.

## Build and preview (frontend)

```powershell
npm run build
npm run preview
```

## API overview

- POST `/api/contact` – stores a contact submission and optionally sends an email (when SMTP is configured)
- GET `/api/admin/contacts` – lists stored contacts (basic admin listing)
- GET `/api/health` – health check

Database: `backend/database.sqlite` (auto-created on first run via Node's built-in `node:sqlite`).

## Deployment notes

- Frontend: deploy the `dist` folder (e.g., Vercel, Netlify, static hosting)
- Backend: deploy as a Node app (e.g., Render, Railway, VPS). Set environment variables from `backend/.env` in your host.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.

## License

Proprietary – All rights reserved by NeuroTriQ.
