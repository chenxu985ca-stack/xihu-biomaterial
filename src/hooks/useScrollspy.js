import { useEffect, useState } from 'react';

/**
 * Tracks which section is currently in view using IntersectionObserver.
 * @param {string[]} ids - Array of section element IDs
 * @param {number} offset - Pixel offset from top (for fixed navbar)
 * @returns {string} Active section ID
 */
export default function useScrollspy(ids, offset = 100) {
  const [activeId, setActiveId] = useState(ids[0] || '');

  useEffect(() => {
    const observers = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId(id);
          }
        },
        {
          rootMargin: `${-offset}px 0px -60% 0px`,
          threshold: 0,
        },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [ids, offset]);

  return activeId;
}
