export interface Artist {
  id: string;
  name: string;
  tagline: string;
  bio: string;
  image: string;
  bgImage: string;
  projects: { title: string; url: string; cover: string; description?: string }[];
  socials: { platform: string; url: string }[];
  imageClass?: string;
  imageStyle?: React.CSSProperties;
}

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

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  language: "es" | "qu";
  stars: number;
  userRating?: number;
  createdAt: string;
}