# Architecture

## System architecture
R-SEARS uses a modular service-oriented structure that decouples user interfaces, API logic, and integration adapters.

### Layers
1. Presentation layer
   - Client web dashboard
   - Flutter emergency mobile app
2. API layer
   - Express REST endpoints
3. Service layer
   - Notification, analytics, government adapters, SMS, police, hospital, and SAMU services
4. Data layer
   - Neon PostgreSQL with normalized relational schema
5. Integration layer
   - Rwanda public-sector connectors with environment-based credential management

## Key design principles
- Role-based access control
- Audit-friendly operations
- Secure and encrypted communications over HTTPS
- GPS-first emergency response
- Offline-first emergency queue for mobile devices
- API versioning: /api/v1

## Data flow
1. Driver triggers SOS from mobile app
2. GPS coordinates and motion signals are captured
3. Server validates incident severity
4. Dispatch notification is sent to police, hospitals, and command center
5. Incident is tracked in PostgreSQL and audit logs
6. Response status updates are shared to dashboards and integration services
