ALTER TABLE users ADD COLUMN micro_avatar_file_id BIGINT REFERENCES user_files(id);
