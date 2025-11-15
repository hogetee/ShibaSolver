CREATE TABLE IF NOT EXISTS admin_actions (
    action_id   BIGSERIAL PRIMARY KEY,
    admin_id    BIGINT NOT NULL REFERENCES admins(admin_id) ON DELETE CASCADE,
    action_type admin_action_type NOT NULL,
    target_type report_target_type NOT NULL,
    target_id   BIGINT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);