/**
 * ============================================================
 * 统一数据访问层 (Data Access Layer)
 *
 * 所有数据库操作集中在此文件。组件不直接依赖 Supabase，
 * 只调用此文件的函数。以后换数据库只需改这一个文件。
 * ============================================================
 */

import { supabase } from './supabase';

// ============================================================
// 辅助
// ============================================================

/** 当 Supabase 未配置时返回此对象，调用方可据此降级 */
const SUPABASE_UNAVAILABLE = { error: '数据库未连接', data: null };

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const IMAGE_EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function guard() {
  if (!supabase) {
    console.warn('[db] Supabase 未配置，操作被忽略。');
    return false;
  }
  return true;
}

function validateImageFile(file) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return '仅支持 JPG、PNG、WebP 图片';
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return '图片不能超过 5MB';
  }
  return null;
}

// ============================================================
// 产品分类
// ============================================================

/**
 * 获取所有可见分类（按 sort_order 排序）
 */
export async function getCategories() {
  if (!guard()) return { data: [], error: SUPABASE_UNAVAILABLE.error };
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  return { data, error };
}

/**
 * 获取所有分类（含隐藏，管理后台用）
 */
export async function getAllCategories() {
  if (!guard()) return { data: [], error: SUPABASE_UNAVAILABLE.error };
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('sort_order');
  return { data, error };
}

/**
 * 获取单个分类
 */
export async function getCategory(id) {
  if (!guard()) return { data: null, error: SUPABASE_UNAVAILABLE.error };
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
}

/**
 * 创建分类
 */
export async function createCategory(category) {
  if (!guard()) return { data: null, error: SUPABASE_UNAVAILABLE.error };
  const { data, error } = await supabase
    .from('product_categories')
    .insert(category)
    .select()
    .single();
  return { data, error };
}

/**
 * 更新分类
 */
