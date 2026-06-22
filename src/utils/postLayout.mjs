export const MIN_TOC_WIDTH = 220;
export const DEFAULT_TOC_WIDTH = 280;
export const MAX_TOC_WIDTH = 420;

export function clampTocWidth(value) {
  if (!Number.isFinite(value)) return DEFAULT_TOC_WIDTH;
  return Math.min(MAX_TOC_WIDTH, Math.max(MIN_TOC_WIDTH, Math.round(value)));
}
