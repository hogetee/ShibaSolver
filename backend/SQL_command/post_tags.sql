CREATE TABLE IF NOT EXISTS post_tags (
    post_id BIGINT NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    tag_id  BIGINT NOT NULL REFERENCES tags(tag_id)  ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);