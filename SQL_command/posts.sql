CREATE TABLE IF NOT EXISTS posts (
    post_id     BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    is_solved   BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    title       TEXT NOT NULL,
    post_image  TEXT 
);