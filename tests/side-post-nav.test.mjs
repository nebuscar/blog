import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const componentUrl = new URL(
  "../src/pages/posts/[...slug]/_components/SidePostNav.astro",
  import.meta.url
);

test("positions desktop post navigation outside the full detail layout", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /max-w-\[70rem\]/);
  assert.doesNotMatch(source, /max-w-\[60rem\]/);
});
