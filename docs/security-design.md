# Security Design

## Authentication and access control
- JWT issued on login with short expiry windows
- Refresh tokens for session continuity
- Role-based route authorization across police, hospital, admin, and driver flows
- User inactivity and permission checks enforced server-side

## Data privacy
- Sensitive fields stored as encrypted or hash-protected values where appropriate
- Audit logs capture who acted, when, and what was changed
- Sensitive external service credentials stored only in environment variables

## Network security
- Helmet security headers applied globally
- CORS restricted to trusted origins
- Rate limiting on public API routes
- Input validation and sanitized payload handling
- HTTPS enforced in production

## Emergency operation security
- Every emergency action is logged to `audit_logs`
- Authentication required before incident manipulation
- Incident records are not editable without appropriate role access

## Default security posture
- No secret hardcoding
- `.env` and Vercel environment variables only
- Use separate secrets for app and refresh tokens
