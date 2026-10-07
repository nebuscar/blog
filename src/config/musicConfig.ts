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
  localTracks: LocalMusicTrack[];
  volume: number;
};

export const musicPlayerConfig: MusicPlayerConfig = {
  enabled: true,
  localTracks: [
    {
      name: "Lucky one",
      artist: "Mich",
      url: "/music/lucky-one-mich.mp3",
      lrc: "/music/lucky-one-mich.lrc",
      pic: "/music/lucky-one-mich.jpg",
    },
    {
      name: "鸽子",
      artist: "宋冬野",
      url: "/music/gezi.m4a",
      lrc: "/music/gezi.lrc",
      pic: "/music/songye-album.jpg",
    },
    {
      name: "Luv (Sic.) Pt.3",
      artist: "Nujabes",
      url: "/music/luv-sic-pt3.m4a",
      lrc: "/music/luv-sic-pt3.lrc",
      pic: "/music/luv-sic-pt3.jpg",
    },
    {
      name: "Pierre",
      artist: "Men I Trust",
      url: "/music/pierre.m4a",
      lrc: "/music/pierre.lrc",
      pic: "/music/pierre.jpg",
    },
    {
      name: "Intro",
      artist: "宋冬野",
      url: "/music/intro.m4a",
      lrc: "/music/intro.lrc",
      pic: "/music/songye-album.jpg",
    },
    {
      name: "Before Every Load",
      artist: "Mike Klubnika",
      url: "/music/before-every-load.m4a",
      lrc: "/music/before-every-load.lrc",
      pic: "/music/before-every-load.jpg",
    },
  ],
  volume: 0.7,
};
