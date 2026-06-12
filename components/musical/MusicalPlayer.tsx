"use client";
import React, { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  Play,
  Pause,
  Sparkles,
  CornerUpLeft,
  RotateCcw,
  RotateCw,
  Calendar,
  Eye,
  Languages,
  RefreshCw,
  LogIn,
  LogOut,
  User,
  MessageSquare,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { Track } from "@/types";
import { translateWithDictionary } from "@/data/quechua-dictionary";
import { useAuth } from "@/context/AuthContext";
import StarRating from "./StarRating";
import AuthModal from "./AuthModal";

interface MusicalPlayerProps {
  track: Track;
}

interface Comment {
  id: string;
  userName: string;
  userEmail: string;
  text: string;
  timestamp: number;
  trackId: string;
}

const MusicalPlayer = ({ track }: MusicalPlayerProps) => {
  const { user, logout, setIsAuthModalOpen, setAuthMode } = useAuth();
  const [activeLang, setActiveLang] = useState<"es" | "qu">("qu");
  const [transInput, setTransInput] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showToast, setShowToast] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load comments with Realtime
  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('track_id', track.id)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setComments(data.map(c => ({
          id: c.id,
          userName: c.user_name || c.user_email.split('@')[0],
          userEmail: c.user_email,
          text: c.comment_text,
          timestamp: new Date(c.created_at).getTime(),
          trackId: c.track_id
        })));
      }
    };

    fetchComments();

    // Realtime subscription
    const channel = supabase
      .channel(`comments_${track.id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'comments',
        filter: `track_id=eq.${track.id}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newC = payload.new;
          setComments(prev => [{
            id: newC.id,
            userName: newC.user_name || newC.user_email.split('@')[0],
            userEmail: newC.user_email,
            text: newC.comment_text,
            timestamp: new Date(newC.created_at).getTime(),
            trackId: newC.track_id
          }, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setComments(prev => prev.filter(c => c.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [track.id]);

  const handleTranslate = async () => {
    if (!transInput.trim()) return;
    setIsTranslating(true);
    const sourceLang = activeLang === "qu" ? "es" : "qu";
    const targetLang = activeLang === "qu" ? "qu" : "es";
    const dictDirection = activeLang === "qu" ? "es-qu" : "qu-es";
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transInput, sourceLang, targetLang }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.translated) {
          setTransInput(data.translated);
          return;
        }
      }
      setTransInput(
        translateWithDictionary(transInput, dictDirection as "es-qu" | "qu-es"),
      );
    } catch {
      setTransInput(
        translateWithDictionary(transInput, dictDirection as "es-qu" | "qu-es"),
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const handlePostComment = async () => {
    if (!user) {
      setAuthMode("login");
      setIsAuthModalOpen(true);
      return;
    }
    if (!transInput.trim()) return;

    const { error } = await supabase.from('comments').insert({
      user_id: user.id,
      user_email: user.email,
      user_name: user.fullName,
      track_id: track.id,
      comment_text: transInput
    });

    if (error) {
      alert("Error al enviar comentario: " + error.message);
      return;
    }

    setTransInput("");
    
    // Trigger high-fidelity toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDeleteComment = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) {
      alert("No puedes borrar este comentario.");
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (seconds: number) => {
    if (audioRef.current) {
      const newTime = Math.max(
        0,
        Math.min(duration, audioRef.current.currentTime + seconds),
      );
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <main className="min-h-screen relative overflow-x-hidden font-['Inter'] pb-32 text-white">
      <AuthModal />

      <div className="fixed inset-0 -z-50 bg-[#0d0d0d]" />
      <div className="fixed inset-0 -z-40 bg-gradient-to-br from-[#1a2a1a] via-[#1a1a1a] to-[#2a1500]" />
      <div className="fixed inset-0 -z-30 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]" />

      <audio
        ref={audioRef}
        src={track.audioUrl}
        onTimeUpdate={() =>
          audioRef.current && setCurrentTime(audioRef.current.currentTime)
        }
        onLoadedMetadata={() =>
          audioRef.current && setDuration(audioRef.current.duration)
        }
        onEnded={() => setIsPlaying(false)}
      />

      <div className="max-w-5xl mx-auto px-6 md:px-8 py-8">
        {/* Top Bar - UNIFIED STYLE */}
        <div className="flex items-center justify-between mb-10 relative z-20 flex-wrap gap-2 md:gap-4 animate-entrance-up">
          <div className="flex items-center gap-2 md:gap-4">
            <Link
              href="/musical"
              className="flex items-center gap-2 md:gap-3 bg-orange-600 border-2 border-orange-600 px-4 md:px-10 py-2 md:py-3.5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] text-white hover:bg-white hover:text-orange-600 transition-all italic group shadow-[0_0_30px_rgba(234,88,12,0.3)]"
            >
              <CornerUpLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />{" "}
              <span className="hidden sm:inline">CATÁLOGO</span>
            </Link>
            
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 bg-green-600/10 border border-green-600/20 px-3 md:px-4 py-2 md:py-2.5 rounded-full">
                  <User size={13} className="text-green-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-500 hidden sm:inline">
                    {user.fullName}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 md:px-4 py-2 md:py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <LogOut size={13} />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setIsAuthModalOpen(true);
                  }}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 md:px-5 py-2 md:py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/10 transition-all"
                >
                  <LogIn size={13} />
                  <span className="hidden sm:inline">Entrar</span>
                </button>
                <button
                  onClick={() => {
                    setAuthMode("register");
                    setIsAuthModalOpen(true);
                  }}
                  className="flex items-center gap-2 bg-green-600 border border-green-600 px-3 md:px-5 py-2 md:py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-green-600 transition-all shadow-lg shadow-green-600/20"
                >
                  <User size={13} className="sm:hidden text-white" />
                  <span className="hidden sm:inline">Registro</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Player Card - HIGH FIDELITY OVERHAUL */}
        <section className="w-full flex justify-center mb-10 animate-entrance-glow delay-200">
          <div className="w-full max-w-4xl overflow-hidden rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] bg-zinc-900/60 backdrop-blur-3xl border border-white/10 relative group">
            
            {/* Background Glows */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col md:flex-row relative z-10">
              {/* Cover Art - High Fidelity Cinematic Treatment */}
              <div className="relative w-full md:w-[320px] shrink-0 aspect-square overflow-hidden group/cover">
                <img 
                  src={track.cover} 
                  alt={track.artist} 
                  className="w-full h-full object-cover transition-transform duration-[10000ms] ease-out group-hover:scale-125 animate-ken-burns" 
                />
                
                {/* Cinematic Glass Reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-40 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-30 pointer-events-none" />
                
                {/* Internal Vignette */}
                <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.6)] pointer-events-none" />
                
                {/* Studio Badge */}
                <div className="absolute top-6 left-6 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full">
                  <span className="text-[7px] font-black uppercase tracking-[0.4em] text-orange-500">
                    Studio Master
                  </span>
                </div>

                {/* Transition to content */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/80 hidden md:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
              </div>

              {/* Player Content */}
              <div className="flex-1 px-10 py-10 flex flex-col justify-between gap-8">
                {/* Header Info */}
                <div className="space-y-4">
                  <div className="flex items-baseline gap-4 flex-wrap">
                    <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white leading-none">
                      {track.artist}
                    </h3>
                    <span className="text-white/20 font-bold uppercase tracking-widest text-xs">— {track.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md bg-green-500/20 flex items-center justify-center border border-green-500/30">
                      <Sparkles size={10} className="text-green-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500 italic">Productora Runa Flow</span>
                  </div>
                </div>


                {/* Controls Section */}
                <div className="space-y-8">
                  {/* Progress Bar */}
                  <div className="space-y-3">
                    <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden group/progress">
                      <div 
                        className="absolute h-full bg-gradient-to-r from-orange-600 to-green-500 transition-all duration-300"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-white/30 tracking-widest uppercase italic">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Main Playback Buttons */}
                  <div className="flex items-center justify-center gap-12">
                    <button onClick={() => handleSeek(-10)} className="text-white/20 hover:text-orange-500 transition-all hover:scale-110 active:scale-95">
                      <RotateCcw size={28} />
                    </button>
                    
                    <button 
                      onClick={togglePlay}
                      className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 relative group/play
                        ${isPlaying 
                          ? "bg-white text-black shadow-[0_0_50px_rgba(255,255,255,0.2)]" 
                          : "bg-gradient-to-br from-orange-600 to-green-600 text-white shadow-[0_0_40px_rgba(34,197,94,0.3)] hover:scale-105 active:scale-95"
                        }`}
                    >
                      {/* Pulse effect when playing */}
                      {isPlaying && (
                        <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping" />
                      )}
                      {isPlaying ? (
                        <Pause size={36} fill="black" className="transition-transform duration-500" />
                      ) : (
                        <Play size={36} fill="white" className="ml-2 transition-transform duration-500" />
                      )}
                    </button>

                    <button onClick={() => handleSeek(10)} className="text-white/20 hover:text-green-500 transition-all hover:scale-110 active:scale-95">
                      <RotateCw size={28} />
                    </button>
                  </div>
                </div>

                {/* Bottom Metadata */}
                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-white/20">
                      <Calendar size={14} className="text-orange-600/40" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Mayo 2, 2026</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/20">
                      <Eye size={14} className="text-green-500/40" />
                      <span className="text-[10px] font-black uppercase tracking-widest">146.7K</span>
                    </div>
                  </div>
                  <div className="text-[11px] font-black text-white/10 italic tracking-[0.3em] uppercase">
                    Track {track.id.replace("track-", "")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Star Rating */}
        <section className="w-full flex justify-center mb-16 animate-entrance-up delay-400">
          <div className="bg-black/50 backdrop-blur-xl border border-orange-600/10 rounded-2xl p-7 shadow-2xl">
            <h4 className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-5 italic">
              Valora esta canción
            </h4>
            <StarRating
              trackId={track.id}
              onLoginRequired={() => {
                setAuthMode("login");
                setIsAuthModalOpen(true);
              }}
            />
          </div>
        </section>

        {/* Translator & Comment Interface - COMPACT (List removed from bottom) */}
        <div className="w-full space-y-6 animate-entrance-up delay-600">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl bg-black/60 backdrop-blur-2xl p-1.5 rounded-full border border-green-600/10 shadow-2xl flex items-center justify-between overflow-hidden">
              <div className="flex items-center gap-3 pl-6 text-white/20">
                <Languages size={14} />
                <span className="text-[8px] font-black uppercase tracking-[0.4em] italic">
                  Traductor Runa:
                </span>
              </div>
              <div className="flex gap-2 pr-1">
                {[
                  { id: "es", label: "Español" },
                  { id: "qu", label: "Quechua" },
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setActiveLang(lang.id as "es" | "qu")}
                    className={`px-8 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all italic ${activeLang === lang.id ? "bg-gradient-to-r from-orange-600 to-green-600 text-white shadow-lg shadow-orange-600/20" : "text-white/20 hover:text-white hover:bg-white/5"}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full bg-black/40 backdrop-blur-2xl rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-white/5 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <textarea
                value={transInput}
                onChange={(e) => setTransInput(e.target.value)}
                placeholder="Escribe aquí para traducir o comentar..."
                className="w-full h-64 bg-white/[0.03] rounded-3xl p-8 text-base font-medium outline-none resize-none border border-white/5 focus:border-green-500/30 transition-all leading-relaxed placeholder:text-white/10 shadow-inner"
              />
            </div>

            <div className="w-full md:w-64 flex flex-col gap-4">
              <button 
                onClick={handleTranslate} 
                disabled={isTranslating}
                className="relative flex-1 bg-zinc-900/40 backdrop-blur-xl border-2 border-green-500/20 rounded-[2rem] flex flex-col items-center justify-center gap-3 group overflow-hidden transition-all duration-500 hover:border-green-500 hover:shadow-[0_0_40px_rgba(34,197,94,0.2)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/0 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <RefreshCw size={28} className={`text-green-500 group-hover:text-white transition-all duration-700 ${isTranslating ? "animate-spin" : "group-hover:rotate-180"}`} />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-green-500 group-hover:text-white transition-colors italic">Traducir</span>
                {/* Subtle shine effect */}
                <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] group-hover:animate-shine" />
              </button>

              <button 
                onClick={handlePostComment}
                className="relative flex-1 bg-gradient-to-br from-orange-600 to-orange-700 rounded-[2rem] flex flex-col items-center justify-center gap-3 group overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(234,88,12,0.4)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Send size={28} className="text-white group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white italic">Publicar</span>
                {/* Subtle shine effect */}
                <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover:animate-shine" />
              </button>

              <Link 
                href="/musical/historial"
                className="py-7 bg-white/5 border-2 border-white/5 rounded-[2rem] flex flex-col items-center justify-center gap-2 group hover:bg-zinc-900 hover:border-green-500/50 transition-all duration-500 shadow-2xl relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500 transition-colors duration-500">
                    <RefreshCw size={14} className="text-green-500 group-hover:text-white" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-green-500 transition-colors italic">Ver Historial</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* High-Fidelity Toast Notification */}
      <div className={`fixed top-10 right-10 z-[300] transition-all duration-700 transform ${showToast ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0 pointer-events-none"}`}>
        <div className="bg-zinc-900/80 backdrop-blur-2xl border-2 border-green-500/20 rounded-2xl px-6 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/30 group-hover:bg-green-500 transition-colors duration-500">
            <Sparkles size={18} className="text-green-500 group-hover:text-white" />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white italic">Comentario Enviado</p>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">Tu huella ha sido registrada</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MusicalPlayer;