export async function updateCategory(id, updates) {
  if (!guard()) return { data: null, error: SUPABASE_UNAVAILABLE.error };
  const { data, error } = await supabase
    .from('product_categories')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

/**
 * 删除分类
 */
export async function deleteCategory(id) {
  if (!guard()) return { error: SUPABASE_UNAVAILABLE.error };
  const { error } = await supabase.from('product_categories').delete().eq('id', id);
  return { error };
}

// ============================================================
// 产品
// ============================================================

/**
 * 获取某分类下的所有可见产品（前台用）
 */
export async function getProductsByCategory(categoryId) {
  if (!guard()) return { data: [], error: SUPABASE_UNAVAILABLE.error };
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('sort_order');
  return { data, error };
}

/**
 * 获取某分类下的所有产品（含隐藏，管理后台用）
 */
export async function getAllProductsByCategory(categoryId) {
  if (!guard()) return { data: [], error: SUPABASE_UNAVAILABLE.error };
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .order('sort_order');
  return { data, error };
}

/**
 * 获取所有产品（含隐藏，管理后台用）
 */
export async function getAllProducts() {
  if (!guard()) return { data: [], error: SUPABASE_UNAVAILABLE.error };
  const { data, error } = await supabase
    .from('products')
    .select('*, product_categories(name)')
    .order('sort_order');
  return { data, error };
}

/**
 * 获取单个产品
 */
export async function getProduct(id) {
  if (!guard()) return { data: null, error: SUPABASE_UNAVAILABLE.error };
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
}

/**
 * 创建产品
 */
export async function createProduct(product) {
  if (!guard()) return { data: null, error: SUPABASE_UNAVAILABLE.error };
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();
  return { data, error };
}

/**
 * 更新产品
 */
export async function updateProduct(id, updates) {
  if (!guard()) return { data: null, error: SUPABASE_UNAVAILABLE.error };
  const { data, error } = await supabase
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

/**
 * 删除产品
 */
export async function deleteProduct(id) {
  if (!guard()) return { error: SUPABASE_UNAVAILABLE.error };
  const { error } = await supabase.from('products').delete().eq('id', id);
  return { error };
}

// ============================================================
// 新闻
// ============================================================

/**
 * 获取所有可见新闻（按日期倒序）
 */
export async function getNews() {
  if (!guard()) return { data: [], error: SUPABASE_UNAVAILABLE.error };
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
    .order('publish_date', { ascending: false });
  return { data, error };
}

/**
 * 获取所有新闻（含隐藏，管理后台用）
 */
export async function getAllNews() {
  if (!guard()) return { data: [], error: SUPABASE_UNAVAILABLE.error };
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('sort_order')
    .order('publish_date', { ascending: false });
  return { data, error };
}

/**
 * 获取单条新闻
 */
export async function getNewsItem(id) {
  if (!guard()) return { data: null, error: SUPABASE_UNAVAILABLE.error };
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
}

/**
 * 创建新闻
 */
export async function createNews(newsItem) {
  if (!guard()) return { data: null, error: SUPABASE_UNAVAILABLE.error };
  const { data, error } = await supabase
    .from('news')
    .insert(newsItem)
    .select()
    .single();
  return { data, error };
}

/**
 * 更新新闻
 */
export async function updateNews(id, updates) {
  if (!guard()) return { data: null, error: SUPABASE_UNAVAILABLE.error };
  const { data, error } = await supabase
    .from('news')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

/**
 * 删除新闻
 */
export async function deleteNews(id) {
  if (!guard()) return { error: SUPABASE_UNAVAILABLE.error };
  const { error } = await supabase.from('news').delete().eq('id', id);
  return { error };
}

// ============================================================
// 网站设置
// ============================================================

/**
 * 获取所有网站设置（返回 { key: value } 对象）
 */
export async function getSiteSettings() {
  if (!guard()) return { data: null, error: SUPABASE_UNAVAILABLE.error };
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value');
  if (error) return { data: null, error };
  const settings = {};
  for (const row of data) {
    settings[row.key] = row.value;
  }
  return { data: settings, error: null };
}

/**
 * 更新一项设置（upsert）
 */
export async function updateSiteSetting(key, value) {
  if (!guard()) return { data: null, error: SUPABASE_UNAVAILABLE.error };
  const { data, error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() })
    .select()
    .single();
  return { data, error };
}

// ============================================================
// 用户角色
// ============================================================

/**
 * 获取当前用户的角色
 * 未在 user_roles 表中找到记录时默认返回 'editor'（最小权限原则）
 * @param {string} userId - Supabase Auth user.id
 * @returns {{ role: string }}
 */
export async function getUserRole(userId) {
  if (!guard()) return { role: 'editor' };
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();
  if (error || !data) {
    // 无记录时默认 editor（最小权限）
    return { role: 'editor' };
  }
  return { role: data.role };
}

// ============================================================
// 管理员认证
// ============================================================

/**
 * 管理员登录
 */
export async function adminLogin(email, password) {
  if (!guard()) return { data: null, error: SUPABASE_UNAVAILABLE.error };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

/**
 * 管理员登出
 */
export async function adminLogout() {
  if (!guard()) return { error: SUPABASE_UNAVAILABLE.error };
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * 获取当前会话
 */
export async function getAdminSession() {
  if (!guard()) return { session: null };
  const { data } = await supabase.auth.getSession();
  return { session: data.session };
}

/**
 * 监听认证状态变化
 */
export function onAuthStateChange(callback) {
  if (!guard()) return { data: null };
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  return data;
}

// ============================================================
// 联系表单
// ============================================================

export { submitContactForm } from './supabase';

/**
 * 获取所有联系表单提交（管理后台用，按时间倒序）
 */
export async function getContactSubmissions() {
  if (!guard()) return { data: [], error: SUPABASE_UNAVAILABLE.error };
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}

/**
 * 标记/取消标记提交为已读
 * @param {number} id
 * @param {boolean} read
 */
export async function markSubmissionRead(id, read = true) {
  if (!guard()) return { error: SUPABASE_UNAVAILABLE.error };
  const { error } = await supabase
    .from('contact_submissions')
    .update({ read })
    .eq('id', id);
  return { error };
}

/**
 * 删除提交
 * @param {number} id
 */
export async function deleteSubmission(id) {
  if (!guard()) return { error: SUPABASE_UNAVAILABLE.error };
  const { error } = await supabase
    .from('contact_submissions')
    .delete()
    .eq('id', id);
  return { error };
}

// ============================================================
// 图片标准化处理
// ============================================================

/**
 * 将图片统一处理为产品灯箱照格式（等比缩放 + 居中 + 纯白底）
 * 无论原图是横/竖/方，输出统一 600×450 JPEG
 * @param {File} file - 原始文件
 * @param {number} width - 画布宽度
 * @param {number} height - 画布高度
 * @param {boolean} watermark - 是否添加产品防盗水印
 * @returns {Promise<File>} 处理后的 JPEG 文件
 */
async function normalizeImage(file, width = 600, height = 450, watermark = false) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // 纯白底 — 产品灯箱背景
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // 等比缩放，居中放置
      const scale = Math.min(width / img.width, height / img.height, 1);
      const sw = img.width * scale;
      const sh = img.height * scale;
      const sx = (width - sw) / 2;
      const sy = (height - sh) / 2;

      ctx.drawImage(img, sx, sy, sw, sh);

      if (watermark) {
        const text = '西湖巴尔 · xihubiom.cn';
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(-Math.PI / 7);
        ctx.fillStyle = 'rgba(30, 64, 110, 0.14)';
        ctx.font = '600 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let y = -height; y <= height; y += 105) {
          for (let x = -width; x <= width; x += 250) {
            ctx.fillText(text, x, y);
          }
        }
        ctx.restore();
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const normalized = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(normalized);
          } else {
            reject(new Error('图片处理失败'));
          }
        },
        'image/jpeg',
        0.85,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('图片加载失败'));
    };

    img.src = objectUrl;
  });
}

