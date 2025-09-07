CREATE TABLE IF NOT EXISTS users (
    user_id            BIGSERIAL PRIMARY KEY,
    google_account     TEXT UNIQUE,            -- e.g., Google sub/ID or email
    is_premium         BOOLEAN NOT NULL DEFAULT FALSE,
    state              TEXT,
    user_name          TEXT UNIQUE,            -- login/handle
    display_name       TEXT,
    education_level    TEXT,
    like_dislike_ratio NUMERIC(10,4),
    bio                TEXT
);