-- 执行前先执行 supabase/user_roles.sql，并确认管理账号有 admin 角色。
-- 仅更新权限，不修改网站内容或留言。
BEGIN;

DROP POLICY IF EXISTS "管理员可读写设置" ON public.site_settings;
DROP POLICY IF EXISTS "public_read_settings" ON public.site_settings;
DROP POLICY IF EXISTS "admin_manage_settings" ON public.site_settings;
CREATE POLICY "public_read_settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin_manage_settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "allow_auth_update" ON public.contact_submissions;
CREATE POLICY "allow_auth_update" ON public.contact_submissions
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "allow_admin_delete" ON public.contact_submissions;
CREATE POLICY "allow_admin_delete" ON public.contact_submissions
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

COMMIT;
