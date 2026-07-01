/**
 * 网站设置 Context
 *
 * 启动时从 Supabase 拉取设置，成功则覆盖静态默认值。
 * 组件用 useSiteSettings() 替代直接从 siteContent.js import。
 *
 * 数据流：
 *   Supabase site_settings 表 → getSiteSettings() → Context → 所有组件
 *   如果 Supabase 不可用 → 降级使用 siteContent.js 静态默认值
 */
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getSiteSettings } from '../lib/db';
import {
  siteConfig as defaultSiteConfig,
  navLinks as defaultNavLinks,
  aboutContent as defaultAboutContent,
  contactContent as defaultContactContent,
  footerContent as defaultFooterContent,
} from '../data/siteContent';

/* 用默认值初始化 Context，即使 Provider 还没挂载也能安全读取 */
const defaults = {
  siteConfig: defaultSiteConfig,
  navLinks: defaultNavLinks,
  aboutContent: defaultAboutContent,
  contactContent: defaultContactContent,
  footerContent: defaultFooterContent,
  loading: false,
};

const SiteSettingsContext = createContext(defaults);

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSiteSettings().then(({ data }) => {
      if (data && data.siteConfig) {
        // 合并：先展开默认值再覆盖 DB 数据，确保新字段不丢
        setSettings({
          siteConfig: { ...defaultSiteConfig, ...(data.siteConfig || {}) },
          navLinks: defaultNavLinks, // 导航一般不改，保持静态
          aboutContent: { ...defaultAboutContent, ...(data.aboutContent || {}) },
          contactContent: { ...defaultContactContent, ...(data.contactContent || {}) },
          footerContent: { ...defaultFooterContent, ...(data.footerContent || {}) },
          loading: false,
        });
      } else {
        setLoading(false);
      }
    }).catch(() => {
      // Supabase 不可用 → 静态默认值
      setLoading(false);
    });
  }, []);

  const value = useMemo(() => ({ ...settings, loading }), [settings, loading]);

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

/** 组件用这个 hook 获取设置（替代 siteContent.js 的静态 import） */
export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
