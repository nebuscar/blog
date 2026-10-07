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
  assert.match(source, /pic:\s*"\/music\/lucky-one-mich\.jpg"/);
  assert.doesNotMatch(source, /003Au73Y23nAVf/);
});

test("loads only local audio and lyric assets", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /const localTracks = Array\.isArray\(settings\.localTracks\)/);
  assert.match(source, /const isLocalMusicAsset = value/);
  assert.match(source, /const loadLocalPlaylist = async \(\) =>/);
  assert.doesNotMatch(source, /Meting|y\.qq\.com|fallbackApis|resourceIds/);
  assert.match(source, /await fetchLyrics\(track\.lrc \|\| ""\)/);
});

test("configures the five originally selected songs with local audio, lyrics, and covers", async () => {
  const source = await readFile(configUrl, "utf8");

  for (const [name, artist, slug, cover] of [
    ["鸽子", "宋冬野", "gezi", "songye-album"],
    ["Luv (Sic.) Pt.3", "Nujabes", "luv-sic-pt3", "luv-sic-pt3"],
    ["Pierre", "Men I Trust", "pierre", "pierre"],
    ["Intro", "宋冬野", "intro", "songye-album"],
    ["Before Every Load", "Mike Klubnika", "before-every-load", "before-every-load"],
  ]) {
    assert.match(source, new RegExp(`name: "${name.replace(/[()]/g, "\\$&")}"`));
    assert.match(source, new RegExp(`artist: "${artist}"`));
    assert.match(source, new RegExp(`/music/${slug}\\.m4a`));
    assert.match(source, new RegExp(`/music/${slug}\\.lrc`));
    assert.match(source, new RegExp(`/music/${cover}\\.jpg`));
  }
});

test("music player inline script parses as JavaScript", async () => {
  const source = await readFile(componentUrl, "utf8");
  const script = source.match(
    /<script is:inline define:vars=\{\{ config \}\}>([\s\S]*?)<\/script>/
  )?.[1];

  assert.ok(script, "music player inline script should exist");
  assert.doesNotThrow(() => new Function(script));
});
