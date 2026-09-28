# Deployment Guide

## Vercel deployment
1. Push the repository to GitHub.
2. Import the repo into Vercel.
3. Set environment variables in Vercel:
   - DATABASE_URL
   - JWT_SECRET
   - JWT_REFRESH_SECRET
   - GOOGLE_MAPS_API_KEY
   - SMTP_HOST
   - SMTP_USER
   - SMTP_PASS
   - WHATSAPP_TOKEN
   - GOVERNMENT_API_BASE_URL
   - GOVERNMENT_API_TOKEN
4. Deploy the app.

## Neon PostgreSQL setup
1. Create a Neon project.
2. Copy the connection string.
3. Add it to `DATABASE_URL`.
4. Run:
```bash
psql "$DATABASE_URL" -f database/schema.sql
psql "$DATABASE_URL" -f database/seed.sql
```

## Production security checklist
- Force HTTPS
- Restrict CORS to your frontend domains
- Limit JWT expiration
- Use separate secrets for app and refresh tokens
- Protect admin routes with RBAC
- Enable audit log retention
- Update rate limit thresholds for production traffic
