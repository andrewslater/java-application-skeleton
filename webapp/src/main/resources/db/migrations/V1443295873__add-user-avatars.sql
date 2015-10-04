ALTER TABLE users ADD COLUMN small_avatar_file_id BIGINT REFERENCES user_files(id);
ALTER TABLE users ADD COLUMN medium_avatar_file_id BIGINT REFERENCES user_files(id);
ALTER TABLE users ADD COLUMN large_avatar_file_id BIGINT REFERENCES user_files(id);
