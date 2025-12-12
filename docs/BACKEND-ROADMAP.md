# Backend Roadmap — Attendance Pro

This document is a long-term plan covering three parallel starting options and a complete module-by-module roadmap to make the Attendance Pro frontend fully functional with a robust backend.

Location: `docs/BACKEND-ROADMAP.md` (project root)

---

## Goals
- Provide a reliable, secure backend for recording and querying attendance (students & lecturers only).
- Support bulk marking, CSV import/export, and downloadable reports (monthly / semester / batch summaries).
- Provide user and role management for controlled access.
- Offer backup/restore and file storage for media (photos & backups).
- Make it easy to roll out module-by-module and test each part independently.

---

## Three Options (long-term plans)

Below are three possible starting tracks. Each track includes milestones, deliverables, timeline estimates, and next actions.

### Option A — Scaffold the backend repo (recommended first step)

**In simple terms:** Create a new `backend/` folder with all the basic setup files needed to start building the server. Think of it like setting up your development office before you start working — you need a desk, chair, internet, and tools.

**What we'll create:**

1. **Folder structure** — A new `backend/` folder with:
   - `package.json` — List of libraries we need (like npm packages for Node.js)
   - `tsconfig.json` — Tells TypeScript how to work
   - `.env.example` — Example of secret codes (database password, API keys, etc.)
   - `src/` folder — Where we write the actual code

2. **A simple running server** — A basic Express server that:
   - Starts on `http://localhost:3000` (or similar)
   - Has a health-check endpoint (`GET /health` returns "OK")
   - Shows that the server works

3. **Docker setup** — Docker is like a package that contains everything:
   - `Dockerfile` — Recipe to build a container for our backend
   - `docker-compose.yml` — Starts the backend AND PostgreSQL database together with one command
   - PostgreSQL database runs in a container (no need to install it on your computer)
   - Adminer (a web tool to see the database)

4. **Code quality tools** — Automatic checks:
   - ESLint — Catches coding mistakes
   - Prettier — Auto-formats code to look nice
   - Environment variables — Keeps secrets safe (like database passwords)

**Timeline:** 2–3 days to set this up

**End result:** You'll have a working backend server that:
- Runs in Docker containers
- Has PostgreSQL database ready
- Can be started with one command: `docker compose up`
- Is ready for the next steps

**Why this first?**
- Everyone (you, me, other developers) gets the exact same setup
- No "works on my machine" problems
- Once this is done, adding features is much faster
- Tests and CI/CD can run in containers too

**Next action after this:**
- Once Option A is done, move to Option B (build the database schema)
- Then Option C (build the API endpoints)


### Option B — Generate Prisma schema + migrations
Why: Lock down the data model early; benefits from Prisma's developer DX and migrations.

Milestones
- M1: Design core schema for Students, Batches, Sections, Attendance, Users, Roles, Permissions, Holidays, Backups (2 days)
- M2: Implement Prisma schema and initial migration (1 day)
- M3: Seed script with sample students, lecturers, batches (1 day)
- M4: Add DB helpers and simple repository layer (1 day)

Deliverables
- `prisma/schema.prisma`, migration folder, `prisma/seed.ts`

Timeline: 3–5 days

Next actions
- I can draft a Prisma schema snippet for review; after approval, generate migration and seed.


### Option C — Implement Students API + wire frontend client (full feature for first module)
Why: Students are core to the app; implementing this makes frontend interactive and lets you verify data flow.

Milestones
- M1: DB model & migration for Student (1 day)
- M2: CRUD endpoints + validation (1–2 days)
- M3: File upload endpoint for photo (2 days)
- M4: Frontend API client (`src/api/students.ts`) and wire `StudentList`, `AddStudent`, `StudentProfile` (2 days)

Deliverables
- REST endpoints: `GET /students`, `GET /students/:id`, `POST /students`, `PUT /students/:id`, `DELETE /students/:id` and media upload
- Frontend hooks and example usage

Timeline: 5–8 days end-to-end (including frontend wiring)

Next actions
- I can implement the Students API end-to-end once the repo scaffold and DB are ready.

---

## Suggested Overall Roadmap (module-by-module)
Order and acceptance criteria for each module.

