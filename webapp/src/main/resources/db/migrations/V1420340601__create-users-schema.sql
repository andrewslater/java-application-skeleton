CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  email VARCHAR NOT NULL,
  email_pending_confirmation VARCHAR,
  full_name VARCHAR(100) NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  password VARCHAR(60) NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  confirmation_token VARCHAR(60)
);

CREATE UNIQUE INDEX users_email_idx ON users(LOWER(email));

-- CREATE UNIQUE INDEX roles_role_name_idx ON roles(LOWER(role_name));

CREATE TABLE user_roles(
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR NOT NULL,
  PRIMARY KEY (user_id, role)
);

CREATE UNIQUE INDEX user_roles_unique_idx ON user_roles(user_id, LOWER(role));

-- TODO: Develop a seeds.sql process for seeding a development environment with representative data.
INSERT INTO users VALUES (NEXTVAL('users_id_seq'), 'user@example.com', null, 'Example User', true, '$2a$10$S30wfsLaAUrPLjEKZ981Vuy6xAK/TpL6pOFgi8VlDhBtoz.r0gBGe', null, now(), null);
INSERT INTO users VALUES (NEXTVAL('users_id_seq'), 'admin@example.com', null, 'Example Admin', true, '$2a$10$S30wfsLaAUrPLjEKZ981Vuy6xAK/TpL6pOFgi8VlDhBtoz.r0gBGe', null, now(), null);

INSERT INTO user_roles VALUES((SELECT id FROM users WHERE email = 'user@example.com'), 'USER');
INSERT INTO user_roles VALUES((SELECT id FROM users WHERE email = 'admin@example.com'), 'ADMIN');
INSERT INTO user_roles VALUES((SELECT id FROM users WHERE email = 'admin@example.com'), 'USER');
