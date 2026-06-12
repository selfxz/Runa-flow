"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Play,
  CornerUpLeft,
  Mic2,
  Disc,
  History,
  Star,
  LogIn,
  LogOut,
  User,
  X,
  ChevronDown,
} from "lucide-react";
import { tracks } from "@/data/tracks";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";

const MusicalHome = () => {
  const router = useRouter();
  const { user, logout, setIsAuthModalOpen, setAuthMode } = useAuth();
  const [ratingsData, setRatingsData] = useState<
    Record<string, { average: number; count: number }>
  >({});

  useEffect(() => {
    const fetchAllRatings = async () => {
      const { data, error } = await supabase
        .from("ratings")
        .select("track_id, stars");
      if (!error && data) {
        const grouped: Record<string, number[]> = {};
        data.forEach((r) => {
          if (!grouped[r.track_id]) grouped[r.track_id] = [];
          grouped[r.track_id].push(r.stars);
        });

        const calculated: Record<string, { average: number; count: number }> =
          {};
        Object.keys(grouped).forEach((tid) => {
          const vals = grouped[tid];
          calculated[tid] = {
            average: vals.reduce((a, b) => a + b, 0) / vals.length,
            count: vals.length,
          };
        });
        setRatingsData(calculated);
      }
    };
    fetchAllRatings();
  }, []);

  const handleTrackSelect = (trackId: string) => {
    router.push(`/musical/${trackId}`);
  };
  const openLogin = () => {
    setAuthMode("login");
    setIsAuthModalOpen(true);
  };
  const openRegister = () => {
    setAuthMode("register");
    setIsAuthModalOpen(true);
  };

  const getRating = (id: string) => ratingsData[id] || { average: 0, count: 0 };

  const rankedTracks = [...tracks]
    .map((t) => ({ ...t, ...getRating(t.id) }))
    .sort((a, b) => b.average - a.average);

  return (
    <main className="min-h-screen relative overflow-x-hidden font-['Inter'] flex flex-col items-center text-white">
      <AuthModal />
      {/* Background with green tint */}
      <div className="fixed inset-0 -z-50 bg-[#0a0a0a]" />
      <div className="fixed inset-0 -z-40 bg-gradient-to-br from-[#0d1a0d] via-[#0a0a0a] to-[#1a0d00]" />
      <div className="fixed inset-0 -z-30 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]" />

      {/* Navigation - Enhanced Visibility with Glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-3 md:py-4 flex justify-between items-center bg-black/60 backdrop-blur-xl border-b border-white/5 transition-all duration-500">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/musical/historial" className="flex items-center gap-2 bg-green-600/10 border border-green-600/30 px-3 md:px-6 py-2 md:py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-green-500 hover:bg-green-600 hover:text-white transition-all shadow-lg shadow-green-600/5 group">
            <History size={14} className="group-hover:rotate-[-20deg] transition-transform" />
            <span className="hidden sm:inline">HISTORIAL</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 bg-orange-600 border border-orange-600 px-3 md:px-8 py-2 md:py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-orange-600 transition-all italic group shadow-lg shadow-orange-600/20">
            <CornerUpLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">REGRESAR</span>
          </Link>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 bg-green-600/10 border border-green-600/20 px-3 md:px-5 py-2 md:py-2.5 rounded-full">
                <User size={14} className="text-green-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-green-500 hidden sm:inline">
                  {user.fullName || user.email.split("@")[0]}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 md:px-5 py-2 md:py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={openLogin}
                className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 md:px-5 py-2 md:py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <LogIn size={14} />
                <span className="hidden sm:inline">Entrar</span>
              </button>
              <button
                onClick={openRegister}
                className="flex items-center gap-2 bg-green-600 border border-green-600 px-3 md:px-5 py-2 md:py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-green-600 transition-all shadow-lg shadow-green-600/20"
              >
                <User size={14} className="sm:hidden text-white" />
                <span className="hidden sm:inline">Registro</span>
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section - Cinematic Impact with 90vh */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-start pt-32 pb-40 px-6 overflow-hidden">
        <div className="relative z-10 group px-10 animate-entrance-scale">
          <img
            src="/images/Logo_RunaFlowSoundz.png"
            alt="Runa Flow Logo"
            className="w-full max-w-[1100px] h-auto object-contain drop-shadow-[0_40px_100px_rgba(0,0,0,0.95)] transition-all duration-700 scale-110 group-hover:scale-[1.15] group-hover:brightness-110 contrast-[1.25]"
          />
        </div>

        {/* Scroll Indicator */}
        <div
          onClick={() =>
            document
              .getElementById("tracks")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 animate-bounce cursor-pointer"
        >
          <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(234,88,12,0.4)] hover:bg-white transition-colors group">
            <ChevronDown
              size={24}
              className="text-white group-hover:text-orange-600"
              strokeWidth={3}
            />
          </div>
        </div>
      </section>

      {/* Track Cards Section - Added significant spacing */}
      <section
        id="tracks"
        className="pt-40 pb-32 px-6 w-full flex justify-center relative z-10"
      >
        <div className="flex flex-wrap justify-center gap-24 max-w-7xl">
          {tracks.map((track, i) => {
            const { average, count } = getRating(track.id);
            return (
              <div key={track.id} onClick={() => handleTrackSelect(track.id)} 
                className={`group relative cursor-pointer w-[300px] perspective-1000 animate-entrance-stagger delay-${(i + 3) * 100}`}>
                
                {/* 3D Vinyl Disc - Emerges on Hover */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 bg-black rounded-full border-4 border-zinc-900 shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-all duration-700 ease-out group-hover:translate-x-24 group-hover:rotate-[360deg] -z-10 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full opacity-40 bg-[radial-gradient(circle,transparent_40%,#111_41%,#111_42%,transparent_43%)] bg-[length:8px_8px]" />
                  <div className="absolute w-14 h-14 rounded-full border-2 border-white/5 flex items-center justify-center bg-zinc-900">
                    <div className="w-3 h-3 rounded-full bg-orange-600 shadow-[0_0_15px_#ea580c]" />
                  </div>
                </div>

                {/* Main Card Container - Dark Steel Theme */}
                <div className="relative bg-zinc-950/80 backdrop-blur-2xl border border-zinc-800/50 rounded-[2.5rem] p-5 transition-all duration-700 group-hover:rotate-y-12 group-hover:scale-[1.02] group-hover:border-orange-500/30 shadow-2xl overflow-hidden">
                  
                  {/* Artist Image with Advanced Effects */}
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-zinc-900 mb-6 border border-white/5">
                    <img 
                      src={track.cover} 
                      alt={track.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out grayscale-[20%] group-hover:grayscale-0" 
                    />
                    
                    {/* Metallic Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    
                  </div>

                  {/* Creative Typography Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="flex-1">
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.5em] mb-1.5 block">
                          #{i + 1} RELEASE
                        </span>
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-white leading-none transition-all duration-500 group-hover:text-orange-500">
                          {track.artist}
                        </h3>
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                          {track.title}
                        </p>
                      </div>
                      
                      {/* Pulse Play Button */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-orange-600/20 rounded-full animate-ping group-hover:bg-orange-500/40" />
                        <div className="relative w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(234,88,12,0.4)] group-hover:bg-white group-hover:text-orange-600 transition-all duration-500">
                          <Play size={18} fill="currentColor" className="ml-1" />
                        </div>
                      </div>
                    </div>

                    {/* Stats & Interactive Bar */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-3">
                         <div className="flex gap-0.5">
                           {[1, 2, 3, 4, 5].map(s => (
                             <Star 
                               key={s} 
                               size={11} 
                               fill={s <= Math.round(average) ? "#ea580c" : "none"} 
                               className={s <= Math.round(average) ? "text-orange-600" : "text-zinc-700"} 
                             />
                           ))}
                         </div>
                         <div className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                            <span className="text-[10px] font-black text-orange-500">{average.toFixed(1)}</span>
                            <span className="text-[8px] text-zinc-500 font-bold uppercase">Rank</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-1 text-zinc-500">
                        <Mic2 size={12} />
                        <span className="text-[8px] font-black uppercase tracking-tighter">Runa Studio</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Ranking Section */}
      <section className="w-full px-6 pb-32 animate-entrance-up delay-700">
        <div className="max-w-4xl mx-auto pt-16 border-t-4 border-green-600/10">
          <h2 className="text-4xl md:text-5xl font-black text-center uppercase tracking-tighter mb-14 italic">
            <span className="text-orange-600">Top</span>{" "}
            <span className="text-green-500">Runa</span>{" "}
            <span className="text-white">Ranking</span>
          </h2>
          <div className="space-y-5">
            {rankedTracks.map((item, i) => (
              <div
                key={item.id}
                onClick={() => handleTrackSelect(item.id)}
                className="flex items-center justify-between bg-white/5 backdrop-blur-md border-2 border-white/5 rounded-2xl p-4 pr-8 transition-all hover:-translate-y-1 hover:border-green-500/50 group cursor-pointer shadow-xl"
              >
                <div className="flex items-center gap-6 md:gap-8">
                  <span className="text-3xl font-black italic text-white/5 group-hover:text-orange-600 transition-colors w-10 text-center">
                    0{i + 1}
                  </span>
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white/10 shadow-lg shrink-0">
                    <img
                      src={item.cover}
                      alt={item.artist}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-lg md:text-xl uppercase tracking-tight text-white group-hover:text-green-500 transition-colors">
                      {item.artist}
                    </h4>
                    <span className="text-[10px] text-white/30 font-bold uppercase">
                      {item.title}
                    </span>
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={10}
                          fill={
                            s <= Math.round(item.average) ? "#ea580c" : "none"
                          }
                          className={
                            s <= Math.round(item.average)
                              ? "text-orange-600"
                              : "text-white/10"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-3xl font-black text-white italic leading-none">
                    {item.average > 0 ? item.average.toFixed(1) : "—"}
                  </span>
                  <span className="text-[9px] text-white/20 uppercase font-black tracking-widest mt-1 italic">
                    {item.count > 0 ? `${item.count} votos` : "Sin votos"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-auto py-10 border-t border-white/5 w-full text-center bg-black/30 backdrop-blur-md">
        <p className="text-[9px] md:text-[11px] font-medium uppercase tracking-[0.3em] md:tracking-[0.45em] text-white/60 hover:text-white transition-colors duration-300 px-6 leading-relaxed">
          Beats por Kapo Lion · Uso y reproducción exclusivos de Runa Flow
        </p>
      </footer>
    </main>
  );
};

export default MusicalHome;
