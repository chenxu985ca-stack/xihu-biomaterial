-- 启用 pg_net 扩展（Supabase 内置，用于在数据库触发器中发 HTTP 请求）
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 触发器函数：新提交时调用 Edge Function 发邮件
CREATE OR REPLACE FUNCTION notify_new_contact()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://nyxdbinoacsdtlrrrsyg.supabase.co/functions/v1/send-email-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('supabase.service_role_key', true)
    ),
    body := jsonb_build_object('record', row_to_json(NEW))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 绑定触发器到 contact_submissions 表
DROP TRIGGER IF EXISTS trigger_new_contact ON contact_submissions;
CREATE TRIGGER trigger_new_contact
  AFTER INSERT ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION notify_new_contact();
