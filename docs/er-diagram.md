# ER Diagram Overview

The R-SEARS database is modeled around a central user and incident architecture:
- `users` -> `drivers`, `emergency_contacts`
- `drivers` -> `vehicles`
- `accidents` -> `dispatches`
- `ambulances` -> `dispatches`
- `hospitals` -> `dispatches`
- `police_stations` -> dispatch support
- `audit_logs` -> all administrative actions

This normalized design supports auditability, traceability, and disaster response coordination across institutions.
