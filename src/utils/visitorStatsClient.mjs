async function readJson(response) {
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function fetchVisitorStats(fetcher, apiBase, path) {
  try {
    return await readJson(
      await fetcher(`${apiBase}/api/view`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ path }),
      })
    );
  } catch {
    const query = new URLSearchParams({ path });
    return readJson(await fetcher(`${apiBase}/api/stats?${query}`));
  }
}
