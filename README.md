# ServiceDesk Tracker — IT Ticketing & Support Dashboard

A clean, recruiter-ready **ticketing-style web app** to log and track IT support requests using structured records (**status, priority, category, timestamps**) with **filters, reporting charts, SLA tracking, role-based access (admin vs user), and CSV export**.

## Tech Stack
- Next.js (App Router) + React + TypeScript
- Prisma + SQL (SQLite by default)
- Tailwind CSS (aesthetic UI)
- Chart.js (Open vs Resolved, Category volume, Priority mix)
- JWT auth (secure cookie session) + bcrypt password hashing

## Features
- Create and track tickets with structured fields (status, priority, category, timestamps)  
- Filters + search (status/priority/category + keyword search)  
- Reporting dashboard with charts (Chart.js)  
- **SLA tracking** (auto-due times based on priority; breach indicator)  
- **Admin vs User authentication**  
- User: create/view tickets  
- Admin: status updates + CSV export  
- Export all tickets to CSV (admin only)

---

## Quick Start (Local)

### 1) Install
```bash
npm install
```

### 2) Configure env
Copy `.env.example` → `.env` and set:
- `DATABASE_URL` (default is SQLite file)
- `AUTH_SECRET` (any long random string)

```bash
cp .env.example .env
```

### 3) Create DB + seed demo users
```bash
npx prisma migrate dev
npm run db:seed
```

Seed creates:
- Admin: `admin@demo.com` / `Admin123!`
- User : `user@demo.com` / `User123!`

### 4) Run
```bash
npm run dev
```
Open: http://localhost:3000

---

## Deploy to Vercel (Recommended)

1) Push to GitHub  
2) In Vercel: **New Project → Import repo**  
3) Add Environment Variables:
- `DATABASE_URL`
  - For production, use a hosted Postgres (Neon, Supabase, Railway).  
  - If you keep SQLite, note it’s not ideal for serverless scaling.
- `AUTH_SECRET`

4) Set Build Command (default works):
- `npm run build`

5) After deploy, run Prisma migrations on your hosted DB:
- Use Vercel CLI or run migrations locally pointing to the hosted DB URL.

---

## Notes for Recruiters (What this demonstrates)
- IT ticket lifecycle modeling (status/priority/category)
- Strong record-keeping mindset (structured fields + audit timestamps)
- Operational visibility (filters, charts, SLA)
- Secure auth + role-based capabilities
- API design (create/list/update/export)

---

## Screenshots
Add screenshots here after you run locally (optional):
- Dashboard overview
- Charts view
- Ticket table with filters
- Admin status updates + export

---

## License
MIT
