CREATE TABLE IF NOT EXISTS notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    sender_id       BIGINT REFERENCES users(user_id) ON DELETE SET NULL,  -- actor
    receiver_id     BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    timestamp       TIMESTAMPTZ NOT NULL DEFAULT now(),
    notification_type notification_type NOT NULL
);