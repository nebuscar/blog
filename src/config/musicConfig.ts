export type MusicResourceType = "song" | "playlist" | "album" | "artist";

export type MusicPlayerConfig = {
  enabled: boolean;
  server: "tencent";
  type: MusicResourceType;
  id: string | string[];
  volume: number;
  api: string;
  fallbackApis: string[];
};

export const musicPlayerConfig: MusicPlayerConfig = {
  enabled: true,
  server: "tencent",
  type: "song",
  id: ["003BlDgH3Gi3Tw", "004CMOqm4fVVzm"],
  volume: 0.7,
  api: "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r",
  fallbackApis: [
    "https://api.injahow.cn/meting/?server=:server&type=:type&id=:id",
    "https://api.moeyao.cn/meting/?server=:server&type=:type&id=:id",
  ],
};
