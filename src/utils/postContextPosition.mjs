const VIEWPORT_MARGIN = 16;
const DEFAULT_RIGHT_OFFSET = 76;

export function clampContextPosition(position, viewport, toolbar) {
  return {
    x: Math.min(
      Math.max(VIEWPORT_MARGIN, position.x),
      Math.max(
        VIEWPORT_MARGIN,
        viewport.width - toolbar.width - VIEWPORT_MARGIN
      )
    ),
    y: Math.min(
      Math.max(VIEWPORT_MARGIN, position.y),
      Math.max(
        VIEWPORT_MARGIN,
        viewport.height - toolbar.height - VIEWPORT_MARGIN
      )
    ),
  };
}

export function getDefaultContextPosition(viewport, toolbar) {
  return clampContextPosition(
    {
      x: viewport.width - toolbar.width - DEFAULT_RIGHT_OFFSET,
      y: (viewport.height - toolbar.height) / 2,
    },
    viewport,
    toolbar
  );
}
