-- === Types ===
DO $$ BEGIN
    CREATE TYPE user_state AS ENUM ('ban','suspend','normal', 'deleted');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- DO $$ BEGIN
--     CREATE TYPE rating_target_type AS ENUM ('post','comment');
-- EXCEPTION WHEN duplicate_object THEN NULL; END $$; ไม่ชัวร์

DO $$ BEGIN
    CREATE TYPE rating_type AS ENUM ('like','dislike');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE report_target_type AS ENUM ('post','user','comment');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('pending','accepted','rejected'); -- รอ, รับเรื่อง, ปฏิเสธ 
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('comment','reply','mention','ban','unban','admin_delete');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE admin_action_type AS ENUM ('delete_post','delete_comment','ban_user','unban_user','suspend_user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE cookie_choice AS ENUM ('accept','reject');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
