export interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  audioUrl: string;
  translations?: {
    quechua: string;
    spanish: string;
    aymara: string;
  };
}

export const tracks: Track[] = [
  {
    id: "track-1",
    title: "BEAT 1",
    artist: "BEAT 1",
    cover: "/images/music/Portada_Beat_1.jpeg",
    audioUrl: "/music/BEAT1.mpeg",
  },
  {
    id: "track-2",
    title: "BEAT 2",
    artist: "BEAT 2",
    cover: "/images/music/Portada_Beat_2.png",
    audioUrl: "/music/BEAT2.mpeg",
  },
  {
    id: "track-3",
    title: "BEAT 3",
    artist: "BEAT 3",
    cover: "/images/music/Portada_Beat_3.png",
    audioUrl: "/music/BEAT3.mpeg",
  },
];