1. Scaffold backend repo (Option A) — acceptance: containers run, health-check OK
2. Prisma schema & migrations (Option B) — acceptance: migrations apply and seed data present
3. Implement Students API (Option C) — acceptance: frontend shows real students, Add student persists to DB
4. Implement Authentication & RBAC — acceptance: login works, endpoints protected
5. Attendance API (mark, bulk mark, query) — acceptance: marking from frontend stores attendance and summary reports return expected values
6. Reporting & Exports (CSV/Excel) — acceptance: exports can be generated and downloaded via backend
7. Backup & Restore service — acceptance: manual backup and restore tested on dev DB
8. File uploads & S3 support — acceptance: images upload to storage and served
9. Users & Roles UI wiring — acceptance: admin user can create/assign roles from frontend
10. Real-time (optional) — acceptance: live updates visible to clients
11. E2E tests, CI, monitoring, and deployment — acceptance: CI passing, deployment scripts working

Each module should have: schema, migration, backend service, unit tests, integration tests, and frontend wiring.

---

## Minimum Viable API (high level)

Students
- GET /api/students?search=&batch=&page=&limit=
- GET /api/students/:id
- POST /api/students (multipart/form-data for photo)
- PUT /api/students/:id
- DELETE /api/students/:id

Batches
- GET /api/batches
- POST /api/batches
- PUT /api/batches/:id

Attendance
- POST /api/attendance/mark  (body: { date, batchId?, studentId?, status, markedBy })
- POST /api/attendance/bulk  (array of marks)
- GET /api/attendance?studentId=&batchId=&from=&to=
- POST /api/attendance/import (CSV)

Reports
- GET /api/reports/monthly?batchId=&month=&year=
- GET /api/reports/semester?batchId=&semester=
- GET /api/reports/summary?from=&to=
- GET /api/reports/export?type=csv|xlsx&... -> returns downloadable file

Users & Auth
- POST /api/auth/login
- POST /api/auth/refresh
- GET /api/users
- POST /api/users
- GET /api/roles

Backups
- POST /api/backups/create
- GET /api/backups
- POST /api/backups/restore (upload backup file)

Media
- POST /api/media/upload
- GET /media/:path  (serve media securely)

---

## Suggested Database Schema (Prisma-like snippet)
Below is a small excerpt — this will be refined in design stage.

```prisma
model Student {
  id        String   @id @default(uuid())
  code      String   @unique
  firstName String
  lastName  String?
  email     String?  @unique
  phone     String?
  batchId   String?
  section   String?
  photoUrl  String?
  status    String   @default("active")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  attendances Attendance[]
}

model Batch {
  id        String   @id @default(uuid())
  name      String
  year      Int
  sections  String[]
  students  Student[]
}

model Attendance {
  id         String   @id @default(uuid())
  studentId  String
  date       DateTime
  status     String   // P/A/L/H
  markedById String?
  createdAt  DateTime @default(now())
  student    Student  @relation(fields: [studentId], references: [id])
}

model User {
  id        String @id @default(uuid())
  email     String @unique
  password  String
  role      Role
  createdAt DateTime @default(now())
}

enum Role {
  ADMIN
  TEACHER
  STAFF
}
```

---

## Backups & Exports
- Use `pg_dump` for PostgreSQL backups and store backups on S3 or local `backups/` during early development.
- Export reports via CSV/XLSX libraries (e.g., `csv-writer`, `exceljs`) and stream files to clients.

---

## Development, Testing & Deployment notes
- Use `docker-compose` for local dev (Postgres + Adminer + backend). Example commands:

```bash
# start dev stack
docker compose up -d
# apply prisma migrations (when using Prisma)
npx prisma migrate deploy
# seed data
node prisma/seed.js
```

- CI: run lint, tests, build in each PR.
- Monitoring: expose metrics (Prometheus) and use log aggregation (e.g., Loki/CloudWatch).

---

## Security & Privacy
- Hash passwords with `bcrypt`/`argon2`.
- Use HTTPS in production and set secure CORS policies.
- Limit backups retention and access to student data; plan a data retention policy.
- Run a security review before production release.

---

## Recommendations — which to start with now
1. Start with **Option A: scaffold the backend** so other work can proceed reliably. This gives environment and CI hooks.
2. Immediately follow with **Option B: Prisma schema** so data model is defined.
3. Then implement **Option C: Students API + frontend wiring** as the first feature.

I can scaffold Option A now for you (create `backend/` skeleton, Docker compose, and README). If you want, I can also output the initial `prisma/schema.prisma` draft and the first migration.

---

## Where I will add code / files
- `backend/` — server, tests, Dockerfile
- `backend/prisma/` — Prisma schema and migrations
- `backend/src/routes/` — routes for `students`, `attendance`, `auth`, `reports`
- `AttendancePro/src/api/` — frontend API clients & hooks

---

If you want to start immediately, tell me which option to begin with (A, B or C). I can scaffold the backend in the next step and commit the changes to this workspace.
