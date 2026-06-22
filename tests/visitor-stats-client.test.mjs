import test from "node:test";
import assert from "node:assert/strict";
import { fetchVisitorStats } from "../src/utils/visitorStatsClient.mjs";

const stats = {
  siteViews: 478,
  siteVisitors: 63,
  pageViews: 10,
  pageVisitors: 9,
};

test("returns recorded statistics when the view request succeeds", async () => {
  const calls = [];
  const fetcher = async (url, options) => {
    calls.push({ url, options });
    return new Response(JSON.stringify(stats), { status: 200 });
  };

  assert.deepEqual(
    await fetchVisitorStats(fetcher, "https://status.example", "/post/"),
    stats
  );
  assert.equal(calls.length, 1);
  assert.equal(calls[0].options.method, "POST");
});

test("falls back to read-only statistics when recording fails", async () => {
  const calls = [];
  const fetcher = async (url, options = {}) => {
    calls.push({ url, options });
    if (options.method === "POST") {
      return new Response("write unavailable", { status: 503 });
    }
    return new Response(JSON.stringify(stats), { status: 200 });
  };

  assert.deepEqual(
    await fetchVisitorStats(fetcher, "https://status.example", "/post/"),
    stats
  );
  assert.equal(calls.length, 2);
  assert.equal(
    calls[1].url,
    "https://status.example/api/stats?path=%2Fpost%2F"
  );
});
