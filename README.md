# R-SEARS

Rwanda Smart Emergency Accident Response System (R-SEARS) is a government-ready emergency response platform for the Rwanda ecosystem. It provides real-time accident detection, dispatch coordination, police and hospital response workflows, and secure administrative oversight for national public safety operations.

## Stack
- Frontend: HTML5, CSS3, JavaScript ES6, Bootstrap 5, Tailwind-friendly structure
- Mobile app: Flutter
- Backend API: Node.js + Express
- Database: Neon PostgreSQL
- Auth: JWT
- Maps: Google Maps API
- Hosting: Vercel
- Notifications: Email + WhatsApp-ready modules, SMS abstraction
- Charts: Chart.js
- Icons: Font Awesome

## System goals
- Detect accident events via mobile sensor heuristics and GPS
- Notify dispatch centers, police, and hospitals immediately
- Optimize nearest-response routing and ETA
- Track incidents fully with audit logging and evidence uploads
- Support Rwanda integration partners and secure public-sector architecture

## Repository structure
- `client/` – web portal frontend
- `server/` – Express REST API
- `mobile_flutter/` – Flutter app for drivers and ambulances
- `database/` – PostgreSQL schema and seed scripts
- `docs/` – documentation and architecture
- `api/` – API specs and integrations
- `public/` – static/public assets
- `.env.example` – environment template
- `vercel.json` – deployment config

## Quick start

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Configure environment

Copy the example file and edit values:

```bash
cp ../.env.example .env
```

### 3. Initialize database

Apply the PostgreSQL schema in Neon:

```bash
psql "$DATABASE_URL" -f database/schema.sql
psql "$DATABASE_URL" -f database/seed.sql
```

### 4. Run the API

```bash
cd server
npm run dev
```

### 5. Deploy frontend

Use Vercel to deploy the `client/` folder and server from the root. See `vercel.json`.

## API base URL
- Local: `http://localhost:5000/api`
- Production: configured via environment variable `API_BASE_URL`

## Security
- JWT-based auth
- bcrypt password hashing
- Helmet security headers
- rate limiting
- validation middleware
- sanitized inputs
- audit logs on emergency actions

## Contact
System owner: IMANISHIMWE David
Email: davidimanishimwe29@gmail.com
WhatsApp: +250 789 600 279

## License
MIT
