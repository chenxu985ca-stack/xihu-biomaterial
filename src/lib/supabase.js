import { createClient } from '@supabase/supabase-js';
import { saveContactForm } from './contactForm';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase 环境变量未配置，在线表单和管理后台不可用。');
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
 * @param {{ name: string, company: string, phone: string, interest?: string, message: string }} data
 * @returns {{ success: boolean, error?: string }}
 */
export async function submitContactForm(data) {
  return saveContactForm(data, supabase);
}
