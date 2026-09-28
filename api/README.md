# R-SEARS API documentation

## Base URL
- Local: `http://localhost:5000/api/v1`
- Production: configured via Vercel deployment URL

## Authentication
- Use JWT bearer token in the `Authorization` header:
```http
Authorization: Bearer <token>
```

## Core endpoints
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `GET /drivers/me`
- `POST /drivers/sos`
- `GET /drivers/history`
- `POST /incidents`
- `PATCH /incidents/:id/resolve`
- `PATCH /police/incidents/:id/accept`
- `GET /hospital/ambulances`
- `POST /hospital/dispatch`
- `GET /admin/dashboard`
- `GET /admin/audit-logs`

## Response format
```json
{
  "status": "success",
  "data": { },
  "message": "Operation successful"
}
```
