/**
 * 滚动动画占位 — 当前版本不启用动画，直接透传 children。
 * 保留此文件是为了不破坏现有组件的 import 结构，
 * 以后想重新启用动画时改这个文件即可。
 */
export default function ScrollReveal({ children }) {
  return children;
}
