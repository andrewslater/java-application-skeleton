CREATE TABLE system_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  allow_registration BOOLEAN DEFAULT FALSE,
  require_email_confirmation BOOLEAN DEFAULT TRUE,
  restrict_registration_domains BOOLEAN DEFAULT FALSE
);

CREATE TABLE system_settings_allowed_domains (
  settings_id INTEGER NOT NULL REFERENCES system_settings(id),
  domain VARCHAR PRIMARY KEY
);

CREATE INDEX system_settings_domain_unique_idx ON system_settings_allowed_domains(LOWER(domain));

INSERT INTO system_settings VALUES (1, false, true, false);
INSERT INTO system_settings_allowed_domains VALUES (1, 'example.com');
INSERT INTO system_settings_allowed_domains VALUES (1, 'andrewslater.com');
