"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import BackgroundAnimation from "@/components/landing/BackgroundAnimation";
import { MessageSquare, User, Clock, Music, ArrowLeft, Quote } from "lucide-react";
import Link from "next/link";
import { tracks } from "@/data/tracks";

interface Comment {
  id: string;
  userEmail: string;
  text: string;
  timestamp: number;
  trackId: string;
}

export default function ComunidadPage() {
  const [allComments, setAllComments] = useState<(Comment & { trackName: string; artist: string })[]>([]);

  useEffect(() => {
    const aggregateComments = () => {
      const collected: (Comment & { trackName: string; artist: string })[] = [];
      
      // Iterate over all localStorage keys to find comments
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("comments_")) {
          const trackId = key.replace("comments_", "");
          const track = tracks.find(t => t.id === trackId);
          const comments: Comment[] = JSON.parse(localStorage.getItem(key) || "[]");
          
          comments.forEach(c => {
            collected.push({
              ...c,
              trackId,
              trackName: track?.title || "Track Desconocido",
              artist: track?.artist || "Artista Desconocido"
            });
          });
        }
      }
      
      // Sort by newest first
      collected.sort((a, b) => b.timestamp - a.timestamp);
      setAllComments(collected);
    };

    aggregateComments();
  }, []);

  return (
    <main className="min-h-screen w-full bg-black relative font-['Inter'] flex flex-col overflow-x-hidden">
      <BackgroundAnimation />
      <Navbar />

      <div className="flex-1 relative z-10 w-full max-w-6xl mx-auto px-6 pt-32 pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-entrance-up">
          <div className="space-y-4">
            <Link href="/musical" className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al catálogo
            </Link>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-white">
              Historial de <br /> <span className="text-orange-600">Comunidad</span>
            </h1>
            <p className="text-white/30 text-sm italic max-w-md">
              Explora las rimas, traducciones y feedback de todos los tracks de Runa Flow.
            </p>
          </div>
          
          <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4 backdrop-blur-md">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Interacciones</p>
              <p className="text-2xl font-black italic text-green-500">{allComments.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
              <MessageSquare size={20} className="text-green-500" />
            </div>
          </div>
        </div>

        {/* Comments Feed */}
        {allComments.length === 0 ? (
          <div className="w-full py-32 flex flex-col items-center justify-center space-y-6 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem] animate-entrance-up delay-200">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
              <MessageSquare size={32} className="text-white/10" />
            </div>
            <p className="text-white/20 text-sm font-black uppercase tracking-[0.3em] italic text-center">
              Aún no hay feedback en la comunidad. <br />
              <span className="text-[10px] opacity-50 mt-2 block">¡Sé el primero en dejar una huella!</span>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {allComments.map((comment, index) => (
              <div 
                key={comment.id} 
                className="group relative bg-zinc-900/40 backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] hover:bg-zinc-900/60 transition-colors duration-500 hover:border-green-500/20 shadow-2xl overflow-hidden animate-entrance-up"
                style={{ animationDelay: `${200 + index * 100}ms` }}
              >
                {/* Background Track Name (Watermark) */}
                <div className="absolute top-4 right-8 pointer-events-none select-none opacity-[0.03] text-6xl font-black uppercase italic whitespace-nowrap">
                  {comment.trackName}
                </div>

                <div className="flex flex-col md:flex-row gap-8 relative z-10">
                  
                  {/* Left: Comment Content */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-start gap-4">
                      <Quote size={24} className="text-orange-600/30 shrink-0 mt-1" />
                      <p className="text-lg md:text-xl font-medium text-white/90 leading-relaxed italic">
                        {comment.text}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-orange-600/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                          <User size={14} className="text-white/40" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-green-500">{comment.userEmail}</p>
                          <div className="flex items-center gap-1.5 text-white/20 mt-0.5">
                            <Clock size={10} />
                            <span className="text-[8px] font-bold uppercase">{new Date(comment.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Track Origin Badge */}
                  <div className="w-full md:w-64 shrink-0">
                    <Link href={`/musical/${comment.trackId}`} className="block h-full bg-black/40 border border-white/5 p-5 rounded-2xl group/track hover:border-orange-600/30 transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <Music size={14} className="text-orange-600" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30 italic">Track Origen</span>
                      </div>
                      <h4 className="text-sm font-black uppercase italic text-white group-hover/track:text-orange-500 transition-colors">
                        {comment.trackName}
                      </h4>
                      <p className="text-[10px] font-bold text-white/40 uppercase mt-1">{comment.artist}</p>
                      
                      <div className="mt-4 flex justify-end">
                        <div className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black uppercase tracking-widest text-white/20 group-hover/track:bg-orange-600 group-hover/track:text-white transition-all">
                          Escuchar
                        </div>
                      </div>
                    </Link>
                  </div>

                </div>

                {/* Accent line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-orange-600 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
