"use client";
import React from "react";
import { teamMembers } from "@/data/team";
import { User, Mic2, Briefcase, GraduationCap, Link as LinkIcon } from "lucide-react";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function TeamProfiles() {
  return (
    <section className="w-full py-32 px-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-600/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="mb-20 space-y-4">
          <div className="flex items-center gap-3 text-orange-600 animate-entrance-up">
            <Mic2 size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">Estructura Cultural</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white animate-entrance-up" style={{ animationDelay: '100ms' }}>
            Protagonistas del <br /> <span className="text-green-500">Movimiento</span>
          </h2>
          <p className="text-white/40 max-w-2xl text-sm font-medium leading-relaxed animate-entrance-up" style={{ animationDelay: '200ms' }}>
            Un equipo multidisciplinario que une el arte, la producción técnica y la investigación académica para fortalecer la identidad del Hip Hop en el Perú.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, i) => (
            <div 
              key={member.id}
              className="group relative bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 transition-all duration-500 hover:bg-zinc-900/60 hover:border-orange-600/30 flex flex-col h-full shadow-2xl animate-entrance-up"
              style={{ animationDelay: `${(i + 3) * 100}ms` }}
            >
              {/* Category Badge */}
              {(() => {
                const category = member.category || "Producción";
                return (
                  <div className="absolute top-8 right-8 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                    {category === "Artista" && <Mic2 size={10} className="text-orange-500" />}
                    {category === "Producción" && <Briefcase size={10} className="text-green-500" />}
                    {category === "Académico" && <GraduationCap size={10} className="text-blue-500" />}
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/60">{category}</span>
                  </div>
                );
              })()}

              {/* Header */}
              <div className="mb-8">
                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white group-hover:text-orange-500 transition-colors duration-500">
                  {member.name}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-white/30 group-hover:text-green-500/60 transition-colors">
                  <InstagramIcon />
                  <span className="text-[10px] font-bold tracking-widest uppercase italic">{member.handle}</span>
                </div>
              </div>

              {/* Bio */}
              <div className="flex-1 space-y-6">
                {member.bio && (
                  <p className="text-sm font-medium text-white/50 leading-relaxed italic border-l-2 border-white/5 pl-4 group-hover:border-green-500/30 transition-colors">
                    {member.bio}
                  </p>
                )}
                
                <div className="pt-6 border-t border-white/5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-600/10 flex items-center justify-center shrink-0 mt-1">
                      <User size={14} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Rol / Aporte</p>
                      <p className="text-[11px] font-bold text-white/80 leading-snug">{member.role}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Accent */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
