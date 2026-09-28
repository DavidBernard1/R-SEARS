# Rwanda Smart Emergency Accident Response System (R-SEARS)

R-SEARS is an enterprise-ready emergency response platform for Rwanda, designed to detect road accidents, dispatch police and ambulances, route emergency vehicles, coordinate hospital actions, and maintain end-to-end records for public safety institutions.

## Mission
Save lives by automatically detecting road accidents and instantly notifying the nearest police and hospital with precise GPS information, while maintaining auditable records, secure access control, and scalable deployment on Vercel + Neon PostgreSQL.

## Stack
- Frontend: HTML5, CSS3, JavaScript ES6, Bootstrap 5, Tailwind-friendly structure
- Mobile: Flutter
- Backend: Node.js + Express
- Database: Neon PostgreSQL
- Auth: JWT
- Maps: Google Maps API
- Hosting: Vercel
- Notifications: Email + WhatsApp-ready modules + SMS abstraction
- Analytics: Chart.js
- Icons: Font Awesome

## Role-based modules
- Super Admin
- National Dispatcher
- Police Officer
- Hospital Admin
- Ambulance Driver
- Moto Rider / Driver
- Traffic Officer
- System Auditor

## Core capabilities
- Driver registration and onboarding
- Live GPS tracking and emergency SOS flow
- Automatic accident detection heuristic using impact, speed, and orientation cues
- Police dashboard with live incident overview
- Hospital dashboard with ambulance and patient status management
- National command center with live map and analytics
- Admin panel with user management and audit trails
- Secure APIs with rate limiting, validation, JWT auth, and audit logging
- Government integration adapters for Rwanda public institutions
- Mobile and web responsiveness for emergency operations

## Project structure
```text
r-sears/
├── client/
├── server/
├── mobile_flutter/
├── database/
├── docs/
├── api/
├── public/
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
├── vercel.json
└── package.json
```

## Quick start

### 1) Install dependencies
```bash
npm install
cd server && npm install
```

### 2) Configure environment
```bash
cp .env.example .env
```
Update the fields for Neon PostgreSQL, JWT secrets, Google Maps, SMTP, WhatsApp, and SMS config.

### 3) Initialize the database
```bash
psql "$DATABASE_URL" -f database/schema.sql
psql "$DATABASE_URL" -f database/seed.sql
```

### 4) Run backend
```bash
cd server
npm run dev
```

### 5) Run frontend
Open `client/index.html` directly or serve via a local static server.

### 6) Run mobile app
```bash
cd mobile_flutter
flutter pub get
flutter run
```

## Backend health check
```bash
curl http://localhost:5000/api/health
```

## Security requirements
- JWT-based access control
- bcrypt password hashing
- Helmet and secure headers
- Input validation and rate limiting
- CSRF strategy via SameSite cookie policy and API tokens
- Environment-variable secret handling
- Audit logs for sensitive operations
- HTTPS-only deployment guidance for production

## Deployment
This project is designed for:
- GitHub repository hosting
- Vercel deployment for web frontend and API
- Neon PostgreSQL cloud database

See `vercel.json` and `docs/deployment-guide.md`.

## Documentation
- `docs/system-overview.md`
- `docs/architecture.md`
- `docs/deployment-guide.md`
- `api/openapi.yaml`

## Contact
Owner: IMANISHIMWE David
Email: davidimanishimwe29@gmail.com
WhatsApp: +250 789 600 279

## License
MIT
