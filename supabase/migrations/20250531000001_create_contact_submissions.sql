-- 联系表单提交表
CREATE TABLE IF NOT EXISTS contact_submissions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read BOOLEAN NOT NULL DEFAULT false
);

-- 加速按时间排序查询
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions (created_at DESC);

-- 开启 RLS（行级安全）
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户 INSERT（表单提交端）
CREATE POLICY "allow_anon_insert" ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 仅允许认证用户 SELECT（管理端查看）
CREATE POLICY "allow_auth_select" ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- 新提交自动发送邮件通知（通过 pg_net 或 Supabase Edge Function）
-- 如果你用 Supabase 托管的 pg_net 扩展，可以取消下面注释：
-- CREATE EXTENSION IF NOT EXISTS pg_net;
--
-- CREATE OR REPLACE FUNCTION notify_new_contact()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   PERFORM net.http_post(
--     url := 'https://<YOUR_PROJECT_REF>.functions.supabase.co/send-email-notification',
--     body := jsonb_build_object('record', row_to_json(NEW))
--   );
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
--
-- CREATE TRIGGER trigger_new_contact
--   AFTER INSERT ON contact_submissions
--   FOR EACH ROW EXECUTE FUNCTION notify_new_contact();
