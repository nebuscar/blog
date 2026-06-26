import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const configUrl = new URL("../src/config/musicConfig.ts", import.meta.url);
const componentUrl = new URL("../src/components/MusicPlayer.astro", import.meta.url);

test("configures Lucky one as a local music track", async () => {
  const source = await readFile(configUrl, "utf8");

  assert.match(source, /localTracks:\s*\[/);
  assert.match(source, /name:\s*"Lucky one"/);
  assert.match(source, /artist:\s*"Mich"/);
  assert.match(source, /url:\s*"\/music\/lucky-one-mich\.mp3"/);
  assert.match(source, /lrc:\s*"\/music\/lucky-one-mich\.lrc"/);
  assert.doesNotMatch(source, /003Au73Y23nAVf/);
});

test("loads local music tracks before remote QQ music tracks", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /const localTracks = Array\.isArray\(settings\.localTracks\)/);
  assert.match(source, /tracks\.push\(\.\.\.localPlaylist\.filter\(item => item\.url\)\)/);
  assert.match(source, /await fetchLyrics\(track\.lrc \|\| ""\)/);
});
