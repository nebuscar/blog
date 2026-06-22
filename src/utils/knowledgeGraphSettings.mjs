export const DEFAULT_GRAPH_SETTINGS = Object.freeze({
  labelOpacity: 0,
  nodeSize: 1,
  linkWidth: 1,
  centerForce: 1,
  repelForce: 1,
  linkForce: 1,
  showOrphans: true,
  selectedTags: [],
  animation: true,
});

const clamp = (value, min, max, fallback) => {
  const number = Number(value);
  return Number.isFinite(number)
    ? Math.min(max, Math.max(min, number))
    : fallback;
};

export function normalizeGraphSettings(settings = {}, availableTags) {
  const validTags = availableTags ? new Set(availableTags) : null;

  return {
    labelOpacity: clamp(
      settings.labelOpacity,
      0,
      1,
      DEFAULT_GRAPH_SETTINGS.labelOpacity
    ),
    nodeSize: clamp(settings.nodeSize, 0.5, 2, DEFAULT_GRAPH_SETTINGS.nodeSize),
    linkWidth: clamp(
      settings.linkWidth,
      0.5,
      4,
      DEFAULT_GRAPH_SETTINGS.linkWidth
    ),
    centerForce: clamp(
      settings.centerForce,
      0,
      2,
      DEFAULT_GRAPH_SETTINGS.centerForce
    ),
    repelForce: clamp(
      settings.repelForce,
      0.25,
      2,
      DEFAULT_GRAPH_SETTINGS.repelForce
    ),
    linkForce: clamp(
      settings.linkForce,
      0,
      1,
      DEFAULT_GRAPH_SETTINGS.linkForce
    ),
    showOrphans:
      typeof settings.showOrphans === "boolean"
        ? settings.showOrphans
        : DEFAULT_GRAPH_SETTINGS.showOrphans,
    selectedTags: Array.isArray(settings.selectedTags)
      ? [
          ...new Set(
            settings.selectedTags
              .map(String)
              .filter(Boolean)
              .filter(tag => !validTags || validTags.has(tag))
          ),
        ]
      : [],
    animation:
      typeof settings.animation === "boolean"
        ? settings.animation
        : DEFAULT_GRAPH_SETTINGS.animation,
  };
}

export function filterGraphNodes(
  nodes,
  { query = "", selectedTags = [], showOrphans = true } = {}
) {
  const normalizedQuery = String(query).trim().toLocaleLowerCase();
  const tags = new Set(selectedTags);

  return new Set(
    nodes
      .filter(node => showOrphans || node.degree > 0)
      .filter(
        node => tags.size === 0 || node.tags.some(tag => tags.has(String(tag)))
      )
      .filter(
        node =>
          !normalizedQuery ||
          node.title.toLocaleLowerCase().includes(normalizedQuery)
      )
      .map(node => node.id)
  );
}
