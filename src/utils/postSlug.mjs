const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function shortHash(value) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36).padStart(5, "0").slice(0, 5);
}

export function createPostSlug(pubDatetime, identity) {
  const parts = Object.fromEntries(
    formatter.formatToParts(pubDatetime).map(({ type, value }) => [type, value])
  );
  return `${parts.year}${parts.month}${parts.day}-${parts.hour}${parts.minute}-${shortHash(identity)}`;
}
