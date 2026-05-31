/** Smooth-scroll to a section by its href selector (e.g. "#products"). */
export function scrollToSection(href) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
