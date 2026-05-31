import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase 环境变量未配置，表单提交将仅打印到控制台。');
}

/**
 * Supabase 客户端单例。
 * 未配置环境变量时返回 null，调用方应做降级处理。
 */
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * 提交联系表单到 Supabase。
 * @param {{ name: string, company: string, phone: string, message: string }} data
 * @returns {{ success: boolean, error?: string }}
 */
export async function submitContactForm(data) {
  if (!supabase) {
    // 降级：仅打印到控制台
    console.log('[DEV] 联系表单数据:', data);
    return { success: true };
  }

  const { error } = await supabase
    .from('contact_submissions')
    .insert({
      name: data.name.trim(),
      company: data.company.trim() || null,
      phone: data.phone.trim(),
      message: data.message.trim(),
    });

  if (error) {
    console.error('表单提交失败:', error);
    return { success: false, error: '提交失败，请稍后重试或直接致电联系我们。' };
  }

  return { success: true };
}
