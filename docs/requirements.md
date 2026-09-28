# R-SEARS

This project is a government-ready emergency accident response system for Rwanda, designed for emergency dispatch coordination between drivers, police, hospitals, ambulances, and administrators.

## Objectives
- Detect emergency accidents in real time
- Notify nearest police and hospitals quickly
- Provide GPS-based incident mapping and dispatch
- Combine mobile, web, and admin workflows into one system
- Deliver secure and auditable public-sector coordination

## System overview
The R-SEARS platform consists of:
- Driver-facing Flutter mobile app
- Web dashboards for command center, police, hospital, and admin users
- Node.js + Express REST API
- Neon PostgreSQL relational data store
- Secure role-based JWT authentication and audit logging
- Government and operator integration adapters for connected services

## Functional requirements
- Driver registration and profile management
- Accident detection and SOS triggers
- Incident tracking and live emergency map updates
- Police dispatch and assignment
- Hospital intake and ambulance routing
- National emergency operations dashboard
- Administrative analytics and audit logs
- Multi-language support and dark mode ready

## Non-functional requirements
- Role-based access control
- Data privacy by design
- HTTPS-only production deployment
- Secure environment variable handling
- Rate limiting and validation
- Responsive, scalable web and mobile experience

## Key features
- QR emergency identification
- Blood group and medical metadata
- Offline-first queue for emergency data synchronization
- Email, SMS, and WhatsApp-ready messaging modules
- Printable PDF and CSV reporting
- JS dashboards using Chart.js

## Use cases
- A driver experiences an accident and triggers SOS
- Police receive the alert and accept the incident
- Dispatch center identifies nearest ambulance and hospital
- Hospital updates patient status and bed availability
- Admin reviews audits and system performance
