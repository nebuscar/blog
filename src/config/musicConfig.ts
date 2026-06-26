export type MusicResourceType = "song" | "playlist" | "album" | "artist";

export type LocalMusicTrack = {
  name: string;
  artist: string;
  url: string;
  lrc?: string;
  pic?: string;
  sourceUrl?: string;
};

export type MusicPlayerConfig = {
  enabled: boolean;
  server: "tencent";
  type: MusicResourceType;
  id: string | string[];
  localTracks: LocalMusicTrack[];
  volume: number;
  api: string;
  fallbackApis: string[];
};

export const musicPlayerConfig: MusicPlayerConfig = {
  enabled: true,
  server: "tencent",
  type: "song",
  id: ["004CMOqm4fVVzm", "003BlDgH3Gi3Tw", "004C3Rbj3tQVjF"],
  localTracks: [
    {
      name: "Lucky one",
      artist: "Mich",
      url: "/music/lucky-one-mich.mp3",
      lrc: "/music/lucky-one-mich.lrc",
    },
  ],
  volume: 0.7,
  api: "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r",
  fallbackApis: [
    "https://api.injahow.cn/meting/?server=:server&type=:type&id=:id",
    "https://api.moeyao.cn/meting/?server=:server&type=:type&id=:id",
  ],
};
