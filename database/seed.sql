INSERT INTO users (id, name, email, password_hash, phone, role, status) VALUES
  (gen_random_uuid(), 'System Administrator', 'admin@rsears.rw', '$2a$12$Q4P1mHFmJ7u5wKA9e5Sl9eQVm2nqM4vR4XjZetKKiRr6z8ZvChjeG', '+250788000001', 'super_admin', 'active'),
  (gen_random_uuid(), 'National Dispatcher', 'dispatcher@rsears.rw', '$2a$12$Q4P1mHFmJ7u5wKA9e5Sl9eQVm2nqM4vR4XjZetKKiRr6z8ZvChjeG', '+250788000002', 'national_dispatcher', 'active'),
  (gen_random_uuid(), 'Police Officer', 'police@rsears.rw', '$2a$12$Q4P1mHFmJ7u5wKA9e5Sl9eQVm2nqM4vR4XjZetKKiRr6z8ZvChjeG', '+250788000003', 'police_officer', 'active'),
  (gen_random_uuid(), 'Hospital Admin', 'hospital@rsears.rw', '$2a$12$Q4P1mHFmJ7u5wKA9e5Sl9eQVm2nqM4vR4XjZetKKiRr6z8ZvChjeG', '+250788000004', 'hospital_admin', 'active'),
  (gen_random_uuid(), 'Driver', 'driver@rsears.rw', '$2a$12$Q4P1mHFmJ7u5wKA9e5Sl9eQVm2nqM4vR4XjZetKKiRr6z8ZvChjeG', '+250788000005', 'driver', 'active');

INSERT INTO police_stations (name, district, latitude, longitude, geom) VALUES
  ('Kigali Central Police Station', 'Kigali', -1.9441, 30.0619, ST_SetSRID(ST_MakePoint(30.0619, -1.9441), 4326)),
  ('Kicukiro Police Station', 'Kicukiro', -1.9500, 30.1000, ST_SetSRID(ST_MakePoint(30.1000, -1.9500), 4326)),
  ('Gasabo Police Station', 'Gasabo', -1.9300, 30.0600, ST_SetSRID(ST_MakePoint(30.0600, -1.9300), 4326));

INSERT INTO hospitals (name, district, latitude, longitude, capacity, available_beds, geom) VALUES
  ('Kigali University Teaching Hospital', 'Kigali', -1.9434, 30.0607, 500, 120, ST_SetSRID(ST_MakePoint(30.0607, -1.9434), 4326)),
  ('King Faisal Hospital Rwanda', 'Kigali', -1.9372, 30.0632, 350, 90, ST_SetSRID(ST_MakePoint(30.0632, -1.9372), 4326)),
  ('Muhima District Hospital', 'Kigali', -1.9540, 30.0600, 220, 60, ST_SetSRID(ST_MakePoint(30.0600, -1.9540), 4326));

INSERT INTO ambulances (plate_number, type, status, current_latitude, current_longitude, driver_name) VALUES
  ('RAB 200A', 'basic', 'available', -1.9434, 30.0610, 'Jean Ntakirutimana'),
  ('RAB 201A', 'advanced', 'on_route', -1.9440, 30.0648, 'Alain Umutesi'),
  ('RAB 202A', 'basic', 'available', -1.9492, 30.0588, 'Claude Habimana');

INSERT INTO settings (key, value, description) VALUES
  ('default_response_window_minutes', '15', 'Default emergency acceptance window'),
  ('google_maps_enabled', 'true', 'Toggle Google Maps integration'),
  ('dark_mode_default', 'true', 'Default theme for dashboards');
