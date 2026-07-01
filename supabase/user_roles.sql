-- ============================================================
-- 用户角色表：管理后台权限控制
-- admin  = 全部权限（产品、新闻、网站设置）
-- editor = 内容编辑（产品、新闻）
-- ============================================================

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor')) DEFAULT 'editor',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- RLS: 登录用户可以读取自己的角色
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);
