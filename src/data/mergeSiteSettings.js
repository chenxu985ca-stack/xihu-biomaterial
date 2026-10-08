import { siteConfig, aboutContent, contactContent, footerContent } from './siteContent.js';

export const defaultSettings = { siteConfig, aboutContent, contactContent, footerContent };

// Merge objects recursively, but replace arrays (including deliberately empty arrays).
function mergeObject(defaults, overrides) {
  const result = { ...defaults };
  if (!overrides || typeof overrides !== 'object' || Array.isArray(overrides)) return result;
  for (const [key, value] of Object.entries(overrides)) {
    if (value == null) continue;
    const fallback = defaults[key];
    result[key] = fallback && typeof fallback === 'object' && !Array.isArray(fallback)
      ? mergeObject(fallback, value)
      : value;
  }
  return result;
}

export function mergeSiteSettings(data = {}) {
  return Object.fromEntries(Object.entries(defaultSettings).map(([key, defaults]) =>
    [key, mergeObject(defaults, data?.[key])]
  ));
}
