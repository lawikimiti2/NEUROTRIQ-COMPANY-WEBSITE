# NeuroTriq - Full Stack Rebuild

This repository contains the frontend (Vite + React + Tailwind) and a simple backend (Node.js + Express + MongoDB) for handling contact form submissions and an admin dashboard.

## Setup (Windows PowerShell)

1. Install dependencies for frontend

```powershell
# from project root (frontend is the current folder)
cd neurotriq-innovate-build-main
npm install
```

2. Install dependencies for backend

```powershell
cd backend
npm install
```

3. Create environment files

- Backend: copy `backend/.env.example` to `backend/.env` and fill values.
- Frontend: create `.env` in the frontend root with `VITE_API_URL` (example below).

Example frontend `.env` (frontend root):

```env
VITE_API_URL=http://localhost:5000
```

4. Run backend

```powershell
cd backend
npm run dev
```

5. Run frontend

```powershell
# from frontend root
npm run dev
```

6. Deploy

- Frontend: can be deployed to Vercel (build command: `npm run build`, output: `dist`).
- Backend: can be deployed to Render or any Node host. Set environment variables from `backend/.env.example` in your host.
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/37f9e3f0-aef0-4a02-b98e-185b92576380

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/37f9e3f0-aef0-4a02-b98e-185b92576380) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/37f9e3f0-aef0-4a02-b98e-185b92576380) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
