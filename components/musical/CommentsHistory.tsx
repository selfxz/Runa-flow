"use client";
import React, { useState, useSyncExternalStore, useMemo } from "react";
import { MessageSquare, Send, Users, Clock } from "lucide-react";

export interface CommentData {
  id: number;
  user: string;
  text: string;
  trackId: string;
  trackTitle: string;
  date: string;
  timestamp: number;
}

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
  }
  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", callback);
    }
  };
}

function getSnapshot() {
  if (typeof window === "undefined") return "[]";
  return localStorage.getItem("runa_comments") || "[]";
}

function getServerSnapshot() {
  return "[]";
}

function saveComments(data: CommentData[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("runa_comments", JSON.stringify(data));
  }
  listeners.forEach(callback => callback());
}

interface CommentsHistoryProps {
  trackId: string;
  trackTitle: string;
  userEmail: string | null;
  onLoginRequired: () => void;
}

export default function CommentsHistory({ trackId, trackTitle, userEmail, onLoginRequired }: CommentsHistoryProps) {
  const commentsJson = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const comments = useMemo(() => {
    try {
      return JSON.parse(commentsJson) as CommentData[];
    } catch {
      return [];
    }
  }, [commentsJson]);

  const [newComment, setNewComment] = useState("");

  const isGlobalView = trackId === "all";

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    if (!userEmail) { onLoginRequired(); return; }
    if (isGlobalView) return; // Can't post from global view
    const comment: CommentData = {
      id: Date.now(), user: userEmail.split("@")[0], text: newComment.trim(),
      trackId, trackTitle,
      date: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
      timestamp: Date.now(),
    };
    const updated = [comment, ...comments];
    saveComments(updated);
    setNewComment("");
  };

  const displayComments = isGlobalView ? comments : comments.filter(c => c.trackId === trackId);

  return (
    <div className="w-full bg-black/60 backdrop-blur-xl text-white rounded-3xl p-8 lg:p-12 shadow-2xl border border-green-600/10 relative overflow-hidden">
      {/* Green/orange glow */}
      <div className="absolute -top-px left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border-b border-green-600/10 pb-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <MessageSquare size={22} className="text-white" />
          </div>
          <div>
            <h4 className="text-xl font-black uppercase italic tracking-tight text-white">Historial de Comentarios</h4>
            <p className="text-green-500/40 text-[9px] font-bold uppercase tracking-widest mt-0.5">
              {isGlobalView ? "Todos los tracks" : trackTitle} — Comunidad Runa Flow
            </p>
          </div>
        </div>
      </div>

      {/* Add Comment (only in track-specific view) */}
      {!isGlobalView && (
        <div className="mb-8 flex gap-3">
          <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)}
            placeholder={userEmail ? "Escribe tu comentario..." : "Inicia sesión para comentar..."}
            disabled={!userEmail}
            className="flex-1 bg-white/5 border border-green-600/10 rounded-xl px-5 py-3 text-sm font-medium outline-none resize-none h-20 placeholder:text-white/10 focus:border-green-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed" />
          <button onClick={userEmail ? handleAddComment : onLoginRequired}
            className="self-end px-6 py-3 bg-gradient-to-r from-orange-600 to-green-600 text-white rounded-xl font-black uppercase italic text-[10px] tracking-widest hover:opacity-90 transition-all shadow-lg flex items-center gap-2 shrink-0">
            <Send size={14} /> Enviar
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-5 max-h-[500px] overflow-y-auto custom-scrollbar pr-3">
        {displayComments.length === 0 && (
          <div className="text-center py-14 opacity-20">
            <Users size={36} className="mx-auto mb-3" />
            <p className="text-sm font-black uppercase tracking-widest italic">No hay comentarios aún</p>
          </div>
        )}
        {displayComments.map((c) => (
          <div key={c.id} className="group border-l-2 border-green-600/20 hover:border-green-500 pl-5 py-2.5 transition-all duration-300">
            <p className="text-sm text-white/80 font-medium leading-relaxed group-hover:text-white transition-colors">&quot;{c.text}&quot;</p>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="text-[10px] text-orange-600 font-black uppercase tracking-widest italic opacity-60 group-hover:opacity-100 transition-opacity">@ {c.user}</span>
              <span className="text-[8px] text-green-500/40 font-bold uppercase tracking-widest bg-green-500/5 px-2.5 py-0.5 rounded-full">{c.trackTitle}</span>
              <span className="text-[8px] text-white/10 font-bold uppercase tracking-widest flex items-center gap-1 ml-auto"><Clock size={9} /> {c.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