/**
 * 压缩首页展示图：限制最长边并转换为 WebP，保留原始宽高比。
 * 首页使用 object-cover 展示，因此无需在上传时裁切图片。
 */
async function optimizeHeroImage(file, maxWidth = 1600, maxHeight = 1067) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('首页图片处理失败'));
            return;
          }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), {
            type: 'image/webp',
            lastModified: Date.now(),
          }));
        },
        'image/webp',
        0.82,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('首页图片加载失败'));
    };

    img.src = objectUrl;
  });
}

// ============================================================
// 图片上传
// ============================================================

/**
 * 上传图片到 Supabase Storage（自动标准化为 600×450 灯箱照）
 * @param {File} file - 图片文件
 * @param {string} bucket - 存储桶名 (products / news)
 * @returns {{ data: { url: string } | null, error: any }}
 */
export async function uploadImage(file, bucket = 'products') {
  if (!guard()) return { data: null, error: SUPABASE_UNAVAILABLE.error };
  const validationError = validateImageFile(file);
  if (validationError) return { data: null, error: validationError };

  // 标准化图片尺寸
  let normalized;
  try {
    normalized = await normalizeImage(file, 600, 450, bucket === 'products');
  } catch (err) {
    console.error('图片标准化失败，使用原图上传:', err);
    normalized = file;
  }

  const ext = IMAGE_EXTENSIONS[normalized.type];
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, normalized, {
      cacheControl: '31536000',
      contentType: normalized.type,
    });

  if (error) return { data: null, error };

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);

  return { data: { url: urlData.publicUrl }, error: null };
}

/**
 * 上传首页展示图片（最长边限制为 1600×1067，并转换为 WebP）
 * @param {File} file - 图片文件
 * @returns {{ data: { url: string } | null, error: any }}
 */
export async function uploadHeroImage(file) {
  if (!guard()) return { data: null, error: SUPABASE_UNAVAILABLE.error };
  const validationError = validateImageFile(file);
  if (validationError) return { data: null, error: validationError };

  let optimized;
  try {
    optimized = await optimizeHeroImage(file);
  } catch (err) {
    console.error('首页图片压缩失败，使用原图上传:', err);
    optimized = file;
  }

  const ext = IMAGE_EXTENSIONS[optimized.type] || 'jpg';
  const fileName = `hero-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  // 复用 products bucket（已有上传策略）
  const { error } = await supabase.storage
    .from('products')
    .upload(fileName, optimized, {
      cacheControl: '31536000',
      contentType: optimized.type,
    });

  if (error) return { data: null, error };

  const { data: urlData } = supabase.storage.from('products').getPublicUrl(fileName);

  return { data: { url: urlData.publicUrl }, error: null };
}

/**
 * 删除图片
 */
export async function deleteImage(url, bucket = 'products') {
  if (!guard()) return { error: SUPABASE_UNAVAILABLE.error };
  // 从 URL 提取文件名
  const fileName = url.split('/').pop();
  if (!fileName) return { error: '无法解析文件路径' };
  const { error } = await supabase.storage.from(bucket).remove([fileName]);
  return { error };
}

// ============================================================
// 排序辅助 — 通过交换 sort_order 实现上下移动
// ============================================================

/**
 * 交换两个产品的 sort_order
 */
export async function swapProductOrder(id1, sort1, id2, sort2) {
  if (!guard()) return { error: SUPABASE_UNAVAILABLE.error };
  const updatedAt = new Date().toISOString();
  const first = await supabase.from('products').update({ sort_order: sort2, updated_at: updatedAt }).eq('id', id1);
  if (first.error) return { error: first.error };
  const second = await supabase.from('products').update({ sort_order: sort1, updated_at: updatedAt }).eq('id', id2);
  if (second.error) return { error: second.error };
  return { error: null };
}

/**
 * 交换两条新闻的 sort_order
 */
export async function swapNewsOrder(id1, sort1, id2, sort2) {
  if (!guard()) return { error: SUPABASE_UNAVAILABLE.error };
  const updatedAt = new Date().toISOString();
  const first = await supabase.from('news').update({ sort_order: sort2, updated_at: updatedAt }).eq('id', id1);
  if (first.error) return { error: first.error };
  const second = await supabase.from('news').update({ sort_order: sort1, updated_at: updatedAt }).eq('id', id2);
  if (second.error) return { error: second.error };
  return { error: null };
}
