export function buildArticleTocTree(headings) {
  const roots = [];
  const stack = [];

  for (const heading of headings) {
    const node = { ...heading, children: [] };

    while (stack.length > 0 && stack[stack.length - 1].depth >= heading.depth) {
      stack.pop();
    }

    const parent = stack[stack.length - 1];
    if (parent) parent.children.push(node);
    else roots.push(node);

    stack.push(node);
  }

  return roots;
}

export function getArticleTocPath(nodes, activeSlug, ancestors = []) {
  for (const node of nodes) {
    const path = [...ancestors, node.slug];
    if (node.slug === activeSlug) return path;

    const childPath = getArticleTocPath(node.children, activeSlug, path);
    if (childPath.length > 0) return childPath;
  }

  return [];
}
