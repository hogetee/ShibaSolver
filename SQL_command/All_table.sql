-- === Types ===
DO $$ BEGIN
    CREATE TYPE user_state AS ENUM ('ban','suspend','normal','deleted');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- DO $$ BEGIN
--     CREATE TYPE rating_target_type AS ENUM ('post','comment');
-- EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE rating_type AS ENUM ('like','dislike');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE report_target_type AS ENUM ('post','user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('pending','accepted','rejected'); -- รอ, รับเรื่อง, ปฏิเสธ 
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('comment','mention');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE admin_action_type AS ENUM ('delete_post','ban_user','unban_user','suspend_user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE cookie_choice AS ENUM ('accept','reject');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

------------------------------------------------------------------------------------------------------
-- === Tables ===

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

CREATE TABLE IF NOT EXISTS tags (
    tag_id   BIGSERIAL PRIMARY KEY,
    tag_name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS reports (
    report_id   BIGSERIAL PRIMARY KEY,
    reporter_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    admin_id    BIGINT REFERENCES admins(admin_id) ON DELETE SET NULL,
    target_type report_target_type NOT NULL,
    target_id   BIGINT NOT NULL,
    reason      TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    status      report_status NOT NULL DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS ratings (
    rating_id   BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    post_id     BIGINT REFERENCES posts(post_id) ON DELETE CASCADE,
    comment_id  BIGINT REFERENCES comments(comment_id) ON DELETE CASCADE,
    rating_type rating_type NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (
        (post_id IS NOT NULL AND comment_id IS NULL) OR
        (post_id IS NULL AND comment_id IS NOT NULL)
    )
);

CREATE TABLE IF NOT EXISTS posts (
    post_id     BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    is_solved   BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    title       TEXT NOT NULL,
    post_image  TEXT NOT NULL -- ยังไม่สรุป
);

CREATE TABLE IF NOT EXISTS post_tags (
    post_id BIGINT NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    tag_id  BIGINT NOT NULL REFERENCES tags(tag_id)  ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE IF NOT EXISTS notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    sender_id       BIGINT REFERENCES users(user_id) ON DELETE SET NULL,  -- actor
    receiver_id     BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    timestamp       TIMESTAMPTZ NOT NULL DEFAULT now(),
    notification_type notification_type NOT NULL
);

CREATE TABLE IF NOT EXISTS cookie_consents (
    cookie_id  BIGSERIAL PRIMARY KEY,
    user_id    BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
    anon_key   UUID NOT NULL DEFAULT gen_random_uuid(),
    choice     cookie_choice NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments (
    comment_id     BIGSERIAL PRIMARY KEY,
    user_id        BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    post_id        BIGINT NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    parent_comment BIGINT REFERENCES comments(comment_id) ON DELETE SET NULL,
    text           TEXT NOT NULL,
    -- comment_image  TEXT, ไม่ชัวร์
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookmarks (
    user_id    BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    post_id    BIGINT NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS admins (
    admin_id BIGSERIAL PRIMARY KEY,
    name     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_actions (
    action_id   BIGSERIAL PRIMARY KEY,
    admin_id    BIGINT NOT NULL REFERENCES admins(admin_id) ON DELETE CASCADE,
    action_type admin_action_type NOT NULL,
    target_type report_target_type NOT NULL,
    target_id   BIGINT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);