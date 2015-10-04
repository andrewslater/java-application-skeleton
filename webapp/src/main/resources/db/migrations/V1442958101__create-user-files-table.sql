CREATE TABLE volumes (
  id SERIAL PRIMARY KEY,
  volume_type VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  path VARCHAR NOT NULL,
  status VARCHAR NOT NULL
);

CREATE UNIQUE INDEX volume_unique_idx ON volumes(volume_type, name, path);

CREATE TABLE user_files (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  volume_id INTEGER NOT NULL REFERENCES volumes(id) ON DELETE CASCADE,
  path VARCHAR NOT NULL,
  mimetype VARCHAR,
  size_in_bytes BIGINT NOT NULL,
  status VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

INSERT INTO volumes VALUES (NEXTVAL('volumes_id_seq'), 'LOCAL_FILESYSTEM', 'User Files', '/opt/java-app-skeleton/user-files', 'AVAILABLE');

ALTER TABLE system_settings ADD COLUMN active_volume_id INTEGER REFERENCES volumes(id);
UPDATE system_settings SET active_volume_id = (SELECT id FROM volumes WHERE name = 'User Files');
