CREATE TABLE IF NOT EXISTS cookie_consents (
    cookie_id  BIGSERIAL PRIMARY KEY,
    user_id    BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
    anon_key   UUID NOT NULL DEFAULT gen_random_uuid(),
    choice     cookie_choice NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);