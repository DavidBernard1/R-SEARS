# Testing Plan

## Automated tests
- API authentication tests
- Incident creation and resolution tests
- Police and hospital dispatch route validation
- Audit log verification

## Manual tests
- Driver SOS flow on mobile app
- Police dashboard incident acceptance
- Hospital ambulance dispatch
- Admin user management and audit review
- Map rendering and emergency marker updates

## Production validation checklist
- Verify HTTPS and secure headers
- Confirm JWT refresh flow works
- Validate rate limiting
- Check emergency alert email and WhatsApp adapters
- Confirm database backups and Neon connectivity
- Run smoke tests for dashboard load and incident flow
