"use client";
import React, { useState, useEffect, useCallback } from "react";
import BackgroundAnimation from "@/components/landing/BackgroundAnimation";
import AuthModal from "@/components/musical/AuthModal";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Star,
  Send,
  MessageSquare,
  User,
  Clock,
  Sparkles,
  LogIn,
  LogOut,
  CornerUpLeft,
  Disc,
  Flame,
  Trash2,
} from "lucide-react";

/* ═══ Video Data ═══ */
const warmiVideos = [
  {
    id: "warmi-video-1",
    title: "Conoce a Farrah",
    driveLink: "https://drive.google.com/file/d/1HAJvjRTJ0C9-QcfFgb1qS4YNDZecxkkO/view?usp=sharing",
    embedUrl: "/videos/parte_1.mp4",
  },
  {
    id: "warmi-video-2",
    title: "Tips para generar tus líricas",
    driveLink: "https://drive.google.com/file/d/1HAJvjRTJ0C9-QcfFgb1qS4YNDZecxkkO/view?usp=sharing",
    embedUrl: "/videos/parte_2.mp4",
  },
  {
    id: "warmi-video-3",
    title: "Hora de crear nuestra lírica",
    driveLink: "https://drive.google.com/file/d/1HAJvjRTJ0C9-QcfFgb1qS4YNDZecxkkO/view?usp=sharing",
    embedUrl: "/videos/parte_3.mp4",
  },
];

/* ═══ Interfaces ═══ */
interface Comment {
  id: string;
  userName: string;
  userEmail: string;
  text: string;
  timestamp: number;
  videoId: string;
}

