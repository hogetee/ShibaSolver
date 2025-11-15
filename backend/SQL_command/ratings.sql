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