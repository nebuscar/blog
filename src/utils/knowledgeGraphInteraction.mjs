export function getConnectedNodeIds(links, focusedId) {
  const connectedIds = new Set([focusedId]);

  for (const link of links) {
    if (link.source === focusedId) connectedIds.add(link.target);
    if (link.target === focusedId) connectedIds.add(link.source);
  }

  return connectedIds;
}
