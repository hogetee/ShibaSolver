CREATE TABLE IF NOT EXISTS bookmarks (
    user_id    BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    post_id    BIGINT NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, post_id)
);