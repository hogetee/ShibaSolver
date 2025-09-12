CREATE TABLE IF NOT EXISTS users (
    user_id             BIGSERIAL PRIMARY KEY,
    google_account      TEXT UNIQUE NOT NULL,    -- Google sub (ถาวร)
    email               TEXT UNIQUE NOT NULL,    -- เก็บ email ล่าสุดจาก Google
    is_premium          BOOLEAN NOT NULL DEFAULT FALSE,
    user_state          user_state NOT NULL DEFAULT 'normal',
    user_name           TEXT UNIQUE,             -- unique username (ตั้งเองภายหลัง)
    display_name        TEXT,
    education_level     TEXT,
    "like"              NUMERIC(10,4) DEFAULT 0,
    "dislike"           NUMERIC(10,4) DEFAULT 0,
    bio                 TEXT,
    interested_subjects TEXT[],
    profile_picture     TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);