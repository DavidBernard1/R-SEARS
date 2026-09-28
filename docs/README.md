# R-SEARS

This repository contains the complete monorepo for the Rwanda Smart Emergency Accident Response System.

## Included modules
- `client/` web dashboard and command center prototypes
- `server/` Express REST API with JWT auth, RBAC, incident workflows
- `mobile_flutter/` emergency driver app starter
- `database/` PostgreSQL schema and seed scripts
- `docs/` system architecture, deployment, and security materials
- `api/` API specification and contract docs
- `public/` static public resources

## Deployment
- GitHub for repository management
- Vercel for web and API deployment
- Neon PostgreSQL for cloud database

## Security and deployment notes
- Store secrets only in `.env` or platform environment variables
- Never hardcode API tokens or database credentials
- Use HTTPS and secure headers in production deployment
