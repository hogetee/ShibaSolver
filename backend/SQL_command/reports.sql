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