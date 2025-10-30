## AI agent quickstart for this repo

Purpose: help an AI contributor be productive immediately by knowing the architecture, workflows, and non-obvious conventions in this codebase.

### Architecture and data flow
- Frontend: Vite + React + TypeScript + Tailwind + shadcn-ui in `src/` with React Router v6. Query client is prewired in `src/App.tsx`. Alias `@` -> `./src` (see `tsconfig.json`, `vite.config.ts`).
- Backend: Node + Express served from `backend/server.js`. Uses SQLite via `better-sqlite3` (`backend/database.js` auto-creates tables). No ORM.
- Primary flow: `src/pages/Contact.tsx` POSTs to `${VITE_API_URL}/api/contact` → `backend/server.js` validates, inserts into `contacts` table, optionally sends email via Nodemailer, then returns the created record.
- Admin data: server exposes `GET /api/admin/contacts` returning all contacts (no auth). Legacy Mongo/Mongoose-based routes exist in `backend/routes/*` and `backend/models/*` but are not mounted by `server.js`.

### Dev, build, and serve
- Frontend
  - Dev: `npm run dev` (Vite on 0.0.0.0:5173). Configure `VITE_API_URL` in a frontend `.env` (example: `http://localhost:5000`).
  - Build: `npm run build` → static files in `dist/`. Preview: `npm run preview` or `node scripts/serve-dist-local.js`.
- Backend
  - Install: `cd backend && npm i`. Run: `npm run dev` (nodemon) or `npm start`.
  - Env: copy `backend/.env.example` → `.env`. Note: `MONGO_URI` is unused by current SQLite implementation; `CLIENT_URL` controls CORS; email vars enable SMTP. `PORT` defaults to 5000.
  - Health check: `GET /api/health` → `{ ok: true }`.

### Conventions and patterns
- Routing: pages live in `src/pages/*` and are attached in `src/App.tsx`. Add new routes there; keep catch-all `*` last.
- UI system: shadcn components under `src/components/ui/*`. Prefer composing from these; keep styling via Tailwind. Reuse existing patterns in `Contact.tsx` and `Admin*` pages.
- Data fetching: react-query is available; new API reads/writes should ideally use it instead of ad-hoc `fetch` where feasible.
- API shape: contacts table fields are defined in `backend/database.js`. When adding fields, update: DB schema, `server.js` insert/select, and the frontend form/state in `Contact.tsx`.
- Error handling: backend returns `{ error: string }` with proper HTTP codes; frontend shows toasts via `use-toast`.

### Important integration notes (gotchas)
- Admin feature mismatch:
  - Frontend expects `POST /api/admin/login` (JWT) and `GET /api/admin/messages` with `Authorization: Bearer <token>` (see `src/pages/AdminLogin.tsx`, `AdminDashboard.tsx`).
  - Backend currently exposes `GET /api/admin/contacts` with no auth and does not mount `backend/routes/admin.js`.
  - To enable auth-backed admin, either: (A) mount the admin router in `server.js` and ensure `JWT_SECRET`, `ADMIN_*` are set; or (B) update the frontend to call `/api/admin/contacts` and remove token usage. Pick one and keep both sides consistent.
- CORS: `server.js` uses `cors({ origin: process.env.CLIENT_URL || true })`. Set `CLIENT_URL` in backend `.env` during local dev to match Vite origin (e.g., `http://localhost:5173`).
- Email: if SMTP env vars aren’t set, mail is skipped and the email content is logged for preview. This is expected in dev.
- Paths: use `@/` alias for imports; avoid relative import chains.

### Common tasks with file pointers
- Add a new API endpoint: implement in `backend/server.js` (or factor to a router and mount it), update types and frontend hooks/components accordingly. Keep SQL prepared statements with `db.prepare(...).run/get/all`.
- Create a new page/route: add a file under `src/pages/`, export a React component, and register in `src/App.tsx` `Routes`.
- Use images/assets: place under `src/assets/`; import via ES modules or reference with Vite’s asset handling. Mind existing folder names with spaces.

### Quick references
- Backend endpoints (current): `POST /api/contact`, `GET /api/admin/contacts`, `GET /api/health`.
- Key files: `backend/server.js`, `backend/database.js`, `src/pages/Contact.tsx`, `src/pages/AdminLogin.tsx`, `src/pages/AdminDashboard.tsx`, `vite.config.ts`, `tsconfig.json`.

If anything above looks off or you need the admin flow wired one way or the other, ask which approach to standardize and I’ll align both frontend and backend in a follow-up.
