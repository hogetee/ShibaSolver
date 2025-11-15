CREATE TABLE IF NOT EXISTS comments (
    comment_id     BIGSERIAL PRIMARY KEY,
    user_id        BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    post_id        BIGINT NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    parent_comment BIGINT REFERENCES comments(comment_id) ON DELETE SET NULL,
    text           TEXT NOT NULL,
    comment_image  TEXT, 
    is_solution    BOOLEAN DEFAULT FALSE,
    is_updated     BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);