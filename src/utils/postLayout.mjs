export const MIN_TOC_WIDTH = 220;
export const DEFAULT_TOC_WIDTH = 280;
export const MAX_TOC_WIDTH = 420;
export const MIN_GRAPH_WIDTH = 240;
export const DEFAULT_GRAPH_WIDTH = 288;
export const MAX_GRAPH_WIDTH = 420;

export function clampTocWidth(value) {
  if (!Number.isFinite(value)) return DEFAULT_TOC_WIDTH;
  return Math.min(MAX_TOC_WIDTH, Math.max(MIN_TOC_WIDTH, Math.round(value)));
}

export function clampGraphWidth(value) {
  if (!Number.isFinite(value)) return DEFAULT_GRAPH_WIDTH;
  return Math.min(
    MAX_GRAPH_WIDTH,
    Math.max(MIN_GRAPH_WIDTH, Math.round(value))
  );
}