/* ═══ WarmiFlow StarRating (per-video) ═══ */
function WarmiStarRating({
  videoId,
  onLoginRequired,
}: {
  videoId: string;
  onLoginRequired: () => void;
}) {
  const { user } = useAuth();
  const [hover, setHover] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);

  const fetchRatings = useCallback(async () => {
    const { data: allRatings, error: allErr } = await supabase
      .from("warmi_ratings")
      .select("stars")
      .eq("video_id", videoId);

    if (!allErr && allRatings) {
      setCount(allRatings.length);
      if (allRatings.length > 0) {
        const sum = allRatings.reduce((acc, r) => acc + r.stars, 0);
        setAverage(sum / allRatings.length);
      } else {
        setAverage(0);
      }
    }

    if (user) {
      const { data: uRating, error: uErr } = await supabase
        .from("warmi_ratings")
        .select("stars")
        .eq("video_id", videoId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (!uErr && uRating) {
        setUserRating(uRating.stars);
      } else {
        setUserRating(0);
      }
    }
  }, [videoId, user]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const handleRate = async (stars: number) => {
    if (!user) {
      onLoginRequired();
      return;
    }

    const { error } = await supabase.from("warmi_ratings").upsert(
      {
        user_id: user.id,
        video_id: videoId,
        stars: stars,
      },
      { onConflict: "user_id,video_id" }
    );

    if (!error) {
      setUserRating(stars);
      fetchRatings();
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= (hover || userRating);
          return (
            <button
              key={star}
              onClick={() => handleRate(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className={`transition-all duration-200 hover:scale-125 active:scale-95 ${
                isFilled
                  ? "text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]"
                  : "text-white/15 hover:text-white/30"
              }`}
            >
              <Star size={32} fill={isFilled ? "currentColor" : "none"} />
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-4 text-center">
        {count > 0 && (
          <>
            <span className="text-2xl font-black text-yellow-400 italic">
              {average.toFixed(1)}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">
              {count} {count === 1 ? "voto" : "votos"}
            </span>
          </>
        )}
        {count === 0 && (
          <span className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">
            Sin valoraciones aún
          </span>
        )}
      </div>
      {userRating > 0 && (
        <span className="text-[9px] font-bold text-green-500/60 uppercase tracking-widest">
          ★ Tu voto: {userRating}/5
        </span>
      )}
    </div>
  );
}

/* ═══ Main Page ═══ */
export default function WarmiFlowPage() {
  const router = useRouter();
  const { user, logout, setIsAuthModalOpen, setAuthMode } = useAuth();
  const [currentVideo, setCurrentVideo] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showToast, setShowToast] = useState(false);

  const video = warmiVideos[currentVideo];

  /* ═══ Load comments ═══ */
  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("warmi_comments")
        .select("*")
        .eq("video_id", video.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setComments(
          data.map((c) => ({
            id: c.id,
            userName: c.user_name || c.user_email.split("@")[0],
            userEmail: c.user_email,
            text: c.comment_text,
            timestamp: new Date(c.created_at).getTime(),
            videoId: c.video_id,
          }))
        );
      }
    };

    fetchComments();

    const channel = supabase
      .channel(`warmi_comments_${video.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "warmi_comments",
          filter: `video_id=eq.${video.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newC = payload.new;
            setComments((prev) => [
              {
                id: newC.id,
                userName: newC.user_name || newC.user_email.split("@")[0],
                userEmail: newC.user_email,
                text: newC.comment_text,
                timestamp: new Date(newC.created_at).getTime(),
                videoId: newC.video_id,
              },
              ...prev,
            ]);
          } else if (payload.eventType === "DELETE") {
            setComments((prev) =>
              prev.filter((c) => c.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [video.id]);

  const handlePostComment = async () => {
    if (!user) {
      setAuthMode("login");
      setIsAuthModalOpen(true);
      return;
    }
    if (!newComment.trim()) return;

    const { error } = await supabase.from("warmi_comments").insert({
      user_id: user.id,
      user_email: user.email,
      user_name: user.fullName,
      video_id: video.id,
      comment_text: newComment,
    });

    if (error) {
      alert("Error al enviar comentario: " + error.message);
      return;
    }

    setNewComment("");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const goNext = () =>
    setCurrentVideo((prev) => (prev + 1) % warmiVideos.length);
  const goPrev = () =>
    setCurrentVideo(
      (prev) => (prev - 1 + warmiVideos.length) % warmiVideos.length
    );

  return (
    <main className="min-h-screen w-full bg-black relative font-['Inter'] flex flex-col overflow-x-hidden text-white">
      <BackgroundAnimation hideImage={true} />
      <AuthModal />

      {/* Background layers */}
      <div className="fixed inset-0 -z-50 bg-[#0a0a0a]" />
      <div className="fixed inset-0 -z-40 bg-gradient-to-br from-[#1a0a20] via-[#0a0a0a] to-[#0d1a0d]" />
      <div className="fixed inset-0 -z-30 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]" />

      {/* Purple accent glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/8 rounded-full blur-[150px] pointer-events-none" />

      {/* ═══ Navigation ═══ */}
      <nav className="w-full flex items-center justify-between px-4 md:px-12 py-4 md:py-8 relative z-50 gap-2 md:gap-4 animate-entrance-up">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => router.push("/musical/historial")}
            className="flex items-center gap-2 md:gap-3 bg-green-600/10 border-2 border-green-600/20 px-4 md:px-8 py-2 md:py-3.5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-green-600 hover:text-white hover:border-green-600 transition-all italic group shadow-xl"
          >
            <Disc
              size={16}
              className="group-hover:rotate-180 transition-transform duration-700 text-green-500 group-hover:text-white"
            />
            <span className="text-green-500 group-hover:text-white hidden sm:inline">
              HISTORIAL
            </span>
          </button>
          <button
            onClick={() => router.push("/musical")}
            className="flex items-center gap-2 md:gap-3 bg-orange-600 border-2 border-orange-600 px-4 md:px-10 py-2 md:py-3.5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] text-white hover:bg-white hover:text-orange-600 transition-all italic group shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:shadow-none"
          >
            <CornerUpLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="hidden sm:inline">REGRESAR</span>
          </button>
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-2 md:gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 bg-purple-600/10 border border-purple-600/20 px-3 md:px-4 py-2 md:py-2.5 rounded-full">
                <User size={13} className="text-purple-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 hidden sm:inline">
                  {user.fullName || user.email.split("@")[0]}
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
                className="flex items-center gap-2 bg-purple-600 border border-purple-600 px-3 md:px-5 py-2 md:py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-purple-600 transition-all shadow-lg shadow-purple-600/20"
              >
                <User size={13} className="sm:hidden text-white" />
                <span className="hidden sm:inline">Registro</span>
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ═══ Content ═══ */}
      <div className="flex-1 relative z-10 w-full max-w-5xl mx-auto px-4 md:px-8 pb-20">
        {/* WarmiFlow Badge */}
        <div className="flex justify-end mb-6 animate-entrance-up delay-100">
          <div className="flex items-center gap-3 bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 border border-purple-500/30 px-6 py-3 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(147,51,234,0.15)]">
            <Flame size={18} className="text-fuchsia-400" />
            <span className="text-sm md:text-base font-black uppercase tracking-[0.3em] bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent italic">
              WarmiFlow
            </span>
          </div>
        </div>

        {/* ═══ Intro Text (Static) ═══ */}
        <div className="mb-10 animate-entrance-up delay-200">
          <div className="relative">
            <div className="relative bg-white/[0.03] backdrop-blur-xl border border-purple-500/10 rounded-[2rem] p-6 md:p-10 shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
              <p className="text-sm md:text-base text-white/70 font-medium leading-relaxed italic tracking-tight">
                En Warmiflow, junto a Farrah, descubrirás cómo el hip hop puede convertirse en una herramienta de expresión, identidad y creatividad. Aquí conocerás el propósito del taller, los temas que desarrollarás y encontrarás recursos diseñados para acompañarte en cada etapa de tu proceso creativo. Queremos que este sea un lugar seguro donde puedas aprender, explorar tu voz, conectar con otras mujeres y sentirte parte de una comunidad que impulsa el arte y el empoderamiento femenino.
              </p>
            </div>
          </div>
        </div>

        {/* ═══ Dynamic Title ═══ */}
        <div className="mb-8 animate-entrance-up delay-300">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={12} className="text-purple-400" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-purple-400/60">
              Reproduciendo
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-purple-400 bg-clip-text text-transparent">
              {video.title}
            </span>
          </h1>
        </div>

        {/* ═══ Video Player + Navigation ═══ */}
        <div className="relative mb-10 animate-entrance-glow delay-400">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/10 to-fuchsia-600/10 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-purple-500/20 rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
              {/* Video Area */}
              <div className="relative aspect-video bg-gradient-to-br from-purple-900/40 via-zinc-900 to-fuchsia-900/40 flex items-center justify-center">
                {video.embedUrl ? (
                  <video
                    key={video.id} // Force re-render on video change
                    src={video.embedUrl}
                    className="w-full h-full object-cover"
                    controls
                    controlsList="nodownload"
                    playsInline
                  >
                    Tu navegador no soporta el elemento de video.
                  </video>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <Flame size={40} className="text-purple-400/50" />
                    </div>
                    <p className="text-white/20 text-sm font-black uppercase tracking-[0.3em] italic">
                      Vídeo {currentVideo + 1} de {warmiVideos.length}
                    </p>
                    <p className="text-white/10 text-[10px] font-bold uppercase tracking-widest">
                      Enlace de video pendiente
                    </p>
                  </div>
                )}

                {/* Navigation Arrows */}
                <button
                  onClick={goPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-purple-600/80 hover:border-purple-500 transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-purple-600/80 hover:border-purple-500 transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Video Indicator Dots */}
              <div className="flex items-center justify-center gap-3 py-5 bg-black/40">
                {warmiVideos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentVideo(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      idx === currentVideo
                        ? "w-10 h-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 shadow-[0_0_15px_rgba(147,51,234,0.5)]"
                        : "w-3 h-3 bg-white/10 hover:bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Drive Link Button ═══ */}
        <div className="flex justify-center mb-12 animate-entrance-up delay-500">
          <a
            href={video.driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-3 bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 border-2 border-purple-500/30 px-8 md:px-12 py-4 rounded-2xl hover:border-purple-400 hover:shadow-[0_0_40px_rgba(147,51,234,0.3)] transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-fuchsia-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <ExternalLink
              size={20}
              className="text-purple-400 group-hover:text-white transition-colors relative z-10"
            />
            <span className="text-[12px] font-black uppercase tracking-[0.3em] text-purple-300 group-hover:text-white transition-colors italic relative z-10">
               Libreta A5 WarmiFlow
            </span>
            <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:animate-shine" />
          </a>
        </div>

        {/* ═══ Comments + Stars Section ═══ */}
        <div className="animate-entrance-up delay-600">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Comments Box */}
            <div className="flex-1">
              <div className="relative bg-white/[0.02] backdrop-blur-xl border-2 border-purple-500/20 rounded-[2.5rem] p-6 md:p-10 shadow-2xl overflow-hidden">
                {/* Top accent line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

                {/* Header */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-purple-500/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg">
                    <MessageSquare size={22} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase italic tracking-tight text-white">
                      Caja de Comentarios
                    </h4>
                    <p className="text-purple-500/40 text-[9px] font-bold uppercase tracking-widest mt-0.5">
                      {video.title} — Comunidad WarmiFlow
                    </p>
                  </div>
                </div>

                {/* Input Area */}
                <div className="mb-8 flex flex-col sm:flex-row gap-3">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onFocus={() => {
                      if (!user) {
                        setAuthMode("login");
                        setIsAuthModalOpen(true);
                      }
                    }}
                    placeholder="Escribe tu comentario sobre este video..."
                    className="flex-1 bg-white/5 border border-purple-500/10 rounded-2xl px-5 py-4 text-sm font-medium outline-none resize-none h-24 placeholder:text-white/10 focus:border-purple-500/30 transition-all"
                  />
                  <button
                    onClick={
                      user
                        ? handlePostComment
                        : () => {
                            setAuthMode("login");
                            setIsAuthModalOpen(true);
                          }
                    }
                    className="self-end px-6 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl font-black uppercase italic text-[10px] tracking-widest hover:opacity-90 transition-all shadow-lg flex items-center gap-2 shrink-0 hover:shadow-[0_0_30px_rgba(147,51,234,0.3)]"
                  >
                    <Send size={14} /> Enviar
                  </button>
                </div>

                {/* Comments List */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                  {comments.length === 0 && (
                    <div className="text-center py-14 opacity-20">
                      <MessageSquare size={36} className="mx-auto mb-3" />
                      <p className="text-sm font-black uppercase tracking-widest italic">
                        No hay comentarios aún
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-widest mt-2">
                        Sé la primera en comentar
                      </p>
                    </div>
                  )}
                  {comments.map((c) => (
                    <div
                      key={c.id}
                      className="group/comment border-l-2 border-purple-500/20 hover:border-fuchsia-500 pl-5 py-3 transition-all duration-300 relative"
                    >
                      <p className="text-sm text-white/80 font-medium leading-relaxed group-hover/comment:text-white transition-colors italic">
                        &quot;{c.text}&quot;
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <User size={10} className="text-purple-400" />
                          </div>
                          <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest italic">
                            {c.userName}
                          </span>
                        </div>
                        <span className="text-[8px] text-white/10 font-bold uppercase tracking-widest flex items-center gap-1 ml-auto">
                          <Clock size={9} />
                          {new Date(c.timestamp).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Star Rating */}
            <div className="lg:w-72 shrink-0">
              <div className="bg-white/[0.02] backdrop-blur-xl border-2 border-purple-500/20 rounded-[2.5rem] p-8 shadow-2xl text-center sticky top-8">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />

                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-6 italic">
                  Valora este video
                </h4>

                <WarmiStarRating
                  videoId={video.id}
                  onLoginRequired={() => {
                    setAuthMode("login");
                    setIsAuthModalOpen(true);
                  }}
                />

                <div className="mt-8 pt-6 border-t border-white/5">
                  <p className="text-[8px] font-bold text-purple-500/30 uppercase tracking-[0.4em]">
                    Video {currentVideo + 1} / {warmiVideos.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div
        className={`fixed top-10 right-10 z-[300] transition-all duration-700 transform ${
          showToast
            ? "translate-x-0 opacity-100"
            : "translate-x-20 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-zinc-900/80 backdrop-blur-2xl border-2 border-purple-500/20 rounded-2xl px-6 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/30 group-hover:bg-purple-500 transition-colors duration-500">
            <Sparkles
              size={18}
              className="text-purple-400 group-hover:text-white"
            />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white italic">
              Comentario Enviado
            </p>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">
              Tu huella ha sido registrada
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
