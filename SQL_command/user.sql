CREATE TABLE IF NOT EXISTS users (
    user_id            BIGSERIAL PRIMARY KEY,
    google_account     TEXT UNIQUE,            -- e.g., Google sub/ID or email
    is_premium         BOOLEAN NOT NULL DEFAULT FALSE,
    user_state         user_state NOT NULL DEFAULT 'normal',
    user_name          TEXT UNIQUE,            -- unique username
    display_name       TEXT,                   -- non-unique display name
    education_level    TEXT,
    like               NUMERIC(10,4),
    dislike            NUMERIC(10,4),
    bio                TEXT,
    -- created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    interested_subjects TEXT[],                 -- array of subjects the user is interested in
    profile_picture    TEXT                   -- URL to profile picture
); 