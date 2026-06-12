"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { tracks } from "@/data/tracks";
import MusicalPlayer from "@/components/musical/MusicalPlayer";

export default function PlayerPage() {
  const params = useParams();
  const router = useRouter();
  
  const trackId = params?.id as string;
  const track = tracks.find((t) => t.id === trackId);

  if (!track) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-black italic uppercase">Track no encontrado</h1>
        <button 
          onClick={() => router.push("/musical")}
          className="px-10 py-4 bg-orange-600 rounded-full font-black uppercase italic"
        >
          Volver al Catálogo
        </button>
      </div>
    );
  }

  return <MusicalPlayer track={track} />;
}
