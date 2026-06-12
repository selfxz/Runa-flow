"use client";
import React, { useState, useEffect } from "react";
import BackgroundAnimation from "@/components/landing/BackgroundAnimation";
import { MessageSquare, User, Clock, Music, CornerUpLeft, Quote, Sparkles, Disc } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { tracks } from "@/data/tracks";
import { supabase } from "@/lib/supabase";

interface Comment {
  id: string;
  userEmail: string;
  text: string;
  timestamp: number;
  trackId: string;
}

export default function HistorialComunidadPage() {
  const router = useRouter();

  const [allComments, setAllComments] = useState<(Comment & { userName: string; trackName: string; artist: string })[]>([]);

  useEffect(() => {
    const fetchGlobalComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        const mapped = data.map(c => {
          const track = tracks.find(t => t.id === c.track_id);
          return {
            id: c.id,
            userEmail: c.user_email,
            userName: c.user_name || c.user_email.split('@')[0],
            text: c.comment_text,
            timestamp: new Date(c.created_at).getTime(),
            trackId: c.track_id,
            trackName: track?.title || "Track Desconocido",
            artist: track?.artist || "Artista Desconocido"
          };
        });
        setAllComments(mapped);
      }
    };

    fetchGlobalComments();
  }, []);

  return (
    <main className="min-h-screen w-full bg-black relative font-['Inter'] flex flex-col overflow-x-hidden text-white">
      <BackgroundAnimation />
      
      {/* Background Decor */}
      <div className="fixed inset-0 -z-50 bg-[#0a0a0a]" />
      <div className="fixed inset-0 -z-40 bg-gradient-to-br from-[#0d1a0d] via-[#0a0a0a] to-[#1a0d00]" />
      <div className="fixed inset-0 -z-30 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]" />
      {/* Navigation - MATCHING MUSICAL HOME STYLE */}
      <nav className="w-full flex items-center justify-start px-4 md:px-12 py-4 md:py-8 relative z-50 gap-2 md:gap-4 animate-entrance-up">
        <button 
          onClick={() => router.push("/musical")}
          className="flex items-center gap-2 md:gap-3 bg-green-600/10 border-2 border-green-600/20 px-4 md:px-8 py-2 md:py-3.5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-green-600 hover:text-white hover:border-green-600 transition-all italic group shadow-xl"
        >
          <Disc size={16} className="group-hover:rotate-180 transition-transform duration-700 text-green-500 group-hover:text-white" /> 
          <span className="text-green-500 group-hover:text-white hidden sm:inline">CATÁLOGO</span>
        </button>
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 md:gap-3 bg-orange-600 border-2 border-orange-600 px-4 md:px-10 py-2 md:py-3.5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] text-white hover:bg-white hover:text-orange-600 transition-all italic group shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:shadow-none"
        >
          <CornerUpLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">REGRESAR</span>
        </button>
      </nav>
      <div className="flex-1 relative z-10 w-full max-w-6xl mx-auto px-6 pt-10 pb-20">
        
        {/* Header Section - COMPACT */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 animate-entrance-up delay-200">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-500 mb-1">
              <Sparkles size={12} />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">Runa Flow Universe</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none text-white">
              Historial de <br /> <span className="text-orange-600">Comunidad</span>
            </h1>
          </div>
          
          <div className="bg-white/[0.03] border border-white/5 px-7 py-5 rounded-[2rem] flex items-center gap-5 backdrop-blur-2xl shadow-2xl">
            <div className="text-right">
              <p className="text-[8px] font-black uppercase tracking-widest text-white/20">Interacciones Globales</p>
              <p className="text-2xl font-black italic text-green-500">{allComments.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
              <MessageSquare size={20} className="text-green-500" />
            </div>
          </div>
        </div>

        {/* Comments Feed */}
        {allComments.length === 0 ? (
          <div className="w-full py-32 flex flex-col items-center justify-center space-y-6 bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem] animate-entrance-up delay-300">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
              <MessageSquare size={30} className="text-white/5" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-white/20 text-base font-black uppercase tracking-[0.3em] italic">El muro está vacío</p>
              <p className="text-white/10 text-[9px] font-bold uppercase tracking-widest">Ve al catálogo y sé el primero en comentar</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {allComments.map((comment, index) => (
              <div 
                key={comment.id} 
                className="group relative bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-7 md:p-8 rounded-[2.5rem] hover:bg-white/[0.04] transition-colors duration-500 hover:border-green-500/20 shadow-2xl animate-entrance-up"
                style={{ animationDelay: `${200 + index * 80}ms` }}
              >
                {/* Background Watermark - SMALLER */}
                <div className="absolute top-4 right-10 pointer-events-none select-none opacity-[0.015] text-5xl font-black uppercase italic whitespace-nowrap">
                  {comment.trackName}
                </div>

                <div className="flex flex-col lg:flex-row gap-6 relative z-10">
                  
                  {/* Left: Comment */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-start gap-4">
                      <Quote size={20} className="text-orange-600/20 shrink-0 mt-1" />
                      <p className="text-base md:text-lg font-medium text-white/90 leading-relaxed italic tracking-tight">
                        {comment.text}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-5 pt-5 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/10 to-orange-600/10 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                          <User size={14} className="text-white/30" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-green-500">{comment.userName}</p>
                          <div className="flex items-center gap-2 text-white/10 mt-0.5">
                            <Clock size={10} />
                            <span className="text-[8px] font-bold uppercase tracking-tighter">{new Date(comment.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Track Origin - COMPACT */}
                  <div className="w-full lg:w-64 shrink-0">
                    <Link href={`/musical/${comment.trackId}`} className="block h-full bg-black/40 border border-white/5 p-5 rounded-[1.5rem] group/track hover:border-orange-600/40 transition-all shadow-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-orange-600/10 flex items-center justify-center">
                           <Music size={12} className="text-orange-600" />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/20 italic">Track Origen</span>
                      </div>
                      <h4 className="text-base font-black uppercase italic text-white group-hover/track:text-orange-500 transition-colors leading-tight">
                        {comment.trackName}
                      </h4>
                      <p className="text-[10px] font-bold text-white/30 uppercase mt-1">{comment.artist}</p>
                      
                      <div className="mt-4 flex justify-end">
                        <div className="px-4 py-1.5 bg-white/5 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] text-white/30 group-hover/track:bg-green-600 group-hover/track:text-white transition-all shadow-lg">
                          Escuchar
                        </div>
                      </div>
                    </Link>
                  </div>

                </div>

                {/* Accent line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-green-600 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
