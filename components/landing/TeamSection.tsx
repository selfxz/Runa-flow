"use client";
import React, { useRef } from "react";
import { teamMembers } from "@/data/team";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function TeamSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Cinematic Stagger for Title
    gsap.from(".section-title > *", {
      scrollTrigger: {
        trigger: ".section-title",
        start: "top 85%",
        toggleActions: "play none none none"
      },
      y: 50,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: "power4.out"
    });

    // Sequential Reveal for Team Members (Stagger on Scroll)
    gsap.from(".team-member", {
      scrollTrigger: {
        trigger: ".team-grid",
        start: "top 80%",
        toggleActions: "play none none none"
      },
      y: 80,
      opacity: 0,
      scale: 0.9,
      stagger: 0.08,
      duration: 1.2,
      ease: "power3.out",
      clearProps: "all"
    });
  }, { scope: container });

  return (
    <section ref={container} className="py-24 px-10 flex flex-col items-center overflow-hidden bg-transparent">
      <div className="max-w-7xl w-full">
        <div className="mb-20 space-y-4 section-title">
          <h3 className="text-[10px] font-black uppercase tracking-[0.6em] text-orange-600">Nuestro Colectivo</h3>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] italic text-white">
            Mentes <br /> Maestras
          </h2>
        </div>

        <div className="team-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-16">
          {teamMembers.map((member) => (
            <div key={member.name} className="team-member group flex flex-col gap-4 perspective-1000">
              <a 
                href={member.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative aspect-[4/5] overflow-hidden rounded-sm bg-zinc-900 border border-white/5 transition-all duration-700 group-hover:border-orange-600/50 group-hover:shadow-[0_0_50px_rgba(234,88,12,0.25)] group-hover:-translate-y-3 block"
              >
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover object-top transition-all duration-1000 group-hover:scale-110 grayscale-[50%] group-hover:grayscale-0 brightness-90 group-hover:brightness-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=18181b&color=ea580c&size=512&bold=true`;
                  }}
                />
                {/* Cinematic Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                
                {/* Dynamic Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-700" />
              </a>
              
              <div className="space-y-1.5 px-1">
                <h4 className="text-[13px] font-black uppercase tracking-tight italic text-white group-hover:text-orange-500 transition-colors duration-500 truncate">
                  {member.name}
                </h4>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-600 italic">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

